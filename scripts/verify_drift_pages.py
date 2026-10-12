#!/usr/bin/env python3
"""Check the four-file Pages artifact and its /Praxis/ static demo.

Usage: python3 scripts/verify_drift_pages.py [--output DEDICATED_EXTERNAL_DIR]
Artifacts, screenshots and the report default to a new temporary directory.
Uses the existing Python Playwright/Chromium installation; never installs it.
No collector, public probes, private state, deployment or port 8765 is used.
"""
import argparse
import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

from build_drift_pages import ARTIFACT_FILES, ASSETS, ROOT, SOURCE, BuildError, build_site, reject_symlinks


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def failure_checks(scratch):
    checks = []

    def refused(label, output, source=SOURCE):
        try:
            build_site(output, source)
        except BuildError:
            checks.append(label)
        else:
            raise AssertionError(f"Builder accepted {label}")

    for label, path in [("repository root", ROOT), ("source directory", SOURCE), ("Kit subtree", ROOT / "kit" / "drift-pages-test"), ("Vault subtree", ROOT / "vault" / "drift-pages-test"), ("filesystem root", Path(ROOT.anchor)), ("home root", Path.home())]:
        refused(label, path)
    occupied = scratch / "occupied"
    occupied.mkdir()
    sentinel = occupied / "keep.txt"
    sentinel.write_text("synthetic unrelated content")
    before = digest(sentinel)
    refused("nonempty external directory", occupied)
    assert digest(sentinel) == before and set(occupied.iterdir()) == {sentinel}
    link = scratch / "output-link"
    link.symlink_to(occupied, target_is_directory=True)
    refused("output symlink", link)
    refused("symlink output ancestor", link / "nested")
    source = scratch / "source-fixture"
    source.mkdir()
    for name in ASSETS:
        shutil.copyfile(SOURCE / name, source / name)
    (source / "app.js").unlink()
    (source / "app.js").symlink_to(SOURCE / "app.js")
    refused("source asset symlink", scratch / "refused-assets", source)
    assert not (scratch / "refused-assets").exists()
    (source / "app.js").unlink()
    refused("missing source asset", scratch / "refused-missing", source)
    shutil.copyfile(SOURCE / "app.js", source / "app.js")
    (source / "index.html").write_text("<!doctype html><body>synthetic malformed input</body>")
    refused("HTML without root marker location", scratch / "refused-html", source)
    assert not (scratch / "refused-html").exists()
    # Unrelated source files must never enter the public artifact.
    shutil.copyfile(SOURCE / "index.html", source / "index.html")
    (source / "backend.py").write_text("synthetic non-exportable source")
    (source / "state.json").write_text('{"synthetic_private":true}')
    exported = scratch / "whitelist-export"
    build_site(exported, source)
    assert {path.name for path in exported.iterdir()} == ARTIFACT_FILES
    before = {path.name: digest(path) for path in exported.iterdir()}
    refused("existing build is never overwritten", exported)
    assert before == {path.name: digest(path) for path in exported.iterdir()}
    checks.append("extra source files excluded")
    # Match the manual workflow's sparse checkout: only this standalone builder
    # and the three frontend assets are present; no README, git or helper script.
    sparse = scratch / "sparse-checkout"
    (sparse / "scripts").mkdir(parents=True)
    (sparse / "demos" / "drift").mkdir(parents=True)
    shutil.copyfile(ROOT / "scripts" / "build_drift_pages.py", sparse / "scripts" / "build_drift_pages.py")
    for name in ASSETS:
        shutil.copyfile(SOURCE / name, sparse / "demos" / "drift" / name)
    sparse_output = scratch / "sparse-site"
    subprocess.run([sys.executable, "scripts/build_drift_pages.py", "--output", str(sparse_output)], cwd=sparse, check=True, capture_output=True, text=True)
    assert {path.name for path in sparse_output.iterdir()} == ARTIFACT_FILES
    assert b"data-drift-static" in (sparse_output / "index.html").read_bytes()
    assert (sparse / "demos" / "drift" / "index.html").read_bytes() == (SOURCE / "index.html").read_bytes()
    checks.append("four-source sparse checkout builds independently")
    return checks


def serve_artifact(site):
    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            path = urlsplit(self.path).path
            name = "index.html" if path == "/Praxis/" else path.removeprefix("/Praxis/")
            if not path.startswith("/Praxis/") or name not in ARTIFACT_FILES:
                self.send_error(404)
                return
            data = (site / name).read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", {"index.html":"text/html; charset=utf-8", "app.js":"text/javascript; charset=utf-8", "style.css":"text/css; charset=utf-8"}.get(name, "application/octet-stream"))
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(data)

        def log_message(self, *_):
            pass

    server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server, thread


def settle_motion(page):
    page.evaluate("""async () => {
        const finite = document.getAnimations().filter(animation => animation.effect?.getTiming().iterations !== Infinity);
        let timer;
        try {
            await Promise.race([
                Promise.all(finite.map(animation => animation.finished.catch(() => {}))),
                new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("Finite motion did not settle")), 1000); })
            ]);
        } finally { clearTimeout(timer); }
    }""")


