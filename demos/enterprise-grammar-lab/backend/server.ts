// One local process serving every scenario's fake backend, each under /api/<scenario>.
import { fileURLToPath } from 'node:url';
import { createBackend } from './kernel.ts';
import { matterScenario } from './matter/scenario.ts';
import { paymentScenario } from './payment/scenario.ts';

const fixture = (name: string) => fileURLToPath(new URL(`../fixtures/${name}`, import.meta.url));
const scripted = process.env.FAKE_CONCURRENT_MS ? Number(process.env.FAKE_CONCURRENT_MS) : undefined;

const port = Number(process.env.PORT ?? 8787);
const { server } = createBackend(
  [
    matterScenario({ fixture: fixture('legal.json'), concurrentEditMs: scripted }),
    paymentScenario({ fixture: fixture('payment.json'), concurrentEditMs: scripted }),
  ],
  { latency: process.env.FAKE_LATENCY !== '0' },
);
server.listen(port, '127.0.0.1', () => console.log(`fake backend on http://127.0.0.1:${port}/api/{matter,payment}`));
