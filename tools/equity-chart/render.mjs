#!/usr/bin/env node
// Render chart JSON to SVG without the editor UI, for agents and scripts:
//   node tools/equity-chart/render.mjs chart.json -o chart.svg [--options options.json]
// It opens equity-chart.html in headless Chrome and calls EC.render, so text is
// measured with the same fonts and code as the page. Needs Node 22+ and Chrome;
// set CHROME to the browser binary when it is not at the macOS default path.
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PAGE = join(HERE, 'equity-chart.html');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

function usage(message) {
  if (message) console.error(message);
  console.error('usage: node render.mjs <chart.json | -> [-o out.svg] [--options options.json]');
  process.exit(2);
}

function parseArgs(argv) {
  const args = { input: null, output: null, options: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-o' || a === '--output') args.output = argv[++i];
    else if (a === '--options') args.options = argv[++i];
    else if (a === '-h' || a === '--help') usage();
    else if (!args.input) args.input = a;
    else usage(`unexpected argument: ${a}`);
  }
  if (!args.input) usage('missing input');
  return args;
}

async function waitForFile(path, ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (existsSync(path)) {
      const text = readFileSync(path, 'utf8');
      if (text.includes('\n')) return text;
    }
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error('Chrome did not start');
}

function connect(url) {
  const ws = new WebSocket(url);
  let seq = 0;
  const pending = new Map();
  const listeners = [];
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    } else if (msg.method) {
      for (const l of listeners) l(msg);
    }
  });
  return new Promise((ready, fail) => {
    ws.addEventListener('error', () => fail(new Error('DevTools connection failed')));
    ws.addEventListener('open', () => ready({
      send: (method, params = {}) => new Promise((resolve, reject) => {
        const id = ++seq;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      }),
      once: (method) => new Promise((resolve) => listeners.push((m) => m.method === method && resolve(m.params))),
      close: () => ws.close(),
    }));
  });
}

const args = parseArgs(process.argv.slice(2));
const data = JSON.parse(args.input === '-' ? readFileSync(0, 'utf8') : readFileSync(resolve(args.input), 'utf8'));
const options = args.options ? JSON.parse(readFileSync(resolve(args.options), 'utf8')) : {};
if (!existsSync(PAGE)) usage(`missing ${PAGE}; run build.py first`);

const profile = mkdtempSync(join(tmpdir(), 'equity-chart-'));
const chrome = spawn(CHROME, [
  '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
  '--no-first-run', '--no-default-browser-check', '--allow-file-access-from-files', 'about:blank',
], { stdio: 'ignore' });

let exitCode = 0;
try {
  const [port] = (await waitForFile(join(profile, 'DevToolsActivePort'), 15000)).split('\n');
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const page = await connect(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await page.send('Page.enable');
  const loaded = page.once('Page.loadEventFired');
  await page.send('Page.navigate', { url: pathToFileURL(PAGE).href });
  await loaded;
  const { result, exceptionDetails } = await page.send('Runtime.evaluate', {
    expression: `EC.render(${JSON.stringify(data)}, ${JSON.stringify(options)}).then((r) => ({ svg: r.svg, width: r.width, height: r.height, errors: r.errors, warnings: r.warnings }))`,
    awaitPromise: true,
    returnByValue: true,
  });
  page.close();
  if (exceptionDetails) throw new Error(exceptionDetails.exception?.description || exceptionDetails.text);
  const r = result.value;
  for (const w of r.warnings) console.error(`warning: ${w}`);
  if (r.errors.length) {
    for (const e of r.errors) console.error(`error: ${e}`);
    exitCode = 1;
  } else {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>\n${r.svg}\n`;
    if (args.output) {
      writeFileSync(resolve(args.output), svg);
      console.error(`${args.output}: ${r.width}×${r.height}`);
    } else {
      process.stdout.write(svg);
    }
  }
} catch (err) {
  console.error(`error: ${err.message}`);
  exitCode = 1;
} finally {
  // Headless Chrome does not exit on its own once the page is done.
  chrome.kill();
  await new Promise((r) => (chrome.exitCode !== null ? r() : chrome.once('exit', r)));
  rmSync(profile, { recursive: true, force: true });
}
process.exit(exitCode);
