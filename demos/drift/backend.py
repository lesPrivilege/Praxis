#!/usr/bin/env python3
"""Loopback-only, read-only Drift collector using the Python standard library."""
import argparse
import copy
import datetime as dt
import hmac
import ipaddress
import json
import locale
import math
import os
import platform
import re
import secrets
import socket
import ssl
import subprocess
import sys
import tempfile
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
VERSION = "0.2"
BODY_LIMIT = 8192
RESPONSE_LIMIT = 16384
STATE_LIMIT = 2 * 1024 * 1024
HISTORY_LIMIT = 30
PROBE_TIMEOUT = 8
SCAN_TIMEOUT = 65
TARGETS = {"dns.example": "example.com", "tls.example": "example.com",
           "dns.cloudflare": "www.cloudflare.com", "tls.cloudflare": "www.cloudflare.com"}
PROVIDERS = {"egress.ipify": "https://api64.ipify.org?format=json", "egress.geojs": "https://get.geojs.io/v1/ip/geo.json"}
SOURCES = [
    {"id": "local.runtime", "label": "本机运行环境", "url": None, "method": "Python 标准库只读运行信息",
     "scope": "后端进程所在机器", "limitations": "不读取设备标识、账号、任意文件或浏览器指纹。"},
    {"id": "local.dns", "label": "macOS DNS 配置", "url": None, "method": "固定 /usr/sbin/scutil --dns",
     "scope": "系统公布的 DNS 配置", "limitations": "仅提取 nameserver 地址；配置不证明某次查询使用了哪个 resolver。其他 OS 未实现。"},
    {"id": "browser.self", "label": "当前浏览器自报", "url": None, "method": "时区、语言与 navigator.onLine",
     "scope": "当前页面", "limitations": "可伪造或缺失；online 不证明外网可达，不是浏览器指纹。"},
    {"id": "egress.ipify", "label": "ipify", "url": PROVIDERS["egress.ipify"], "method": "固定 HTTPS JSON GET · 仅出口 IP",
     "scope": "后端进程请求所见出口", "limitations": "服务方可见请求源 IP；结果不代表浏览器或其他 app 出口，不与其他提供方融合。"},
    {"id": "egress.geojs", "label": "GeoJS", "url": PROVIDERS["egress.geojs"], "method": "固定 HTTPS JSON GET · 服务方自行观测出口",
     "scope": "后端进程请求所见出口及 GeoJS 数据库归属", "limitations": "服务方可见请求源 IP；ASN/国家可能缺失或过时；64512 为服务未知 ASN 占位；不代表浏览器或其他 app 出口。"},
    {"id": "target.dns", "label": "固定目标 DNS 解析", "url": None, "method": "系统 getaddrinfo：example.com / www.cloudflare.com",
     "scope": "后端进程解析结果", "limitations": "只报告目标地址，不检测 DNS resolver 公网出口；缓存、分流与代理行为可能不同。"},
    {"id": "target.tls", "label": "固定目标 HTTPS / TLS", "url": None, "method": "校验证书的 HTTPS HEAD，尝试读取该请求 TLS 元数据",
     "scope": "后端进程实际请求与握手", "limitations": "遵循系统/环境代理；peer 可是代理；元数据不可取得时保持未知或不支持；不是浏览器 JA3。"},
]


def utcnow():
    return dt.datetime.now(dt.timezone.utc).isoformat(timespec="milliseconds")


def result(status="success", value=None, error=None, note=""):
    return {"status": status, "value": value, "error": error, "note": note}


def fully_known(value):
    if value is None or value == "":
        return False
    if isinstance(value, dict):
        return bool(value) and all(fully_known(v) for v in value.values())
    if isinstance(value, list):
        return bool(value) and all(fully_known(v) for v in value)
    return not isinstance(value, float) or math.isfinite(value)


def fact(value, note=""):
    return result("success" if fully_known(value) else "unknown", value=value,
                  error=None if fully_known(value) else "partial_result",
                  note=note if fully_known(value) else f"部分字段未知，不能作为完整对照。{note}")


class RefuseRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def network_failure(error):
    if isinstance(error, urllib.error.HTTPError):
        code = error.code
        error.close()
        if 300 <= code < 400:
            return result("error", error="redirect_refused")
        return result("error", error="http_error", note=f"HTTP {code}")
    reason = error.reason if isinstance(error, urllib.error.URLError) else error
    if isinstance(reason, (TimeoutError, socket.timeout)):
        return result("unknown", error="timeout")
    if isinstance(reason, ssl.SSLError):
        return result("error", error="tls_validation_failed")
    return result("unknown", error="network_unavailable")


