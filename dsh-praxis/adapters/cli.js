#!/usr/bin/env node
// praxis <tool> [json-args]   e.g.  praxis resolve '{"task_type":"technical-explainer"}'
// praxis serve [port]          control plane at http://127.0.0.1:7878/
// praxis export|check|restore <archive.tar.gz> [--force]   control plane state backup
import { createPraxis } from '../core/index.js'
import { TOOLS, callTool } from './tools.js'

const [name, raw] = process.argv.slice(2)
if (name === 'serve') {
  const { serve } = await import('./http.js')
  const port = Number(raw ?? process.env.PRAXIS_PORT ?? 7878)
  await serve(createPraxis(), { port })
  console.log(`Praxis control plane: http://127.0.0.1:${port}/`)
  await new Promise(() => {})
}
if (!name || name === 'help' || name === '--help') {
  for (const t of TOOLS) console.log(`${t.name.replace(/^praxis_/, '').padEnd(10)} ${t.description}`)
  process.exit(0)
}
if (['export', 'check', 'restore'].includes(name)) {
  const { exportState, checkArchive, restoreState } = await import('../core/backup.js')
  const praxis = createPraxis()
  const repo = praxis.repo
  const arg = raw ?? `praxis-state-${new Date().toISOString().slice(0, 10)}.tar.gz`
  const result = name === 'export' ? exportState(repo, arg)
    : name === 'check' ? (({ ok, problems, manifest }) => ({ ok, problems, created_at: manifest.created_at, repository_commit: manifest.repository_commit, files: manifest.files.length }))(checkArchive(arg))
    : restoreState(repo, arg, { force: process.argv.includes('--force'), rebuild: () => praxis.materials.rebuild({ snapshots: true }) })
  console.log(JSON.stringify(result, null, 1))
  process.exit(0)
}
const tool = name.startsWith('praxis_') ? name : `praxis_${name}`
try {
  const result = await callTool(createPraxis(), tool, raw ? JSON.parse(raw) : {}, `cli:${process.env.USER ?? 'user'}`)
  console.log(JSON.stringify(result, null, 1))
} catch (error) {
  console.error(error.message)
  process.exit(1)
}
