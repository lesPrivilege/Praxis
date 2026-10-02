#!/usr/bin/env node
// True-viewport checks through the Chrome DevTools Protocol (no npm packages).
//
//   node tools/cdp.mjs [--widths 1440,375] [--shots DIR] [--nojs] [--reduced] page.html[#id] ...
//
// For each page and width: emulates the viewport (mobile below 768px), loads the page with
// ?check, prints the lab.js geometry report, and with --shots saves a screenshot of #id
// (element clip) or the full page. --nojs disables page scripts and runs the same geometry
// probe from outside; --reduced emulates prefers-reduced-motion: reduce.
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, relative } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const LAB = resolve(fileURLToPath(new URL('..', import.meta.url)));
const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(name); if (i < 0) return dflt; const v = args[i + 1]; args.splice(i, 2); return v; };
const flag = (name) => { const i = args.indexOf(name); if (i < 0) return false; args.splice(i, 1); return true; };
const widths = opt('--widths', '1440,375').split(',').map(Number);
const shots = opt('--shots', '');
const nojs = flag('--nojs');
const reduced = flag('--reduced');
const targets = args.map((a) => { const [p, id] = a.split('#'); return { path: resolve(p), id: id || '' }; });

const PROBE = `(() => {
  const vw = document.documentElement.clientWidth, issues = [];
  const sw = document.documentElement.scrollWidth;
  if (sw > vw + 1) issues.push({ kind: 'page-hscroll', scrollWidth: sw, viewport: vw });
  document.querySelectorAll('.stage, [data-check-root]').forEach((root) => {
    const rb = root.getBoundingClientRect();
    root.querySelectorAll('*').forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || el.closest('.sr-only,[data-allow-scroll]')) return;
      const b = el.getBoundingClientRect();
      if (!b.width && !b.height) return;
      const at = (el.closest('[id]') || root).id || '?';
      if (b.right > rb.right + 1 || b.left < rb.left - 1) issues.push({ kind: 'outside-stage', at, tag: el.tagName.toLowerCase(), over: Math.round(b.right - rb.right) });
      const clips = /(hidden|clip)/.test(cs.overflowX + cs.overflowY) || cs.textOverflow === 'ellipsis';
      if (clips && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) && el.textContent.trim()) issues.push({ kind: 'clipped', at, tag: el.tagName.toLowerCase() });
    });
  });
  const seen = new Set();
  return { viewport: vw, issues: issues.filter((i) => { const k = i.kind + i.at + (i.tag || ''); if (seen.has(k)) return false; seen.add(k); return true; }) };
})()`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const profile = mkdtempSync(join(tmpdir(), 'lab-cdp-'));
  const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
    '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'],
  { stdio: ['ignore', 'ignore', 'pipe'] });
  const wsUrl = await new Promise((res, rej) => {
    let buf = '';
    chrome.stderr.on('data', (d) => { buf += d; const m = /ws:\/\/[^\s]+/.exec(buf); if (m) res(m[0]); });
    setTimeout(() => rej(new Error('chrome did not start')), 15000);
  });
  const browser = new WebSocket(wsUrl);
  await new Promise((r) => browser.addEventListener('open', r, { once: true }));
  let seq = 0; const pending = new Map(); const waiters = [];
  browser.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) { const { res, rej } = pending.get(msg.id); pending.delete(msg.id); msg.error ? rej(new Error(msg.error.message)) : res(msg.result); }
    else if (msg.method) waiters.forEach((w) => w(msg));
  });
  const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const id = ++seq; pending.set(id, { res, rej }); browser.send(JSON.stringify({ id, method, params, sessionId })); });
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const s = (m, p) => send(m, p, sessionId);
  await s('Page.enable'); await s('Runtime.enable');
  if (nojs) await s('Emulation.setScriptExecutionDisabled', { value: true });
  if (reduced) await s('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  const summary = {};
  for (const t of targets) {
    const rel = relative(LAB, t.path);
    for (const w of widths) {
      await s('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 768 });
      const loaded = new Promise((r) => { const f = (m) => { if (m.method === 'Page.loadEventFired') { waiters.splice(waiters.indexOf(f), 1); r(); } }; waiters.push(f); });
      await s('Page.navigate', { url: pathToFileURL(t.path).href + (nojs ? '' : '?check') });
      await loaded; await sleep(400);
      const r = await s('Runtime.evaluate', { expression: nojs ? PROBE : `(() => { const p = document.getElementById('lab-check'); return p ? JSON.parse(p.textContent) : ${PROBE}; })()`, returnByValue: true });
      const report = r.result.value;
      summary[`${rel}${t.id ? '#' + t.id : ''}@${w}${nojs ? ' nojs' : ''}`] = report;
      console.error(`${(rel + (t.id ? '#' + t.id : '')).padEnd(44)} ${String(w).padStart(5)}px${nojs ? ' nojs' : ''}  issues: ${report.issues.length}`);
      if (shots) {
        const box = (await s('Runtime.evaluate', { returnByValue: true, expression: t.id
          ? `(() => { const e = document.getElementById(${JSON.stringify(t.id)}); if (!e) return null; const b = e.getBoundingClientRect(); return { x: 0, y: b.top + scrollY - 8, width: document.documentElement.clientWidth, height: b.height + 16 }; })()`
          : `({ x: 0, y: 0, width: document.documentElement.clientWidth, height: document.documentElement.scrollHeight })` })).result.value;
        if (!box) { console.error(`  no element #${t.id}`); continue; }
        box.height = Math.min(box.height, 16000);
        const img = await s('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { ...box, scale: 1 } });
        mkdirSync(shots, { recursive: true });
        const name = `${rel.replace(/\//g, '__').replace(/\.html$/, '')}${t.id ? '-' + t.id : ''}-${w}${nojs ? '-nojs' : ''}.png`;
        writeFileSync(join(shots, name), Buffer.from(img.data, 'base64'));
      }
    }
  }
  console.log(JSON.stringify(summary, null, 1));
  browser.close(); chrome.kill(); await sleep(300);
  try { rmSync(profile, { recursive: true, force: true }); } catch { /* profile busy */ }
}
main().catch((e) => { console.error(e); process.exit(1); });