def opener():
    # ProxyHandler() deliberately follows urllib's system/environment proxy configuration.
    return urllib.request.build_opener(urllib.request.ProxyHandler(), RefuseRedirect(),
                                      urllib.request.HTTPSHandler(context=ssl.create_default_context()))


def read_json_response(response):
    content_type = response.headers.get_content_type()
    if content_type != "application/json" and not content_type.endswith("+json"):
        raise ValueError("non_json_response")
    raw = response.read(RESPONSE_LIMIT + 1)
    if len(raw) > RESPONSE_LIMIT:
        raise ValueError("response_too_large")
    try:
        data = json.loads(raw)
    except (UnicodeDecodeError, json.JSONDecodeError):
        raise ValueError("invalid_json_response") from None
    if not isinstance(data, dict):
        raise ValueError("invalid_provider_response")
    return data


def parse_provider(probe_id, data):
    if data.get("success") is False or data.get("error"):
        return result("error", error="provider_rejected_request")
    try:
        if not isinstance(data.get("ip"), str) or "%" in data["ip"]:
            raise ValueError()
        ip = ipaddress.ip_address(data["ip"])
        address = str(ip)
    except (ValueError, TypeError):
        return result("error", error="invalid_provider_ip")
    if not ip.is_global:
        return result("unknown", error="non_public_provider_ip")
    if probe_id == "egress.ipify":
        return result(value={"ip": address}, note="ipify 只报告 IP；ASN 与国家不在该来源覆盖内。后端请求出口不代表浏览器或其他应用。")
    country = data.get("country_code")
    country = country.upper() if isinstance(country, str) and re.fullmatch(r"[A-Za-z]{2}", country) else None
    raw_asn = data.get("asn")
    if isinstance(raw_asn, str) and raw_asn.upper().startswith("AS"):
        raw_asn = raw_asn[2:]
    try:
        if isinstance(raw_asn, bool) or not (isinstance(raw_asn, int) or isinstance(raw_asn, str) and re.fullmatch(r"[0-9]{1,10}", raw_asn)):
            raise ValueError()
        asn = int(raw_asn)
        if not 0 < asn < 4294967295 or asn == 23456 or 64496 <= asn <= 65551 or 4200000000 <= asn <= 4294967294:
            asn = None
    except (ValueError, TypeError):
        asn = None
    return fact(value={"ip": address, "asn": asn, "country": country},
                  note="提供方独立结果；空字段保持未知。后端请求出口不代表浏览器或其他应用。")


def provider_probe(probe_id, open_url=None):
    request = urllib.request.Request(PROVIDERS[probe_id], headers={"Accept": "application/json", "User-Agent": "Drift/0.2"})
    try:
        with (open_url or opener().open)(request, timeout=4) as response:
            data = read_json_response(response)
        return parse_provider(probe_id, data)
    except ValueError as error:
        # Only errors constructed above have user-visible names; never expose provider bodies.
        return result("error", error=error.args[0] if error.args[0] in {"non_json_response", "response_too_large", "invalid_json_response", "invalid_provider_response"} else "invalid_provider_response")
    except (OSError, urllib.error.URLError) as error:
        return network_failure(error)
    except Exception:
        return result("error", error="probe_failed")


def tls_probe(probe_id, open_url=None):
    host = TARGETS[probe_id]
    request = urllib.request.Request(f"https://{host}/", method="HEAD", headers={"User-Agent": "Drift/0.2"})
    try:
        with (open_url or opener().open)(request, timeout=4) as response:
            # This is optional transport metadata on the existing verified HTTPS request.
            transport = getattr(getattr(getattr(response, "fp", None), "raw", None), "_sock", None)
            if transport is None or not isinstance(transport, ssl.SSLSocket):
                return result("unsupported", error="transport_metadata_unavailable")
            cipher = transport.cipher()
            peer = transport.getpeername()[0]
            peer = str(ipaddress.ip_address(peer))
            return fact(value={"target": host, "tls_version": transport.version(), "cipher": cipher[0] if cipher else None,
                                 "transport_peer": peer, "http_status": response.status},
                          note="已校验证书的后端 HTTPS 请求；传输对端可能是系统/环境代理，不代表浏览器或其他应用。")
    except (OSError, urllib.error.URLError) as error:
        return network_failure(error)
    except Exception:
        return result("unknown", error="transport_metadata_unavailable")


