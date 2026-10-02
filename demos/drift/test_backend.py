#!/usr/bin/env python3
"""Synthetic-only collector and loopback security tests; no public requests."""
import contextlib
import copy
import email.message
import http.client
import io
import json
import os
import ssl
import subprocess
import tempfile
import threading
import time
import unittest
import urllib.error
import urllib.request
from pathlib import Path
from unittest.mock import patch

import backend as b

BROWSER = {"timezone": "Etc/UTC", "languages": ["en"], "online": True}


def synthetic(probe_id, timeout=8):
    values = {"egress.ipify": {"ip": "192.0.2.10"},
              "egress.geojs": {"ip": "198.51.100.20", "country": "ZZ", "asn": 64496}}
    return b.result(value=values.get(probe_id, {"fixture": probe_id}))


def finish(collector, scan_id):
    deadline = time.monotonic() + 3
    while time.monotonic() < deadline:
        scan = collector.get_scan(scan_id)
        if scan["status"] in {"complete", "error"}:
            # Completion is published under the same lock as clearing active state.
            with collector.lock:
                if collector.active is None:
                    return scan
        time.sleep(0.005)
    raise AssertionError("Synthetic scan did not finish")


def response(body, content_type="application/json"):
    obj = io.BytesIO(body)
    obj.headers = email.message.Message()
    obj.headers["Content-Type"] = content_type
    return obj


