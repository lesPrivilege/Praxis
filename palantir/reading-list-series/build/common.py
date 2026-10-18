"""Paths, the assembly's timeline, a headless page on the stage, and ffmpeg.

ffmpeg comes from the imageio-ffmpeg wheel through uv; the browser is Playwright's Chromium or, when that
is not installed, the system Google Chrome driven over CDP. Nothing is installed on the system.
Adapted from demos/role-baseline-film/build/frames.py and render.py.
"""
import json, os, shutil, signal, subprocess, sys, tempfile, time
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ARGS = ['--use-angle=metal', '--enable-gpu-rasterization', '--force-device-scale-factor=1', '--hide-scrollbars',
        '--font-render-hinting=none', '--disable-lcd-text', '--allow-file-access-from-files']


def manifest():
    return json.loads((ROOT / 'series-manifest.json').read_text())


def timeline(a):
    return json.loads((ROOT / 'assembly' / 'timelines' / f'{a}.json').read_text())


def url(a):
    return (ROOT / 'film' / 'index.html').as_uri() + f'?a={a}&render=1'


CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
# the switches Playwright itself gives Chromium (its chromiumSwitches), so a page renders the same either way
PW_SWITCHES = ['--disable-field-trial-config', '--disable-background-networking', '--disable-background-timer-throttling',
               '--disable-backgrounding-occluded-windows', '--disable-back-forward-cache', '--disable-breakpad',
               '--disable-client-side-phishing-detection', '--disable-component-extensions-with-background-pages',
               '--disable-component-update', '--no-default-browser-check', '--disable-default-apps', '--disable-dev-shm-usage',
               '--disable-extensions', '--disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,DestroyProfileOnBrowserClose,'
               'DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,'
               'ThirdPartyStoragePartitioning,Translate,AutoDeElevate,RenderDocument,OptimizationHints',
               '--enable-features=CDPScreenshotNewSurface', '--allow-pre-commit-input', '--disable-hang-monitor',
               '--disable-ipc-flooding-protection', '--disable-popup-blocking', '--disable-prompt-on-repost',
               '--disable-renderer-backgrounding', '--force-color-profile=srgb', '--metrics-recording-only', '--no-first-run',
               '--password-store=basic', '--use-mock-keychain', '--no-service-autorun', '--disable-search-engine-choice-screen',
               '--disable-infobars', '--disable-sync', '--headless', '--mute-audio']
STARTED = []                             # system Chromes this process started, for kill_browsers()


class BrowserLost(Exception):
    """The browser died or never came up; the caller may try again."""


class SystemChrome:
    """The system's Google Chrome, started here and driven over CDP. Chrome starts Google's updater, which inherits
    Chrome's output; under Playwright's own launch a Chrome that exits while the updater still holds those pipes leaves
    Playwright waiting forever. Here Chrome's output goes to /dev/null, and a dead browser fails the next call at once."""

    def __init__(self, pw):
        self.b = None
        self.profile = tempfile.mkdtemp(prefix='prl-chrome-')
        self.proc = subprocess.Popen([CHROME, f'--user-data-dir={self.profile}', '--remote-debugging-port=0', *PW_SWITCHES, *ARGS,
                                      'about:blank'], stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL,
                                     stderr=subprocess.DEVNULL, start_new_session=True)
        STARTED.append(self.proc)
        port, t0 = None, time.time()
        while not port:
            f = Path(self.profile) / 'DevToolsActivePort'
            if f.exists() and f.read_text().strip():
                port = f.read_text().split()[0]
            elif self.proc.poll() is not None or time.time() - t0 > 30:
                self.close(); raise BrowserLost('system Chrome did not start')
            else:
                time.sleep(0.1)
        try:
            self.b = pw.chromium.connect_over_cdp(f'http://127.0.0.1:{port}', timeout=30000)
        except Exception as e:
            self.close(); raise BrowserLost(f'system Chrome did not answer: {e}') from None

    def new_page(self, **kw):
        return self.b.new_context(**kw).new_page()

    def close(self):
        try:
            if self.b: self.b.close()
        except Exception:
            pass
        if self.proc.poll() is None:
            self.proc.terminate()
            try: self.proc.wait(10)
            except subprocess.TimeoutExpired: self.proc.kill()
        shutil.rmtree(self.profile, ignore_errors=True)


def kill_browsers():
    """For a worker about to give up: end the Chromes it started (each leads its own process group)."""
    for p in STARTED:
        if p.poll() is None:
            try: os.killpg(p.pid, signal.SIGKILL)
            except OSError: pass


def launch(pw):
    """Playwright's own Chromium when it is installed, otherwise the system's Google Chrome over CDP.
    Nothing is installed by this project."""
    try:
        return pw.chromium.launch(args=ARGS)
    except Exception as e:
        if "Executable doesn't exist" not in str(e): raise
        return SystemChrome(pw)


def open_page(pw, a):
    browser = launch(pw)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)
    page.on('console', lambda m: print('console:', m.text, file=sys.stderr) if m.type in ('error', 'warning') else None)
    page.on('pageerror', lambda e: print('pageerror:', e, file=sys.stderr))
    page.goto(url(a))
    page.wait_for_function('(window.Film && Film.ready) || (window.__errors && window.__errors.length)', timeout=60000)
    errs = page.evaluate('window.__errors')
    if errs:
        browser.close()
        raise SystemExit(f'{a}: the stage reported errors, nothing rendered:\n  ' + '\n  '.join(errs))
    return browser, page


@lru_cache(None)
def ffmpeg_path():
    out = subprocess.run(['uv', 'run', '--quiet', '--with', 'imageio-ffmpeg', 'python', '-c',
                          'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())'], capture_output=True, text=True, check=True)
    return out.stdout.strip().splitlines()[-1]


def seg_at(tl, t):
    cur = tl['segments'][0]['id']
    for s in tl['segments']:
        if s['start'] <= t: cur = s['id']
    return cur