def dns_probe(probe_id):
    host = TARGETS[probe_id]
    try:
        rows = socket.getaddrinfo(host, 443, type=socket.SOCK_STREAM)
        addresses = sorted({str(ipaddress.ip_address(row[4][0])) for row in rows})[:32]
        if not addresses:
            return result("unknown", error="no_dns_result")
        return result(value={"target": host, "addresses": addresses}, note="系统解析目标地址；不表明所用 resolver 或 DNS resolver 的公网出口。")
    except OSError:
        return result("unknown", error="dns_resolution_failed")


def dns_configuration():
    if platform.system() != "Darwin":
        return result("unsupported", error="os_not_supported")
    try:
        output = subprocess.run(["/usr/sbin/scutil", "--dns"], capture_output=True, timeout=3, check=False)
    except subprocess.TimeoutExpired:
        return result("unknown", error="timeout")
    except OSError:
        return result("unsupported", error="dns_configuration_unavailable")
    if output.returncode or len(output.stdout) > 65536:
        return result("unknown", error="dns_configuration_unavailable")
    addresses = set()
    for line in output.stdout.decode("utf-8", errors="replace").splitlines():
        if line.strip().startswith("nameserver[") and ":" in line:
            try:
                addresses.add(str(ipaddress.ip_address(line.split(":", 1)[1].strip())))
            except ValueError:
                pass
    if not addresses:
        return result("unknown", error="no_dns_configuration")
    return result(value={"nameservers": sorted(addresses)[:32]}, note="仅系统配置地址，不能证明一次实际查询的 resolver 或公网出口。")


def local_probe(probe_id):
    if probe_id == "local.os":
        family = platform.system()
        version = platform.mac_ver()[0] if family == "Darwin" else platform.release()
        return fact(value={"family": family, "version": version, "architecture": platform.machine()})
    if probe_id == "local.timezone":
        return fact(value={"names": list(time.tzname), "utc_offset_seconds": -time.altzone if time.localtime().tm_isdst else -time.timezone})
    if probe_id == "local.locale":
        language, encoding = locale.getlocale()
        return fact(value={"language": language, "encoding": encoding})
    if probe_id == "local.proxy":
        return result(value={"configured": any(urllib.request.getproxies().get(k) for k in ("http", "https", "all"))}, note="仅后端可读取的代理配置存在性；false 不证明 VPN/PAC 未启用或浏览器没有代理。不导出代理地址、凭据或其他环境变量。")
    if probe_id == "local.dns":
        return dns_configuration()
    raise ValueError("unknown_probe")


PROBES = [
    ("local.os", "系统", "local", "local.runtime", False),
    ("local.timezone", "本机时区", "local", "local.runtime", True),
    ("local.locale", "本机语言", "local", "local.runtime", True),
    ("local.proxy", "后端可读取的代理配置", "local", "local.runtime", False),
    ("local.dns", "DNS 配置", "local", "local.dns", True),
    ("browser.context", "浏览器自报", "browser", "browser.self", True),
    ("egress.ipify", "出口 · ipify", "egress", "egress.ipify", True),
    ("egress.geojs", "出口 · GeoJS", "egress", "egress.geojs", True),
    ("dns.example", "DNS · example.com", "dns", "target.dns", True),
    ("dns.cloudflare", "DNS · cloudflare", "dns", "target.dns", True),
    ("tls.example", "TLS · example.com", "tls", "target.tls", True),
    ("tls.cloudflare", "TLS · cloudflare", "tls", "target.tls", True),
]
PROBE_IDS = {probe[0] for probe in PROBES}


def raw_probe(probe_id):
    if probe_id.startswith("local."):
        return local_probe(probe_id)
    if probe_id in PROVIDERS:
        return provider_probe(probe_id)
    if probe_id.startswith("dns."):
        return dns_probe(probe_id)
    if probe_id.startswith("tls."):
        return tls_probe(probe_id)
    return result("error", error="unknown_probe")