class ProbeTests(unittest.TestCase):
    def test_partial_and_unknown_asn_are_not_comparable(self):
        for payload in ({"ip": "8.8.8.8", "country_code": "ZZ", "asn": 64512},
                        {"ip": "8.8.8.8", "country_code": None, "asn": 13335},
                        {"ip": "8.8.8.8"}):
            data = b.parse_provider("egress.geojs", payload)
            self.assertEqual(data["status"], "unknown")
            self.assertEqual(data["value"]["ip"], "8.8.8.8")
        observation = {"id": "a", "source_id": "p", "comparison_key": "v1", "status": "success", "value": {"ip": "192.0.2.1", "asn": None}}
        complete = {**observation, "value": {"ip": "192.0.2.1", "asn": 64496}}
        self.assertIsNone(b.comparable(observation, complete))

    def test_provider_normalizes_only_allowlisted_fields(self):
        payload = {"ip": "2001:4860::1", "asn": "AS13335", "country_code": "zz", "city": "private city", "latitude": 1, "raw_secret": "omit"}
        parsed = b.parse_provider("egress.geojs", payload)
        self.assertEqual(parsed["value"], {"ip": "2001:4860::1", "asn": 13335, "country": "ZZ"})
        self.assertEqual(b.parse_provider("egress.ipify", payload)["value"], {"ip": "2001:4860::1"})
        for ip in (True, None, "bad", "https://user:secret@proxy.invalid"):
            self.assertEqual(b.parse_provider("egress.ipify", {"ip": ip})["error"], "invalid_provider_ip")

    def test_provider_asn_country_and_nonpublic_ip_validation(self):
        for asn in (True, 13335.9, 0, 23456, 64512, 65535, 65536, 4200000000, 4294967295):
            got = b.parse_provider("egress.geojs", {"ip": "8.8.8.8", "asn": asn, "country_code": "US"})
            self.assertEqual(got["status"], "unknown")
            self.assertIsNone(got["value"]["asn"])
        self.assertIsNone(b.parse_provider("egress.geojs", {"ip": "8.8.8.8", "asn": 13335, "country_code": "中国"})["value"]["country"])
        for ip in ("127.0.0.1", "192.0.2.1", "192.168.1.1", "fe80::1", "2001:db8::1"):
            self.assertEqual(b.parse_provider("egress.ipify", {"ip": ip})["status"], "unknown")
        self.assertEqual(b.parse_provider("egress.ipify", {"ip": "2001:4860::1%en0"})["status"], "error")

    def test_non_json_invalid_json_and_response_overflow(self):
        for raw, kind, expected in [(b"<html>secret</html>", "text/html", "non_json_response"),
                                    (b"invalid", "application/json", "invalid_json_response"),
                                    (b"[]", "application/json", "invalid_provider_response"),
                                    (b" " * (b.RESPONSE_LIMIT + 1), "application/json", "response_too_large")]:
            with self.subTest(expected=expected):
                got = b.provider_probe("egress.ipify", lambda *a, **k: response(raw, kind))
                self.assertEqual(got["error"], expected)
                self.assertNotIn("secret", json.dumps(got))

    def test_network_errors_are_standardized(self):
        errors = [(TimeoutError("secret proxy https://u:p@proxy.invalid"), "timeout", "unknown"),
                  (urllib.error.URLError(ssl.SSLError("secret")), "tls_validation_failed", "error"),
                  (urllib.error.HTTPError("https://secret.invalid", 302, "secret", {}, None), "redirect_refused", "error"),
                  (urllib.error.HTTPError("https://secret.invalid", 429, "secret", {}, None), "http_error", "error"),
                  (urllib.error.URLError("https://user:password@proxy.invalid"), "network_unavailable", "unknown")]
        for exception, code, status in errors:
            got = b.network_failure(exception)
            self.assertEqual((got["error"], got["status"]), (code, status))
            self.assertNotIn("secret", json.dumps(got))
            self.assertNotIn("password", json.dumps(got))

    def test_redirect_is_never_followed(self):
        self.assertIsNone(b.RefuseRedirect().redirect_request(None, None, 302, "", {}, "http://127.0.0.1/private"))
        hits = []

        class RedirectHandler(b.BaseHTTPRequestHandler):
            def do_GET(self):
                hits.append(self.path)
                self.send_response(302)
                self.send_header("Location", "/private")
                self.end_headers()

            def log_message(self, *args):
                pass

        server = b.ThreadingHTTPServer(("127.0.0.1", 0), RedirectHandler)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            with self.assertRaises(urllib.error.HTTPError) as redirected:
                b.opener().open(f"http://127.0.0.1:{server.server_port}/start", timeout=1)
            redirected.exception.close()
            self.assertEqual(hits, ["/start"])
        finally:
            server.shutdown()
            server.server_close()

    def test_proxy_configuration_is_followed_and_value_not_exported(self):
        with patch.dict(os.environ, {"HTTPS_PROXY": "http://user:secret@proxy.invalid:1234", "https_proxy": "http://user:secret@proxy.invalid:1234"}, clear=True):
            got = b.local_probe("local.proxy")
            self.assertEqual(got["value"], {"configured": True})
            handler = next(h for h in b.opener().handlers if isinstance(h, urllib.request.ProxyHandler))
            self.assertIn("secret@proxy.invalid", handler.proxies["https"])
            self.assertNotIn("secret", json.dumps(got))

    def test_probe_subprocess_wall_timeout_and_fixed_argv(self):
        with patch.object(b.subprocess, "run", side_effect=subprocess.TimeoutExpired("secret", 0.01)) as run:
            got = b.isolated_probe("dns.example", timeout=0.01)
            self.assertEqual((got["status"], got["error"]), ("unknown", "timeout"))
            argv = run.call_args.args[0]
            self.assertEqual(argv[-2:], ["--probe", "dns.example"])
            self.assertNotIn("shell", run.call_args.kwargs)
        with patch.object(b.subprocess, "run", return_value=subprocess.CompletedProcess([], 0, b" " * (b.RESPONSE_LIMIT + 1))):
            self.assertEqual(b.isolated_probe("dns.example")["error"], "probe_failed")

    def test_dns_configuration_platform_timeout_and_whitelist(self):
        with patch.object(b.platform, "system", return_value="Windows"):
            self.assertEqual(b.dns_configuration()["status"], "unsupported")
        with patch.object(b.platform, "system", return_value="Darwin"), patch.object(b.subprocess, "run", side_effect=subprocess.TimeoutExpired("scutil", 3)):
            self.assertEqual(b.dns_configuration()["status"], "unknown")
        output = b"resolver #1\n nameserver[0] : 192.0.2.53\n nameserver[1] : 2001:db8::53\n domain : private.invalid\n"
        with patch.object(b.platform, "system", return_value="Darwin"), patch.object(b.subprocess, "run", return_value=subprocess.CompletedProcess([], 0, output)) as run:
            got = b.dns_configuration()
            self.assertEqual(got["value"], {"nameservers": ["192.0.2.53", "2001:db8::53"]})
            self.assertNotIn("private.invalid", json.dumps(got))
            self.assertEqual(run.call_args.args[0], ["/usr/sbin/scutil", "--dns"])

    def test_tls_metadata_unavailable_is_not_success(self):
        got = b.tls_probe("tls.example", lambda *a, **k: response(b""))
        self.assertEqual((got["status"], got["error"]), ("unsupported", "transport_metadata_unavailable"))

    def test_compare_unknown_method_change_and_canonical_values(self):
        obs = {"id": "a", "source_id": "one", "comparison_key": "v1", "status": "success", "value": {"a": 1, "b": False}}
        self.assertFalse(b.comparable(obs, {**obs, "value": {"b": False, "a": 1}}))
        self.assertTrue(b.comparable(obs, {**obs, "value": {"a": 2, "b": False}}))
        for altered in ({"status": "unknown"}, {"value": None}, {"value": {"a": None}}, {"source_id": "two"}, {"comparison_key": "v2"}, {"value": []}, {"value": ""}):
            self.assertIsNone(b.comparable(obs, {**obs, **altered}))


class CollectorTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix="drift-unit-")
        self.addCleanup(self.tmp.cleanup)
        self.collector = b.Collector(self.tmp.name, runner=synthetic, history_limit=2)

    def scan(self, collector=None):
        collector = collector or self.collector
        scan = collector.start(BROWSER)
        return finish(collector, scan["id"])

    def test_conflicting_providers_stay_independent(self):
        scan = self.scan()
        rows = {o["id"]: o for o in scan["observations"]}
        self.assertNotEqual(rows["egress.ipify"]["value"]["ip"], rows["egress.geojs"]["value"]["ip"])
        self.assertEqual(rows["egress.ipify"]["source_id"], "egress.ipify")
        self.assertTrue(rows["egress.ipify"]["sensitive"])
        self.assertEqual(scan["progress"]["done"], scan["progress"]["total"])
        self.assertNotIn("risk", json.dumps(scan))

    def test_partial_scan_completes_and_preserves_success(self):
        def partial(id_, timeout):
            if id_ == "egress.ipify":
                return b.result("unknown", error="timeout")
            if id_ == "tls.example":
                return b.result("error", error="tls_validation_failed")
            return synthetic(id_, timeout)

        self.collector.runner = partial
        scan = self.scan()
        self.assertEqual(scan["status"], "complete")
        self.assertEqual((scan["summary"]["unknown"], scan["summary"]["error"]), (1, 1))
        self.assertGreater(scan["summary"]["success"], 0)

    def test_concurrent_scan_and_unfinished_pin_rejected(self):
        entered, release = threading.Event(), threading.Event()

        def hold(id_, timeout):
            entered.set()
            release.wait(2)
            return synthetic(id_, timeout)

        self.collector.runner = hold
        first = self.collector.start(BROWSER)
        self.assertTrue(entered.wait(1))
        try:
            with self.assertRaises(b.APIError) as busy:
                self.collector.start(BROWSER)
            self.assertEqual(busy.exception.body["error"]["scan_id"], first["id"])
            with self.assertRaises(b.APIError) as pin:
                self.collector.pin(first["id"])
            self.assertEqual(pin.exception.body["error"]["code"], "scan_not_complete")
            self.assertEqual(len(first["observations"]), len(b.PROBES))
        finally:
            release.set()
            finish(self.collector, first["id"])

    def test_total_scan_deadline_skips_remaining_tasks(self):
        called = []

        def one_slow(id_, timeout):
            called.append(timeout)
            time.sleep(0.025)
            return b.result("unknown", error="timeout")

        collector = b.Collector(self.tmp.name, runner=one_slow, scan_timeout=0.01)
        scan = self.scan(collector)
        self.assertEqual(len(called), 1)
        self.assertLessEqual(called[0], 0.01)
        self.assertEqual(scan["status"], "complete")
        self.assertEqual(scan["summary"]["unknown"], len(b.PROBES))

    def test_pinned_baseline_survives_history_prune_and_restart(self):
        first = self.scan()
        self.collector.pin(first["id"])
        expected = copy.deepcopy(first)
        self.collector.runner = lambda id_, timeout: b.result(value={"new": id_})
        for _ in range(3):
            self.scan()
        self.assertEqual(len(self.collector.scans), 2)
        self.assertEqual(self.collector.get_baseline()["scan"], expected)
        self.assertEqual(self.collector.get_scan(first["id"]), expected)
        restarted = b.Collector(self.tmp.name, runner=synthetic, history_limit=2)
        self.assertEqual(restarted.get_baseline()["scan"], expected)
        self.assertNotEqual(restarted.csrf, self.collector.csrf)
        restarted.get_baseline()["scan"]["observations"][0]["value"] = "altered client copy"
        self.assertEqual(restarted.get_baseline()["scan"], expected)
        last = self.scan(restarted)
        restarted.pin(last["id"])
        self.assertEqual(restarted.get_baseline()["baseline_id"], last["id"])

    def test_private_store_permissions_and_repo_rejection(self):
        self.scan()
        self.assertEqual(Path(self.tmp.name).stat().st_mode & 0o777, 0o700)
        self.assertEqual(self.collector.store.path.stat().st_mode & 0o777, 0o600)
        with self.assertRaises(ValueError):
            b.PrivateStore(b.HERE / "observations")
        link = Path(self.tmp.name) / "link"
        link.symlink_to(self.tmp.name, target_is_directory=True)
        with self.assertRaises(ValueError):
            b.PrivateStore(link)

    def test_failed_scan_record_is_persisted_without_raw_exception(self):
        def fail(id_, timeout):
            raise RuntimeError("secret proxy https://user:password@proxy.invalid")

        self.collector.runner = fail
        scan = self.scan()
        self.assertEqual(scan["status"], "error")
        self.assertEqual(scan["progress"]["done"], scan["progress"]["total"])
        restarted = b.Collector(self.tmp.name, runner=synthetic)
        self.assertEqual(restarted.get_scan(scan["id"])["status"], "error")
        self.assertNotIn("password", self.collector.store.path.read_text())

    def test_failed_pin_preserves_original_baseline(self):
        first = self.scan()
        self.collector.pin(first["id"])
        second = self.scan()
        with patch.object(self.collector.store, "save", side_effect=OSError("secret path")):
            with self.assertRaises(b.APIError) as error:
                self.collector.pin(second["id"])
            self.assertEqual(error.exception.body["error"]["code"], "storage_unavailable")
        self.assertEqual(self.collector.get_baseline()["scan"], first)

    def test_corrupt_or_oversized_store_does_not_get_overwritten(self):
        path = self.collector.store.path
        for raw in (b"not json", b"x" * (b.STATE_LIMIT + 1)):
            path.write_bytes(raw)
            with self.assertRaises(ValueError):
                b.Collector(self.tmp.name, runner=synthetic)
            self.assertEqual(path.read_bytes(), raw)

    def test_structurally_invalid_stored_scan_fails_closed(self):
        scan = self.scan()
        del scan["started_at"]
        raw = json.dumps({"version": b.VERSION, "scans": [scan], "baseline": None}).encode()
        self.collector.store.path.write_bytes(raw)
        with self.assertRaises(ValueError):
            b.Collector(self.tmp.name)
        self.assertEqual(self.collector.store.path.read_bytes(), raw)


class HTTPTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix="drift-http-")
        self.collector = b.Collector(self.tmp.name, runner=synthetic)
        self.server = b.Server(0, self.collector)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.addCleanup(self.cleanup)

    def cleanup(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()
        self.tmp.cleanup()

    def request(self, method, path, body=None, headers=None, authenticated=True):
        base = {}
        if method == "POST" and authenticated:
            base = {"Origin": self.server.origin, "X-Drift-CSRF": self.collector.csrf, "Content-Type": "application/json"}
        base.update(headers or {})
        if isinstance(body, dict) or isinstance(body, list):
            body = json.dumps(body)
        connection = http.client.HTTPConnection("127.0.0.1", self.server.server_port, timeout=3)
        connection.request(method, path, body=body, headers=base)
        response_ = connection.getresponse()
        raw = response_.read()
        result_ = response_.status, dict(response_.getheaders()), raw
        connection.close()
        return result_

    def test_bootstrap_scan_baseline_end_to_end(self):
        status, headers, raw = self.request("GET", "/api/bootstrap")
        self.assertEqual(status, 200)
        self.assertEqual(json.loads(raw)["scans"], [])
        self.assertEqual(headers["Cache-Control"], "no-store")
        self.assertNotIn("Access-Control-Allow-Origin", headers)
        status, _, raw = self.request("POST", "/api/scans", {"browser": BROWSER})
        self.assertEqual(status, 202)
        id_ = json.loads(raw)["scan"]["id"]
        finish(self.collector, id_)
        self.assertEqual(self.request("GET", "/api/scans/" + id_)[0], 200)
        self.assertEqual(self.request("POST", "/api/baseline", {"scan_id": id_})[0], 200)
        self.assertEqual(json.loads(self.request("GET", "/api/baseline")[2])["baseline_id"], id_)

    def test_host_origin_cross_site_and_csrf_rejected(self):
        for headers, expected in [({"Host": "attacker.invalid"}, "invalid_host"),
                                  ({"Origin": "http://attacker.invalid"}, "invalid_origin"),
                                  ({"Sec-Fetch-Site": "cross-site"}, "cross_site_request"),
                                  ({"X-Drift-CSRF": "old-token"}, "invalid_csrf"),
                                  ({"X-Drift-CSRF": "é"}, "invalid_csrf")]:
            status, _, raw = self.request("POST", "/api/scans", {}, headers)
            self.assertEqual(status, 403)
            self.assertEqual(json.loads(raw)["error"]["code"], expected)
        self.assertEqual(self.request("POST", "/api/scans", "{}", authenticated=False)[0], 403)
        self.assertEqual(self.request("GET", "/api/bootstrap", headers={"Origin": "null"})[0], 403)
        self.assertIsNone(self.collector.active)

    def test_stale_csrf_after_session_restart_is_rejected(self):
        token = self.collector.csrf
        replacement = b.Collector(self.tmp.name, runner=synthetic)
        self.server.collector = replacement
        self.assertEqual(self.request("POST", "/api/scans", {}, {"X-Drift-CSRF": token})[0], 403)

    def test_only_whitelisted_static_files_served(self):
        for path in ("/", "/index.html", "/style.css", "/app.js"):
            self.assertEqual(self.request("GET", path)[0], 200)
        for path in ("/backend.py", "/test_backend.py", "/README.md", "/../AGENTS.md", "/%2e%2e/AGENTS.md", "/vault/", "//attacker.invalid/", "/api/scans/../../file", "/?target=http://attacker.invalid"):
            with self.subTest(path=path):
                self.assertEqual(self.request("GET", path)[0], 404)
        status, headers, _ = self.request("OPTIONS", "/api/scans")
        self.assertEqual(status, 405)
        self.assertNotIn("Access-Control-Allow-Origin", headers)

    def test_invalid_inputs_and_body_overflow_rejected(self):
        for body in ([], {"url": "http://127.0.0.1/private"}, {"browser": {"online": "true"}},
                     {"browser": {"timezone": "x" * 65}}, {"browser": {"languages": ["a"] * 17}},
                     {"browser": {"command": "arbitrary command"}}):
            self.assertEqual(self.request("POST", "/api/scans", body)[0], 400)
        self.assertEqual(self.request("POST", "/api/scans", "invalid")[0], 400)
        self.assertEqual(self.request("POST", "/api/scans", '{"browser":NaN}')[0], 400)
        self.assertEqual(self.request("POST", "/api/scans", "{}", {"Content-Type": "text/plain"})[0], 415)
        self.assertEqual(self.request("POST", "/api/scans", " " * (b.BODY_LIMIT + 1))[0], 413)
        self.assertEqual(self.request("POST", "/api/scans", "", {"Transfer-Encoding": "chunked"})[0], 400)
        self.assertIsNone(self.collector.active)

    def test_pin_invalid_and_missing_scan_rejected(self):
        self.assertEqual(self.request("POST", "/api/baseline", {"scan_id": "missing"})[0], 404)
        self.assertEqual(self.request("POST", "/api/baseline", {"scan_id": "missing", "url": "x"})[0], 400)
        self.assertEqual(self.request("GET", "/api/scans/missing")[0], 404)


if __name__ == "__main__":
    unittest.main()