def browser_checks(site, output):
    from playwright.sync_api import expect, sync_playwright

    server, thread = serve_artifact(site)
    origin = f"http://127.0.0.1:{server.server_port}"
    errors, external, api_requests, responses, screenshots = [], [], [], [], []
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch()
            try:
                for name, viewport in [("desktop", {"width":1440,"height":1000}), ("mobile", {"width":390,"height":844})]:
                    context = browser.new_context(viewport=viewport, locale="en-US", timezone_id="UTC")

                    def route_request(route):
                        url = urlsplit(route.request.url)
                        if "/api/" in url.path or url.path.rstrip("/").endswith("/api"):
                            api_requests.append(url.path)
                            route.abort()
                        elif url.netloc != urlsplit(origin).netloc:
                            external.append(route.request.url)
                            route.abort()
                        else:
                            route.continue_()

                    context.route("**/*", route_request)
                    page = context.new_page()
                    page.on("pageerror", lambda error: errors.append(str(error)))
                    page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
                    page.on("response", lambda response: responses.append((urlsplit(response.url).path, response.status)))
                    try:
                        page.goto(f"{origin}/Praxis/", wait_until="networkidle")
                        expect(page.locator("#mode-select")).to_have_value("demo")
                        expect(page.locator('#mode-select option[value="real"]')).to_be_disabled()
                        expect(page.locator("#scan-button")).to_be_hidden()
                        expect(page.locator("#scope-notice")).to_have_text("演示样本 · 人为编写的静态读数")
                        expect(page.locator(".signal-table tbody tr")).to_have_count(6)
                        expect(page.locator("#change-count")).to_have_text("2")
                        # A synthetic change event cannot escape the explicitly marked mode.
                        page.locator("#mode-select").evaluate("el => { el.value = 'real'; el.dispatchEvent(new Event('change', {bubbles:true})); }")
                        expect(page.locator("#mode-select")).to_have_value("demo")
                        expect(page.locator("#scan-button")).to_be_hidden()
                        for view in ("baseline", "changes", "sources", "history"):
                            page.locator(f'.nav-item[data-view="{view}"]').click()
                            if view == "baseline":
                                expect(page.locator("#view-content")).to_contain_text("样本 A")
                                expect(page.locator('[data-action="pin"]')).to_have_count(0)
                            elif view == "changes":
                                expect(page.locator(".comparison-table tbody tr")).to_have_count(2)
                            elif view == "sources":
                                expect(page.locator(".source-card")).to_have_count(5)
                            else:
                                expect(page.locator("#view-content")).to_contain_text("演示模式不产生历史记录")
                        page.locator("#sample-select").select_option("C")
                        page.locator('.nav-item[data-view="changes"]').click()
                        expect(page.locator("#view-content")).to_contain_text("没有可确认的变化")
                        page.locator("#sample-select").select_option("B")
                        page.locator('.nav-item[data-view="observations"]').click()
                        page.locator('button[data-item="egress.ipify"]').click()
                        expect(page.locator("#inspector .detail-value").first).to_have_text("已隐藏")
                        page.locator("#privacy-toggle").click()
                        expect(page.locator("#inspector .detail-value").first).to_contain_text("192.0.2.11")
                        page.locator("#privacy-toggle").click()
                        expect(page.locator("#inspector .detail-value").first).to_have_text("已隐藏")
                        if name == "mobile":
                            page.locator('[data-action="back-to-list"]').click()
                            expect(page.locator('button[data-item="egress.ipify"]')).to_be_focused()
                        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
                        page.evaluate("window.scrollTo(0,0)")
                        settle_motion(page)
                        filename = f"{name}-static-demo.png"
                        page.screenshot(path=str(output / filename), full_page=True)
                        screenshots.append(filename)
                        # The brand's relative URL must retain the /Praxis/ prefix and marker.
                        page.locator(".brand").click()
                        expect(page).to_have_url(f"{origin}/Praxis/index.html")
                        expect(page.locator("#mode-select")).to_have_value("demo")
                    finally:
                        context.close()
            finally:
                browser.close()
    finally:
        server.shutdown()
        server.server_close()
        thread.join()
    assert not api_requests, api_requests
    assert not external, external
    assert not errors, errors
    for asset in ("app.js", "style.css"):
        assert (f"/Praxis/{asset}", 200) in responses, responses
    return {"viewports":["1440x1000","390x844"], "prefix":"/Praxis/", "api_requests":api_requests, "external_requests":external, "unexpected_browser_errors":errors, "screenshots":screenshots}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, help="Absent or empty external directory for artifact and evidence; default is temporary.")
    args = parser.parse_args()
    output = args.output.expanduser().absolute() if args.output else Path(tempfile.mkdtemp(prefix="drift-pages-check-")).resolve()
    reject_symlinks(output, "Evidence output")
    if output.resolve().is_relative_to(ROOT) or output.resolve() in (Path.home().resolve(), Path(output.anchor)):
        parser.error("Evidence output must be a dedicated external directory.")
    if output.exists() and (not output.is_dir() or any(output.iterdir())):
        parser.error("Evidence output must be absent or empty.")
    output.mkdir(exist_ok=True)
    before = {name: digest(SOURCE / name) for name in ASSETS}
    artifact = build_site(output / "site")
    assert {path.name for path in (output / "site").iterdir()} == ARTIFACT_FILES
    with tempfile.TemporaryDirectory(prefix="drift-pages-failures-") as private:
        failures = failure_checks(Path(private).resolve())
    browsers = browser_checks(output / "site", output)
    after = {name: digest(SOURCE / name) for name in ASSETS}
    assert before == after, "The local source files changed during verification"
    result = {"result":"passed", "artifact":artifact, "failure_checks":failures, "source_hashes":after, "source_unchanged":True, **browsers}
    (output / "report.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({**result, "output":str(output)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