def isolated_probe(probe_id, timeout=PROBE_TIMEOUT):
    # The subprocess enforces a wall deadline even for stalled DNS or slow HTTP reads.
    try:
        process = subprocess.run([sys.executable, str(HERE / "backend.py"), "--probe", probe_id],
                                 stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, timeout=timeout, check=False)
        if process.returncode or len(process.stdout) > RESPONSE_LIMIT:
            return result("error", error="probe_failed")
        data = json.loads(process.stdout)
        if not isinstance(data, dict) or data.get("status") not in {"success", "unknown", "error", "unsupported"}:
            return result("error", error="invalid_probe_result")
        return {key: data.get(key) for key in ("status", "value", "error", "note")}
    except subprocess.TimeoutExpired:
        return result("unknown", error="timeout")
    except (OSError, ValueError):
        return result("error", error="probe_failed")


def comparable(left, right):
    """Comparison deliberately excludes missing/failed observations."""
    if not left or not right or left.get("status") != "success" or right.get("status") != "success":
        return None
    keys = ("id", "source_id", "comparison_key")
    if not left.get("comparison_key") or any(left.get(k) != right.get(k) for k in keys):
        return None
    if not fully_known(left.get("value")) or not fully_known(right.get("value")):
        return None
    return json.dumps(left["value"], sort_keys=True, separators=(",", ":")) != json.dumps(right["value"], sort_keys=True, separators=(",", ":"))


class APIError(Exception):
    def __init__(self, status, code, message, **details):
        self.status = status
        self.body = {"error": {"code": code, "message": message, **details}}


class PrivateStore:
    def __init__(self, directory):
        path = Path(directory).expanduser().absolute()
        if path.is_symlink():
            raise ValueError("Data directory cannot be a symlink")
        path = path.resolve()
        if path.is_relative_to(REPO):
            raise ValueError("Real observations must be stored outside the repository")
        path.mkdir(parents=True, exist_ok=True, mode=0o700)
        path.chmod(0o700)
        self.path = path / "state.json"
        if self.path.is_symlink():
            raise ValueError("State file cannot be a symlink")

    def load(self):
        if not self.path.exists():
            return {"scans": [], "baseline": None}
        if self.path.stat().st_size > STATE_LIMIT:
            raise ValueError("Stored state exceeds limit")
        self.path.chmod(0o600)
        data = json.loads(self.path.read_bytes())
        if not isinstance(data, dict) or data.get("version") != VERSION or not isinstance(data.get("scans"), list):
            raise ValueError("Stored state is invalid")
        scans = data["scans"]
        baseline = data.get("baseline")
        for scan in scans + ([baseline] if baseline is not None else []):
            required = {"id", "started_at", "finished_at", "status", "progress", "observations", "summary", "error"}
            if not isinstance(scan, dict) or set(scan) != required or scan.get("status") not in {"complete", "error"} or not isinstance(scan.get("id"), str) or not isinstance(scan.get("observations"), list):
                raise ValueError("Stored scan is invalid")
            if not all(isinstance(scan[k], str) for k in ("id", "started_at", "finished_at")) or len(scan["observations"]) != len(PROBES):
                raise ValueError("Stored scan is invalid")
            progress = scan["progress"]
            if not isinstance(progress, dict) or set(progress) != {"done", "total", "label"} or progress["done"] != len(PROBES) or progress["total"] != len(PROBES) or not isinstance(progress["label"], str):
                raise ValueError("Stored progress is invalid")
            obs_keys = {"id", "label", "group", "source_id", "status", "value", "observed_at", "duration_ms", "error", "note", "comparison_key", "sensitive"}
            for item, spec in zip(scan["observations"], PROBES):
                if not isinstance(item, dict) or set(item) != obs_keys or item["id"] != spec[0] or item["source_id"] != spec[3] or item["status"] not in {"success", "unknown", "error", "unsupported"}:
                    raise ValueError("Stored observation is invalid")
                duration = item["duration_ms"]
                if not all(isinstance(item[k], str) for k in ("label", "group", "observed_at", "note")) or not isinstance(item["sensitive"], bool) or (duration is not None and (not isinstance(duration, int) or duration < 0)):
                    raise ValueError("Stored observation is invalid")
            if scan["summary"] != summarize(scan):
                raise ValueError("Stored summary is invalid")
        return {"scans": scans[-HISTORY_LIMIT:], "baseline": baseline}

    def save(self, scans, baseline):
        data = json.dumps({"version": VERSION, "scans": scans[-HISTORY_LIMIT:], "baseline": baseline}, ensure_ascii=False, allow_nan=False).encode()
        if len(data) > STATE_LIMIT:
            raise ValueError("Stored state exceeds limit")
        if self.path.is_symlink():
            raise ValueError("State file cannot be a symlink")
        fd, name = tempfile.mkstemp(prefix=".state-", dir=self.path.parent)
        try:
            with os.fdopen(fd, "wb") as file:
                os.fchmod(file.fileno(), 0o600)
                file.write(data)
                file.flush()
                os.fsync(file.fileno())
            os.replace(name, self.path)
        finally:
            Path(name).unlink(missing_ok=True)


def validate_browser(body):
    if not isinstance(body, dict) or set(body) - {"browser"}:
        raise APIError(400, "invalid_input", "只接受 browser 字段。")
    browser = body.get("browser")
    if browser is None:
        return None
    if not isinstance(browser, dict) or set(browser) - {"timezone", "languages", "online"}:
        raise APIError(400, "invalid_input", "浏览器自报字段无效。")
    for key in ("timezone",):
        if key in browser and (not isinstance(browser[key], str) or len(browser[key]) > 64 or any(ord(c) < 32 for c in browser[key])):
            raise APIError(400, "invalid_input", "时区字段无效。")
    if "languages" in browser and (not isinstance(browser["languages"], list) or len(browser["languages"]) > 16 or any(not isinstance(s, str) or not 1 <= len(s) <= 64 or any(ord(c) < 32 for c in s) for s in browser["languages"])):
        raise APIError(400, "invalid_input", "语言字段无效。")
    if "online" in browser and not isinstance(browser["online"], bool):
        raise APIError(400, "invalid_input", "online 必须为布尔值。")
    return copy.deepcopy(browser)


def summarize(scan):
    return {key: sum(item["status"] == key for item in scan["observations"]) for key in ("success", "unknown", "error", "unsupported")}


class Collector:
    def __init__(self, directory, runner=isolated_probe, history_limit=HISTORY_LIMIT, scan_timeout=SCAN_TIMEOUT):
        self.store = PrivateStore(directory)
        state = self.store.load()
        self.scans = state["scans"][-history_limit:]
        self.baseline = state["baseline"]
        self.runner, self.history_limit, self.scan_timeout = runner, history_limit, scan_timeout
        self.active = None
        self.lock = threading.RLock()
        self.csrf = secrets.token_urlsafe(32)

    def bootstrap(self):
        with self.lock:
            summaries = [{key: scan[key] for key in ("id", "started_at", "finished_at", "status", "summary")} for scan in self.scans]
            return {"csrf_token": self.csrf, "collector_version": VERSION,
                    "baseline_id": self.baseline["id"] if self.baseline else None,
                    "active_scan_id": self.active["id"] if self.active else None,
                    "scans": copy.deepcopy(list(reversed(summaries))), "sources": copy.deepcopy(SOURCES)}

    def get_scan(self, scan_id):
        with self.lock:
            for scan in ([self.active] if self.active else []) + self.scans + ([self.baseline] if self.baseline else []):
                if scan["id"] == scan_id:
                    return copy.deepcopy(scan)
        raise APIError(404, "scan_not_found", "扫描记录不存在。")

    def get_baseline(self):
        with self.lock:
            return {"baseline_id": self.baseline["id"] if self.baseline else None, "scan": copy.deepcopy(self.baseline)}

    def pin(self, scan_id):
        with self.lock:
            scan = self.get_scan(scan_id)
            if scan["status"] != "complete":
                raise APIError(409, "scan_not_complete", "只有已完成扫描可设为基线。")
            baseline = copy.deepcopy(scan)
            try:
                self.store.save(self.scans, baseline)
            except (OSError, ValueError):
                raise APIError(500, "storage_unavailable", "私有数据保存失败；原基线保持不变。") from None
            self.baseline = baseline
            return {"baseline_id": baseline["id"]}

    def start(self, browser):
        with self.lock:
            if self.active:
                raise APIError(409, "scan_in_progress", "已有扫描进行中。", scan_id=self.active["id"])
            observations = [{"id": id_, "label": label, "group": group, "source_id": source,
                             "status": "pending", "value": None, "observed_at": None, "duration_ms": None,
                             "error": None, "note": "", "comparison_key": f"{id_}:v1", "sensitive": sensitive}
                            for id_, label, group, source, sensitive in PROBES]
            scan = {"id": str(uuid.uuid4()), "started_at": utcnow(), "finished_at": None, "status": "queued",
                    "progress": {"done": 0, "total": len(observations), "label": "等待扫描"},
                    "observations": observations, "summary": {k: 0 for k in ("success", "unknown", "error", "unsupported")}, "error": None}
            self.active = scan
            initial = copy.deepcopy(scan)
            threading.Thread(target=self._scan, args=(scan, browser), daemon=True, name="drift-scan").start()
            return initial

    def _scan(self, scan, browser):
        deadline = time.monotonic() + self.scan_timeout
        with self.lock:
            scan["status"] = "running"
        try:
            for item in scan["observations"]:
                started = time.monotonic()
                with self.lock:
                    item["status"] = "running"
                    scan["progress"]["label"] = item["label"]
                remaining = deadline - time.monotonic()
                if remaining <= 0:
                    outcome = result("unknown", error="scan_deadline_exceeded")
                elif item["id"] == "browser.context":
                    if browser:
                        browser_value = {key: browser.get(key) for key in ("timezone", "languages", "online")}
                        outcome = fact(value=browser_value, note="当前浏览器自报；online 不证明外网可达。")
                    else:
                        outcome = result("unsupported", error="browser_not_reported")
                else:
                    outcome = self.runner(item["id"], timeout=min(PROBE_TIMEOUT, remaining))
                with self.lock:
                    item.update(outcome)
                    item["observed_at"] = utcnow()
                    item["duration_ms"] = round((time.monotonic() - started) * 1000)
                    scan["progress"]["done"] += 1
                    scan["summary"] = summarize(scan)
            with self.lock:
                scan["status"] = "complete"
                scan["finished_at"] = utcnow()
                scan["progress"]["label"] = "扫描完成"
                self.scans.append(copy.deepcopy(scan))
                self.scans = self.scans[-self.history_limit:]
                try:
                    self.store.save(self.scans, self.baseline)
                except (OSError, ValueError):
                    scan["status"] = "error"
                    scan["error"] = "storage_unavailable"
                    self.scans[-1] = copy.deepcopy(scan)
        except Exception:
            with self.lock:
                for item in scan["observations"]:
                    if item["status"] in {"pending", "running"}:
                        item.update(result("error", error="scan_failed"))
                        item["observed_at"] = utcnow()
                        scan["progress"]["done"] += 1
                scan.update(status="error", error="scan_failed", finished_at=utcnow(), summary=summarize(scan))
                self.scans.append(copy.deepcopy(scan))
                self.scans = self.scans[-self.history_limit:]
                try:
                    self.store.save(self.scans, self.baseline)
                except (OSError, ValueError):
                    scan["error"] = "scan_failed_storage_unavailable"
                    self.scans[-1] = copy.deepcopy(scan)
        finally:
            with self.lock:
                self.active = None


class Server(ThreadingHTTPServer):
    daemon_threads = True

    def __init__(self, port, collector):
        super().__init__(("127.0.0.1", port), Handler)
        self.collector = collector
        self.origin = f"http://127.0.0.1:{self.server_port}"

    def handle_error(self, request, client_address):
        pass  # A broken client connection must not emit raw tracebacks or addresses.


class Handler(BaseHTTPRequestHandler):
    server_version = "Drift"

    def log_message(self, *args):
        pass  # URLs, request bodies and observations are never written to logs.

    def send_data(self, status, data, content_type="application/json; charset=utf-8"):
        if isinstance(data, dict):
            data = json.dumps(data, ensure_ascii=False, allow_nan=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("Content-Security-Policy", "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'")
        self.end_headers()
        self.wfile.write(data)

    def guard(self, mutate=False):
        host = self.headers.get_all("Host") or []
        if host != [urllib.parse.urlsplit(self.server.origin).netloc]:
            raise APIError(403, "invalid_host", "只允许本地服务地址。")
        origins = self.headers.get_all("Origin") or []
        if (origins and origins != [self.server.origin]) or (mutate and origins != [self.server.origin]):
            raise APIError(403, "invalid_origin", "请求来源不匹配。")
        if self.headers.get("Sec-Fetch-Site") == "cross-site":
            raise APIError(403, "cross_site_request", "不接受跨站请求。")
        if mutate:
            tokens = self.headers.get_all("X-Drift-CSRF") or []
            if len(tokens) != 1 or not hmac.compare_digest(tokens[0].encode("utf-8"), self.server.collector.csrf.encode("ascii")):
                raise APIError(403, "invalid_csrf", "页面会话已失效，请刷新。")

    def json_body(self):
        if self.headers.get("Transfer-Encoding"):
            raise APIError(400, "invalid_body", "不接受分块请求体。")
        if self.headers.get_content_type() != "application/json":
            raise APIError(415, "invalid_content_type", "请求必须为 JSON。")
        lengths = self.headers.get_all("Content-Length") or []
        if len(lengths) != 1 or not re.fullmatch(r"[0-9]{1,10}", lengths[0]):
            raise APIError(400, "invalid_body", "请求长度无效。")
        length = int(lengths[0])
        if length > BODY_LIMIT:
            self.close_connection = True
            raise APIError(413, "body_too_large", "请求体超过大小限制。")
        try:
            self.connection.settimeout(3)
            body = json.loads(self.rfile.read(length), parse_constant=lambda _: (_ for _ in ()).throw(ValueError()))
        except (ValueError, OSError):
            self.close_connection = True
            raise APIError(400, "invalid_json", "JSON 无效或读取超时。") from None
        return body

    def request_path(self):
        parsed = urllib.parse.urlsplit(self.path)
        if parsed.scheme or parsed.netloc or "%" in parsed.path or "\\" in parsed.path or parsed.query:
            raise APIError(404, "not_found", "路径不存在。")
        return parsed.path

    def dispatch(self, mutate=False):
        try:
            self.guard(mutate)
            path = self.request_path()
            collector = self.server.collector
            if not mutate:
                if path == "/api/bootstrap":
                    return self.send_data(200, collector.bootstrap())
                if path == "/api/baseline":
                    return self.send_data(200, collector.get_baseline())
                if path.startswith("/api/scans/") and len(path.split("/")) == 4:
                    return self.send_data(200, {"scan": collector.get_scan(path.rsplit("/", 1)[1])})
                static = {"/": ("index.html", "text/html; charset=utf-8"), "/index.html": ("index.html", "text/html; charset=utf-8"),
                          "/style.css": ("style.css", "text/css; charset=utf-8"), "/app.js": ("app.js", "text/javascript; charset=utf-8")}
                if path in static:
                    filename, mime = static[path]
                    file = HERE / filename
                    if file.is_symlink():
                        raise APIError(404, "not_found", "文件不可用。")
                    return self.send_data(200, file.read_bytes(), mime)
            elif path == "/api/scans":
                browser = validate_browser(self.json_body())
                return self.send_data(202, {"scan": collector.start(browser)})
            elif path == "/api/baseline":
                body = self.json_body()
                if not isinstance(body, dict) or set(body) != {"scan_id"} or not isinstance(body["scan_id"], str) or len(body["scan_id"]) > 64:
                    raise APIError(400, "invalid_input", "只接受有效的 scan_id。")
                return self.send_data(200, collector.pin(body["scan_id"]))
            raise APIError(404, "not_found", "路径不存在。")
        except APIError as error:
            self.send_data(error.status, error.body)
        except (OSError, ValueError):
            self.send_data(500, {"error": {"code": "service_unavailable", "message": "本地服务暂不可用。"}})

    def do_GET(self):
        self.dispatch()

    def do_POST(self):
        self.dispatch(mutate=True)

    def do_OPTIONS(self):
        self.send_data(405, {"error": {"code": "method_not_allowed", "message": "不提供跨站接口。"}})


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--data-dir", type=Path, default=Path.home() / ".local" / "share" / "drift")
    parser.add_argument("--probe", choices=sorted(PROBE_IDS - {"browser.context"}), help=argparse.SUPPRESS)
    args = parser.parse_args()
    if args.probe:
        try:
            output = raw_probe(args.probe)
        except Exception:
            output = result("error", error="probe_failed")
        print(json.dumps(output, ensure_ascii=False, allow_nan=False))
        return
    if not 0 <= args.port <= 65535:
        parser.error("port must be between 0 and 65535")
    try:
        server = Server(args.port, Collector(args.data_dir))
    except (OSError, ValueError):
        parser.exit(1, "Drift could not open its private store or loopback port.\n")
    print(f"Drift {VERSION}: {server.origin}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
