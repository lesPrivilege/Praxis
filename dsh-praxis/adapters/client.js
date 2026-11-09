// DSH web client half: the Praxis page in the left sidebar is the whole control plane (Kit,
// sources, task, artifacts, log), built from DSH's own controls and reading through the
// authenticated /api/praxis.call route. Its composer hands requests to an agent session.
// `/praxis` opens the page; praxis_resolve and praxis_consume calls show as cards that link into it.
window.__ModuleLoader__.load({
  id: 'dsh-praxis',
  factory: (require) => {
    var module = { exports: {} }
    Object.defineProperty(module.exports, Symbol.toStringTag, { value: 'Module' })
    const React = require('react')
    const NS = 'praxis'
    const COPY = {
      en: { title: 'Praxis', units: 'units', materials: 'materials', artifacts: 'artifacts', sources: 'sources', open: 'Open in Praxis', running: 'running', failed: 'Failed',
        panel: 'Praxis',
        'review.filter': 'Review state', 'review.search': 'Find a source', 'review.view': 'Layout', 'review.view.list': 'List', 'review.view.grid': 'Grid', 'review.more': 'More actions',
        'review.f.open': 'To review', 'review.f.needs-work': 'Needs work', 'review.f.reviewed': 'Reviewed', 'review.f.all': 'All',
        'review.empty.open': 'Nothing to review', 'review.empty.needs-work': 'No source needs work', 'review.empty.reviewed': 'Nothing reviewed yet',
        'review.empty.all': 'No sources yet', 'review.empty.allHint': 'Paste links or a conversation in the box below.',
        'review.failedTitle': 'Could not load sources', 'review.noMatch': 'No source matches', 'review.noMatchHint': 'Try other words or another tag.', 'review.clearAll': 'Clear filters', 'review.matches': '{n} matching', 'review.retry': 'Try again',
        'review.prev': 'Previous source', 'review.next': 'Next source', 'shelf.all': 'Show all {n}', 'shelf.less': 'Show fewer',
        'review.changed': 'The description changed while you were reading, so nothing was recorded. This is the new one.', 'review.clearTag': 'Clear tag', 'review.noArea': 'Unfiled',
        'review.openOriginal': 'Open original', 'cart.add': 'Add to cart', 'cart.remove': 'Remove from cart', 'cart.in': 'In cart', 'cart.label': 'Cart', 'cart.count': '{n} in cart', 'cart.clear': 'Clear', 'cart.chat': 'Open in chat', 'cart.copy': 'Copy', 'cart.copied': 'Copied', 'cart.copyFailed': 'Could not copy', 'review.markAccurate': 'Description is accurate', 'review.markNeedsWork': 'Description needs work',
        'review.excerpts': 'Where in the original', 'review.limits': 'Limits', 'review.summary': 'Summary', 'review.pages': 'Attached to',
        'review.question': 'Is this description right?', 'review.last': 'Last: {v}, {by}, {at}', 'review.note': 'What is wrong', 'review.noteHint': '⌘/Ctrl + Enter to send, Esc to cancel',
        'review.sendNeedsWork': 'Mark needs work and send to Praxis', 'review.cancel': 'Cancel', 'review.recorded': 'Recorded: {v}', 'review.sentToAgent': 'Marked needs work; Praxis is revising it',
        'ev.verified': 'Original read', 'ev.partial': 'Partly read', 'ev.unavailable': 'Not read',
        'tab.kit': 'Kit', 'tab.shop': 'Shop', 'tab.task': 'Task', 'tab.artifacts': 'Artifacts', 'tab.log': 'Log',
        'kit.core': 'Core', 'kit.flow': 'Downstream workflows', 'kit.other': 'Outside the Kit', 'kit.files': '{n} files', 'kit.packs': 'Source packs', 'kit.failed': 'Could not load the Kit:',
        'kit.sources': 'Sources on this page', 'kit.showRemoved': 'Show removed', 'kit.noSources': 'No sources on this page', 'kit.restore': 'Restore', 'kit.favorite': 'Star', 'kit.enabled': 'Use in tasks',
        'kit.check': 'Check the original', 'kit.bindingAccurate': 'Description here is accurate', 'kit.bindingNeedsWork': 'Description here needs work', 'kit.remove': 'Remove from this page',
        'unit.resident': 'Always in context', 'unit.revised': 'Revised', 'unit.added': 'Added', 'unit.addedWhy': 'Added because: {r}', 'outline.add': 'Add page', 'outline.addDo': 'Add', 'outline.title': 'Title', 'outline.name': 'File name', 'outline.when': 'When to read it', 'outline.why': 'Why', 'outline.holds': 'An area: holds pages of its own', 'outline.remove': 'Remove or merge', 'outline.removeDo': 'Remove', 'outline.into': 'Move its sources to', 'outline.intoNone': 'Nowhere (it has none)', 'outline.removeNote': 'The page leaves the Kit; its text stays in the data and can be restored from the Kit home.', 'outline.areaNote': 'An area leaves only once no page is left under it.', 'outline.removed': 'Removed pages', 'outline.mergedInto': 'Merged into {u}', 'outline.restore': 'Restore', 'unit.conflict': 'Revision conflicts with the updated page', 'unit.revisedWhy': 'Revised because: {r}', 'unit.read': 'Show full text', 'unit.hide': 'Hide full text', 'unit.revert': 'Revert revision', 'unit.askSources': 'Ask Praxis for sources', 'unit.contents': 'Contents',
        'task.type': 'Task type', 'task.pipeline': 'Pipeline', 'task.default': 'Default', 'task.preset': 'Preset', 'task.presetDefault': 'Pipeline default', 'task.noStream': 'None', 'task.flow': 'Units per layer',
        'task.units': 'Units to read', 'task.materials': 'Materials', 'task.noMaterials': 'No sources for these units', 'task.exemplars': 'Examples and pipelines', 'task.presetValues': 'Preset: {p}', 'task.acceptance': 'Acceptance',
        'task.presets': 'Presets', 'task.isDefault': 'Default', 'task.newPreset': 'New {p} preset', 'task.presetName': 'Name', 'task.presetWhen': 'When to use', 'task.makeDefault': 'Default for {p}', 'task.save': 'Save', 'task.removePreset': 'Delete preset', 'yes': 'Yes', 'no': 'No',
        'art.search': 'Find an artifact', 'art.unregistered': '{n} final files not registered', 'art.outside': 'Outside every project', 'art.none': 'No artifacts yet', 'art.noMatch': 'No artifact matches', 'art.openFile': 'Open file', 'art.reveal': 'Show in Finder', 'art.failed': 'The host could not open the file', 'art.serves': 'Serves these pages', 'art.servesNone': 'No pages recorded',
        'art.versions': 'Versions', 'art.noRun': 'No run record', 'art.basis': 'Basis changed', 'art.used': 'Used', 'art.madeWith': 'Pipeline', 'art.question': 'Verdict on v{v}', 'art.record': 'Record', 'review.noteOptional': 'Note (optional)', 'review.conflict': 'Someone changed this meanwhile. Reload and look again.',
        'kind.delivery': 'Delivery', 'kind.pipeline': 'Pipeline', 'kind.example': 'Example',
        'as.modified': 'Unregistered changes', 'as.missing': 'File not found', 'as.needs_work': 'Needs work', 'as.misplaced': 'Outside the layout', 'as.basis_changed': 'Basis changed',
        'av.needs-work': 'Needs work', 'av.checked': 'Checked', 'av.accepted': 'Accepted',
        'gap.needs_work': 'Needs work', 'gap.changed': 'Original changed', 'gap.unreachable': 'Unreachable',
        'log.attention': 'Needs attention', 'log.reload': 'Plugin code changed; restart DSH to load it', 'log.unfiled': 'Not catalogued', 'log.sendFile': 'Send to Praxis to file', 'log.added': 'New upstream member', 'log.sendCapture': 'Send to Praxis', 'log.skip': 'Skip', 'log.skipWhy': 'Why skip it',
        'log.gone': 'Gone upstream', 'log.retire': 'Retire', 'log.retireWhy': 'Why retire it', 'log.none': 'Nothing needs attention', 'log.runs': 'Runs', 'log.runCounts': '{u} units · {s} sources', 'log.noRuns': 'No runs yet', 'log.history': 'Maintenance', 'log.noHistory': 'No maintenance yet',
        'ask.forUnit': 'Find sources for Kit unit {id} ({title}): check the roster first, then look further if needed; read each original, capture it and attach it to this page, describing when this page uses it and what to take.', 'ask.file': 'Source {id} ({title}) is not catalogued. Read the original, then set form, category and description, and attach it where it clearly serves.', 'ask.member': '{url}\nA new upstream member of collection {id}.',
        'tab.label': 'Sections', 'tab.scope': 'Shop', 'tab.browse': 'Browse', 'tab.manage': 'Manage', 'tab.browseHint': '{n} sources', 'shop.for': 'For', 'shop.forAny': 'Anything', 'shop.forTypes': 'Task types', 'shop.forStreams': 'Streams', 'shop.forPages': 'Kit pages', 'shop.forTask': '{n} sources, in the order an agent gets them', 'shop.forPage': '{n} sources on this page', 'shop.all': 'All', 'shop.views': 'Views', 'shop.group': 'Group by', 'shop.group.area': 'Area', 'shop.group.form': 'Form', 'shop.group.none': 'Nothing', 'shop.viewSave': 'Save view', 'shop.viewName': 'Name this view', 'shop.viewUpdate': 'Save changes', 'shop.viewRename': 'Rename', 'shop.viewRemove': 'Remove view', 'shop.new': 'New', 'shop.newBasis': 'Latest collected first', 'shop.used': 'Recently used', 'shop.usedBasis': 'Latest read by a run first', 'd.neighbours': 'On the same pages', 'cart.copyIds': 'Copy IDs', 'stock.label': 'Stock', 'stock.linkOnly': 'Link only: no local copy yet', 'stock.download': 'Download', 'stock.update': 'Update', 'stock.getting': 'Getting a copy of the original…', 'stock.unchanged': 'The original has not changed since the copy of {at}', 'stock.kind.download': 'Download', 'stock.kind.distill': 'Distill', 'stock.files': '{n} files', 'stock.added': '{n} added', 'stock.removed': '{n} removed', 'stock.changed': '{n} changed', 'stock.missing': '{n} not kept', 'stock.look': 'Quick look', 'stock.lookFrom': 'Version of {at}', 'stock.restock': 'The original changed after the latest download', 'stock.in': 'In stock', 'd.unreachableStock': 'The original could not be reached when checked on {at}. A local copy from {v} is under Stock.', 'review.f.link-only': 'Link only', 'review.f.restock': 'Restock', 'review.empty.link-only': 'Every source has a local copy', 'review.empty.restock': 'Nothing to restock', 'layer.design': 'Design', 'layer.writing': 'Writing', 'layer.task': 'Task', 'layer.publish': 'Publish', 'layer.stream': 'Stream', 'd.checked': 'Original checked {at}: HTTP {http}', 'd.unreachable': 'The original could not be reached when checked on {at}. The excerpts and read scope below are what Praxis has.', 'd.noCheck': 'Original not checked yet', 'd.activity': 'Activity', 'd.collected': 'Collected for: {task}', 'd.fromPack': 'From the {pack} pack', 'd.readFor': 'Read for: {title}', 'd.read': 'What was read', 'd.noExcerpts': 'No excerpts; read the whole original before using it', 'd.noPages': 'Not attached to any Kit page', 'd.serves': 'Reaches these task types', 'd.noRuns': 'No run has read it', 'd.revisit': 'When to revisit',
        'ask.label': 'Capture or change sources', 'ask.placeholder': 'Paste links or a conversation, or tell Praxis what to change', 'ask.unavailable': 'No agent here; open Praxis in DSH to paste links', 'ask.send': 'Send',
        'ask.running': 'Reading the originals and filing', 'ask.distilling': 'Writing a distill of {title}', 'ask.distilled': 'Distill saved:', 'ask.distillNone': 'The session ended without saving a distill', 'stock.distill': 'Distill', 'stock.distilling': 'An agent is writing a distill from the original', 'ask.done': 'Captured {n}:', 'ask.doneNone': 'Done; nothing new captured', 'ask.failed': 'Did not finish', 'ask.stopped': 'Session stopped before finishing', 'ask.session': 'Session', 'ask.more': '{n} more', 'ask.fewer': 'Fewer', 'ask.dismiss': 'Dismiss',
        'ask.revise': 'The description of source {id} ({title}) was marked needs work: {note}. Read the original, then rewrite its description; change form, category or attachment descriptions if needed.', 'ask.noNote': 'no reason given',
        'v.accurate': 'Accurate', 'v.revised': 'Revised', 'v.needs-work': 'Needs work',
        'form.standard': 'Standard', 'form.practice': 'Practice', 'form.component-library': 'Component library', 'form.case-library': 'Case library', 'form.case': 'Case', 'form.skill': 'Skill', 'form.tool': 'Tool', 'form.article': 'Article', 'form.research': 'Research' },
    }

    function apply(ctx) {
      // The UI stays in English whatever the Host language: one stable vocabulary for people and agents.
      ctx.effect(() => ctx.locale.register(NS, { en: COPY.en, zh: COPY.en }), 'dsh-praxis: locale')
      const t = ctx.locale.bind(NS)

      // Everything opens the one Praxis page in the left sidebar, at a route when there is one.
      const openPage = (route) => {
        ctx.layout.selectPanel(PANEL)
        if (route) setTimeout(() => window.dispatchEvent(new CustomEvent(GO, { detail: route })), 0)
      }
      const openPanel = () => openPage()
      // Bare `/praxis` opens the page; with text it reaches the host command.
      ctx.effect(() => ctx.commandUi.decorate({ name: 'praxis', available: () => true, ui: { kind: 'action', run: openPanel } }), 'dsh-praxis: command')
      // Reveal in Finder or open in the default app, through the Host (no session needed).
      const openPath = async (path, action) => !!(await ctx.remote.session.openWorkspacePath(action === 'reveal' ? { path, action } : { path }))?.ok

      // A settled call's value is the JSON text the server half rendered.
      const valueOf = (block) => {
        if (!block || !('kind' in block) || block.isError) return null
        try { return JSON.parse(block.content.filter((c) => c.type === 'text').map((c) => c.text).join('')) } catch { return null }
      }
      const h = React.createElement
      // affectUI Tool Call Card: icon tile, tool name in mono, a one-line summary, the status
      // (spinner and live timer, a check that draws itself with the duration, or Failed), and a
      // body that grows open. Restyled on DSH tokens.
      function Card({ name, summary, status, error, page, children }) {
        const [open, setOpen] = React.useState(false)
        const started = React.useRef(Date.now())
        const [ms, setMs] = React.useState(0)
        React.useEffect(() => {
          if (status !== 'running') { setMs(Date.now() - started.current); return }
          const tick = setInterval(() => setMs(Date.now() - started.current), 100)
          return () => clearInterval(tick)
        }, [status])
        const time = status === 'error' ? t('failed') : status === 'running' ? `${(Math.floor(ms / 100) / 10).toFixed(1)}s` : null
        return h('div', { className: 'pxc', 'data-status': status, 'data-open': open || undefined, 'data-tool': 'praxis' },
          h('button', { type: 'button', className: 'pxc-head', 'aria-expanded': open, disabled: status === 'running', onClick: () => setOpen(!open) },
            h('span', { className: 'pxc-icon', 'aria-hidden': true }, h(PanelIcon, { size: 14 })),
            h('span', { className: 'pxc-main' }, h('code', { className: 'pxc-name' }, name), h('span', { className: 'pxc-summary', dir: 'auto', title: summary }, status === 'running' ? t('running') : summary)),
            h('span', { className: 'pxc-status', key: status },
              status === 'running' ? h('svg', { className: 'pxc-spin', viewBox: '0 0 16 16', 'aria-hidden': true }, h('circle', { cx: 8, cy: 8, r: 5.75 }), h('path', { d: 'M8 2.25a5.75 5.75 0 0 1 5.75 5.75' }))
                : status === 'success' ? h('svg', { className: 'pxc-ok', viewBox: '0 0 16 16', 'aria-hidden': true }, h('path', { d: 'M3.5 8.4 6.6 11.3 12.5 4.9', pathLength: 1 }))
                  : h('svg', { className: 'pxc-err', viewBox: '0 0 16 16', 'aria-hidden': true }, h('circle', { cx: 8, cy: 8, r: 6 }), h('path', { d: 'M8 5v3.4M8 10.9v.1' })),
              time),
            h('span', { role: 'link', tabIndex: 0, className: 'pxc-link', onClick: (e) => { e.stopPropagation(); openPage(page) }, onKeyDown: (e) => { if (e.key === 'Enter') { e.stopPropagation(); openPage(page) } } }, t('open')),
            h('svg', { className: 'pxc-chev', viewBox: '0 0 16 16', 'aria-hidden': true }, h('path', { d: 'M4.5 6.25 8 9.75l3.5-3.5' }))),
          h('div', { className: 'pxc-body', inert: !open || undefined }, h('div', { className: 'pxc-clip' }, h('div', { className: 'pxc-sections' },
            status === 'error' ? h('p', { className: 'pxc-error', dir: 'auto' }, error || t('failed')) : children))))
      }
      const statusOf = (block, phase) => (phase !== 'result' || !('kind' in (block ?? {})) ? 'running' : block.isError ? 'error' : 'success')
      const errorOf = (block) => (block?.isError ? (block.content ?? []).filter((c) => c.type === 'text').map((c) => c.text).join('') : undefined)
      function ResolveRow({ block, phase }) {
        const v = valueOf(block)
        const units = v?.units ?? []
        const mats = v?.materials ?? []
        return h(Card, { name: 'praxis_resolve', status: statusOf(block, phase), error: errorOf(block), page: { tab: 'task' },
          summary: v ? `${v.task_type?.title ?? ''} ${v.pipeline ?? ''} · ${units.length} ${t('units')} · ${mats.length} ${t('materials')}` : '' },
          h('div', { className: 'pxc-section' }, h('span', { className: 'pxc-label' }, t('units')),
            h('ul', { className: 'pxc-list' }, units.map((u) => h('li', { key: u.id }, h('button', { type: 'button', className: 'pxc-file', onClick: () => openPage({ tab: 'kit', unit: u.id }) }, u.title), h('span', { className: 'pxc-dim' }, u.reasons?.join('；')))))),
          mats.length ? h('div', { className: 'pxc-section' }, h('span', { className: 'pxc-label' }, t('materials')),
            h('ul', { className: 'pxc-list' }, mats.map((m) => h('li', { key: m.source }, h('button', { type: 'button', className: 'pxc-file', onClick: () => openPage({ tab: 'shop', source: m.source }) }, m.title), h('span', { className: 'pxc-dim' }, m.description))))) : null)
      }
      function ConsumeRow({ block, phase, openFile }) {
        const v = valueOf(block)
        const files = v?.artifacts ?? []
        return h(Card, { name: 'praxis_consume', status: statusOf(block, phase), error: errorOf(block), page: { tab: 'log' },
          summary: v ? `${v.title} · ${(v.units ?? []).length} ${t('units')} · ${(v.sources ?? []).length} ${t('sources')} · ${files.length} ${t('artifacts')}` : '' },
          h('div', { className: 'pxc-section' }, h('span', { className: 'pxc-label' }, t('artifacts')),
            h('ul', { className: 'pxc-list' }, files.map((a) => h('li', { key: a.artifact },
              h('button', { type: 'button', className: 'pxc-file', onClick: () => openFile?.(a.absolute) }, a.path),
              h('button', { type: 'button', className: 'pxc-link', onClick: () => openPage({ tab: 'artifacts', artifact: a.artifact }) }, `v${a.version}`))))))
      }
      for (const [key, Row] of [['praxis_resolve', ResolveRow], ['praxis_consume', ConsumeRow]]) {
        ctx.effect(() => ctx.slots.inject('tool.call.toolview', () => ctx.slots.register({ name: 'tool.call.toolview', key }, Row)), `dsh-praxis: ${key} card`)
      }

      // Left sidebar: a "Praxis" panel whose main page reviews the source catalog with DSH's own controls.
      ctx.effect(() => {
        const style = document.createElement('style')
        style.dataset.plugin = 'dsh-praxis'
        style.textContent = PAGE_CSS
        document.head.append(style)
        return () => style.remove()
      }, 'dsh-praxis: styles')
      ctx.effect(() => ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({ name: 'sidebar.panellist', id: PANEL, order: 40, locale: NS, label: () => t('panel') }, PanelIcon)), 'dsh-praxis: sidebar entry')
      ctx.effect(() => ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: PANEL, locale: NS, inject: () => ({ openSession: (id) => ctx.uiWorkspace.openSession(id), openPath, addToChat: (prompt) => ctx.uiWorkspace.startSession(undefined, { prompt, whenDraftExists: 'append' }) }) }, PraxisPage)), 'dsh-praxis: page')
    }

    // ---- sources page -------------------------------------------------------------------------
    // Laid out like Claude's Artifacts page: a title, pill filters with search and a list/grid
    // switch, the sources, and a composer docked at the bottom. People never edit a record: they
    // paste links or say what to change, and an agent session does it (Claude memory works the
    // same way). What a row shows is what a reader needs to decide whether to open the original;
    // the detail leads with pointers into it.
    const PANEL = 'praxis'
    const GO = 'praxis:go'
    const P = require('@deepseek-ai/dsh-client-ui-primitives')
    const h = React.createElement

    async function call(tool, args = {}) {
      const res = await fetch('/api/praxis.call', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool, args }) })
      const body = await res.json()
      if (!res.ok) throw Object.assign(new Error(body.error || res.statusText), { status: res.status })
      return body
    }
    async function asks(request) {
      const res = await fetch('/api/praxis.ask', request === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(typeof request === 'string' ? { text: request } : request) })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || res.statusText)
      return body
    }

    function PanelIcon({ size = 16 }) {
      return h('svg', { viewBox: '0 0 16 16', width: size, height: size, fill: 'currentColor', 'aria-hidden': true },
        h('rect', { x: 2, y: 3, width: 12, height: 2, rx: 1 }),
        h('rect', { x: 2, y: 7, width: 9, height: 2, rx: 1, opacity: 0.7 }),
        h('rect', { x: 2, y: 11, width: 6, height: 2, rx: 1, opacity: 0.45 }))
    }

    // Native glyphs for the stable controls and the nine forms: 16px grid, 1.4 stroke.
    const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' }
    const GLYPHS = {
      list: ['M3 4.5h10', 'M3 8h10', 'M3 11.5h10'],
      grid: ['M3 3h4v4H3z', 'M9 3h4v4H9z', 'M3 9h4v4H3z', 'M9 9h4v4H9z'],
      out: ['M9.5 3H13v3.5', 'M13 3 7.5 8.5', 'M11.5 9.5V12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1h2.5'],
      up: ['M8 13V3.5', 'M4 7.5 8 3.5l4 4'],
      back: ['M10 3.5 5.5 8l4.5 4.5'],
      forward: ['M6 3.5 10.5 8 6 12.5'],
      standard: ['M4 2.5h8v11H4z', 'M6 5.5h4', 'M6 8h4', 'M6 10.5h2.5'],
      practice: ['M3 4.5 8 2l5 2.5L8 7z', 'M3 8l5 2.5L13 8', 'M3 11.5 8 14l5-2.5'],
      'component-library': ['M3 3h4v4H3z', 'M9 3h4v4H9z', 'M3 9h4v4H3z', 'M9.5 9.5h3v3h-3z'],
      'case-library': ['M2.5 4.5h11v8h-11z', 'M5 2.5h6', 'M5 9.5l2-2 1.5 1.5 2.5-2.5'],
      case: ['M3 3.5h10v9H3z', 'M3 10l3-3 2.5 2.5L10.5 7 13 9.5'],
      skill: ['M5 5 2.5 8 5 11', 'M11 5l2.5 3L11 11', 'M9 3.5 7 12.5'],
      tool: ['M10.2 2.4a3.5 3.5 0 0 0-4.3 4.6L2.6 10.3a1.4 1.4 0 0 0 2 2L7.9 9a3.5 3.5 0 0 0 4.6-4.3l-2 2-1.6-.4-.4-1.6z'],
      article: ['M3.5 3h9v10h-9z', 'M5.5 5.5h5', 'M5.5 8h5', 'M5.5 10.5h3'],
      research: ['M7 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', 'M10 10l3.5 3.5'],
      design: ['M8 2.5a5.5 5.5 0 1 0 0 11c1 0 1.5-.6 1.5-1.3 0-.9-.8-1-.8-1.9 0-.7.6-1.3 1.3-1.3h1.2A2.3 2.3 0 0 0 13.5 6.7 5 5 0 0 0 8 2.5z', 'M5.3 7.3h.01', 'M7.6 5.2h.01', 'M10.3 5.8h.01'],
      writing: ['M3 4.5h10', 'M3 8h10', 'M3 11.5h6'],
      task: ['M8 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z', 'M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z'],
      publish: ['M8 10.5V3', 'M5 6 8 3l3 3', 'M3 10.5v2h10v-2'],
      stream: ['M2.5 6c1.8-1.6 3.7-1.6 5.5 0s3.7 1.6 5.5 0', 'M2.5 10c1.8-1.6 3.7-1.6 5.5 0s3.7 1.6 5.5 0'],
      folder: ['M2.5 4.5a1 1 0 0 1 1-1h3l1.5 1.5h4.5a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1z'],
      archive: ['M2.5 3.5h11v3h-11z', 'M3.5 6.5v6h9v-6', 'M6.5 9h3'],
      refresh: ['M13 8a5 5 0 1 1-1.5-3.6', 'M13 3v2.5h-2.5'],
      sliders: ['M3 5h6', 'M11 5h2', 'M3 11h2', 'M7 11h6', 'M10 3.5v3', 'M6 9.5v3'],
      star: ['M8 2.5l1.7 3.5 3.8.5-2.8 2.7.7 3.8L8 11.2 4.6 13l.7-3.8L2.5 6.5l3.8-.5z'],
      cart: ['M1.8 2.8h1.7l1.5 7.2h7.2l1.4-5.2H4.1', 'M5.6 12.9a.8.8 0 1 0 1.6 0 .8.8 0 1 0-1.6 0', 'M10.9 12.9a.8.8 0 1 0 1.6 0 .8.8 0 1 0-1.6 0'],
      cartAdd: ['M1.8 2.8h1.7l1.5 7.2h7.2l1.4-5.2H4.1', 'M5.6 12.9a.8.8 0 1 0 1.6 0 .8.8 0 1 0-1.6 0', 'M10.9 12.9a.8.8 0 1 0 1.6 0 .8.8 0 1 0-1.6 0', 'M8.7 5.9v2.8', 'M7.3 7.3h2.8'],
      cartIn: ['M1.8 2.8h1.7l1.5 7.2h7.2l1.4-5.2H4.1', 'M5.6 12.9a.8.8 0 1 0 1.6 0 .8.8 0 1 0-1.6 0', 'M10.9 12.9a.8.8 0 1 0 1.6 0 .8.8 0 1 0-1.6 0', 'M7.2 7.3l1.1 1.1 2-2.1'],
      copy: ['M5.5 5.5h7v7h-7z', 'M3.5 10.5v-7h7'],
      chat: ['M3 3.5h10v7H7.2L4.5 13v-2.5H3z'],
      close: ['M4.5 4.5l7 7', 'M11.5 4.5l-7 7'],
      clock: ['M8 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z', 'M8 5v3.2l2 1.3'],
      check: ['M3.5 8.5l3 3 6-7'],
      book: ['M2.5 3.5h4a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 0-1.5-1.5h-4z', 'M13.5 3.5h-4A1.5 1.5 0 0 0 8 5v8a1.5 1.5 0 0 1 1.5-1.5h4z'],
      starOn: ['M8 2.5l1.7 3.5 3.8.5-2.8 2.7.7 3.8L8 11.2 4.6 13l.7-3.8L2.5 6.5l3.8-.5z'],
    }
    const Glyph = ({ name, size = 16 }) => h('svg', { viewBox: '0 0 16 16', width: size, height: size, 'aria-hidden': true, ...stroke },
      (GLYPHS[name] ?? GLYPHS.article).map((d) => h('path', { key: d, d })))

    const hostOf = (url) => { try { return new URL(url).host.replace(/^www\./, '') } catch { return '' } }
    const day = (iso) => (iso ? new Intl.DateTimeFormat(document.documentElement.lang || undefined, { month: 'short', day: 'numeric' }).format(new Date(iso)) : '')
    /** A review counts until the entry is edited again; core says whether it still holds. */
    const reviewed = (row) => !!row.review?.current
    const remember = (key, value) => { try { value === undefined ? localStorage.getItem(key) : localStorage.setItem(key, value) } catch {} }
    const recall = (key, fallback) => { try { return localStorage.getItem(key) ?? fallback } catch { return fallback } }

    async function loadCatalog() {
      const outline = await call('praxis_catalog', {})
      const parts = await Promise.all(outline.areas.map((a) => call('praxis_catalog', { area: a.area })))
      const byId = new Map()
      parts.forEach((part) => {
        for (const area of part.areas) for (const group of area.forms) for (const s of group.sources) {
          const row = byId.get(s.id) ?? byId.set(s.id, { ...s, areas: [] }).get(s.id)
          if (!row.areas.some((a) => a.area === area.area)) row.areas.push({ area: area.area, title: area.title })
        }
      })
      const rows = [...byId.values()].sort((a, b) => String(b.captured_at ?? '').localeCompare(String(a.captured_at ?? '')) || a.title.localeCompare(b.title))
      return { rows, outline: outline.areas, forms: outline.forms }
    }

    // ---- the Praxis page ------------------------------------------------------------------------
    // One page in the left sidebar is the whole control plane. Its levels follow the agent's path:
    // Kit (layer → area → unit) and the sources hung on each unit, then a source's record and its
    // original. Tabs: Kit, Sources, Task, Artifacts, Log. The composer at the bottom is how records
    // change: people say it, an agent session writes it.
    //
    // A place is a section and where in it: a unit, a folder, an artifact, a shelf or a saved view in
    // the Shop, a task type. The sidebar lists the sections and, under the one in front, its fixed
    // places one level down. Each section keeps
    // its place, its filters and its scroll offset while another tab is in front. Going back up puts
    // the offset back and hands focus to the item you came from. A source opens over the place it was
    // opened from; ← → step through the list it was opened from; Esc or the trail goes back.
    const TABS = ['kit', 'shop', 'task', 'artifacts', 'log']
    const LAYERS = ['design', 'writing', 'task', 'publish']
    const keyOf = (n) => `${n.tab}:${n.unit ?? n.target ?? n.artifact ?? n.mode ?? n.shelf ?? n.view ?? n.type ?? ''}${n.source ? `#${n.source}` : ''}`
    const placeOf = ({ source, list, from, ...place }) => place
    const homeOf = (tab) => ({ tab })

    async function loadKit() {
      const [units, bindings, revisions, packs] = await Promise.all([call('praxis_units'), call('praxis_bindings', {}), call('praxis_revisions'), call('praxis_packs')])
      const byPath = new Map()
      for (const b of bindings) { const p = b.target.split('#')[0]; (byPath.get(p) ?? byPath.set(p, []).get(p)).push(b) }
      return { units, bindings, byPath, byId: new Map(units.map((u) => [u.id, u])), revisions: new Map(revisions.revisions.map((r) => [r.path, r])), removed: revisions.removed, packs }
    }

    // Source records, fetched once while the page is open: a source hovered, focused or next in line
    // is already drawn when it opens.
    function sourceCache() {
      const asked = new Map()
      const known = new Map()
      const get = (id) => {
        if (!asked.has(id)) asked.set(id, call('praxis_source', { id }).then((d) => { known.set(id, d); return d }, (e) => { asked.delete(id); throw e }))
        return asked.get(id)
      }
      return { get, peek: (id) => known.get(id), put: (id, d) => { known.set(id, d); asked.set(id, Promise.resolve(d)) }, forget: (id) => { asked.delete(id); known.delete(id) }, clear: () => { asked.clear(); known.clear() },
        // Ask again even when a record is kept: a check, a review or new stock may have come in since.
        fresh: (id) => { asked.delete(id); return get(id) } }
    }
    /** Pointer or focus resting on a source for a moment fetches its record. */
    const intentOn = (sources, id) => {
      let timer
      return { onPointerEnter: () => { timer = setTimeout(() => sources.get(id).catch(() => {}), 80) }, onPointerLeave: () => clearTimeout(timer), onFocus: () => sources.get(id).catch(() => {}) }
    }
    /** Runs `fn` when a kept pane comes to the front again, so it never shows stale records. */
    function useReturn(active, fn) {
      const was = React.useRef(active)
      React.useEffect(() => { if (active && !was.current) fn(); was.current = active }, [active])
    }

    function PraxisPage({ t, openSession, openPath, addToChat }) {
      const [nav, setNav] = React.useState(() => { const tab = recall('praxis.tab', 'kit'); return homeOf(TABS.includes(tab) ? tab : 'kit') })
      const here = React.useRef(nav)
      here.current = nav
      const places = React.useRef({ [nav.tab]: nav })
      const tops = React.useRef({})
      const settle = React.useRef(null)
      const seeds = React.useRef(new Map())
      const stepping = React.useRef(false)
      const [drawn, setDrawn] = React.useState(() => new Set([nav.tab]))
      const [last, setLast] = React.useState(null)
      const [kit, setKit] = React.useState(null)
      const [kitError, setKitError] = React.useState(null)
      const [catalog, setCatalog] = React.useState(null)
      const [catalogError, setCatalogError] = React.useState(null)
      const [attention, setAttention] = React.useState(0)
      const [requests, setRequests] = React.useState({ available: false, asks: [] })
      const [stamp, setStamp] = React.useState(0)
      const sources = React.useMemo(sourceCache, [])
      const scroll = React.useRef(null)
      // The cart: sources a person picked to work with, kept in this browser until taken into a chat.
      const [cart, setCart] = React.useState(() => { try { return JSON.parse(recall('praxis.cart', '[]')) } catch { return [] } })
      React.useEffect(() => { remember('praxis.cart', JSON.stringify(cart)) }, [cart])
      const toggleCart = React.useCallback((row) => setCart((c) => (c.some((x) => x.id === row.id) ? c.filter((x) => x.id !== row.id)
        : [...c, { id: row.id, title: row.title, url: row.url, description: row.description }])), [])
      const pick = { inCart: (id) => cart.some((x) => x.id === id), toggleCart }

      const reloadKit = React.useCallback(() => loadKit().then((k) => { setKit(k); setKitError(null) }, (e) => setKitError(String(e.message ?? e))), [])
      const reloadCatalog = React.useCallback(() => loadCatalog().then((c) => { setCatalog(c); setCatalogError(null) }, (e) => setCatalogError(String(e.message ?? e))), [])
      const loadUpkeep = React.useCallback(() => call('praxis_upkeep').then((r) => setAttention(upkeepCount(r)), () => {}), [])
      const [views, setViews] = React.useState([])
      const reloadViews = React.useCallback(() => call('praxis_views').then(setViews, () => {}), [])
      React.useEffect(() => { reloadKit(); loadUpkeep(); reloadViews(); asks().then(setRequests, () => {}) }, [reloadKit, loadUpkeep, reloadViews])
      const viewsRef = React.useRef(views)
      viewsRef.current = views
      // The sidebar counts the shelf, so the catalog loads with the page.
      React.useEffect(() => { reloadCatalog() }, [reloadCatalog, stamp])
      React.useEffect(() => { sources.clear() }, [stamp, sources])
      useReturn(nav.tab === 'kit', reloadKit)
      useReturn(nav.tab === 'shop', reloadCatalog)
      // While an agent is working, look again every few seconds; when it settles, everything reloads.
      const running = requests.asks.some((a) => a.status === 'running')
      React.useEffect(() => {
        if (!running) return
        const timer = setInterval(() => asks().then((next) => {
          setRequests(next)
          if (!next.asks.some((a) => a.status === 'running')) { reloadKit(); loadUpkeep(); setStamp((n) => n + 1) }
        }, () => {}), 3000)
        return () => clearInterval(timer)
      }, [running, reloadKit, loadUpkeep])

      // Every move goes through here: remember where the page sat, then draw the new place at `top`
      // and hand focus to the first of `focus` (item keys) that is on screen.
      const move = React.useCallback((to, how = {}) => {
        const cur = here.current
        if (scroll.current) tops.current[keyOf(cur)] = scroll.current.scrollTop
        places.current[to.tab] = to
        here.current = to
        settle.current = { top: how.top ?? 0, focus: how.focus, title: how.title }
        stepping.current = !!how.step
        if (to.tab !== cur.tab) remember('praxis.tab', to.tab)
        setDrawn((s) => (s.has(to.tab) ? s : new Set(s).add(to.tab)))
        setNav(to)
      }, [])
      React.useLayoutEffect(() => {
        const s = settle.current
        const box = scroll.current
        if (!s || !box) return
        settle.current = null
        box.scrollTop = s.top
        // A new page takes focus at its title, so the keyboard and a screen reader start there.
        if (s.title) box.querySelector('.pxs-detail h1, .pxs-pane:not([hidden]) h1[tabindex]')?.focus({ preventScroll: true })
        // The item is looked for where the page is, then in the dock (the cart, the capture line).
        const scopes = [box.querySelector('.pxs-pane:not([hidden])'), box.parentElement?.querySelector('.pxs-dock')].filter(Boolean)
        for (const key of [].concat(s.focus ?? [])) {
          const el = scopes.map((x) => x.querySelector(`[data-key="${CSS.escape(key)}"]`)).find(Boolean)
          if (!el) continue
          el.scrollIntoView({ block: 'nearest' })
          ;(el.matches('button') ? el : el.querySelector('button'))?.focus({ preventScroll: true })
          break
        }
      }, [nav])
      // Down or across: a new place, from its top.
      const go = React.useCallback((next) => move(typeof next === 'function' ? next(here.current) : next, { title: true }), [move])
      // Back up to a place already seen.
      const up = React.useCallback((to, focus) => move(to, { top: tops.current[keyOf(to)] ?? 0, focus }), [move])

      // The places down to `place`, each with the key it is listed under one level up.
      const lineage = (place, label) => {
        const line = [{ label: t(`tab.${place.tab}`), to: { tab: place.tab } }]
        if (place.unit && kit) {
          const chain = []
          for (let p = place.unit; p; p = parentOf(kit.units, p)) chain.unshift(p)
          for (const id of chain) line.push({ label: kit.byId.get(id)?.title ?? id, to: { tab: 'kit', unit: id }, key: `unit:${id}` })
        }
        if (place.target) place.target.split('/').forEach((part, i, all) => { const path = all.slice(0, i + 1).join('/'); line.push({ label: part, to: { tab: 'kit', target: path }, key: `target:${path}` }) })
        if (place.mode === 'manage') line.push({ label: t('tab.manage'), to: { tab: 'shop', mode: 'manage' } })
        if (place.shelf) line.push({ label: t(`shop.${place.shelf}`), to: { tab: 'shop', shelf: place.shelf } })
        if (place.view) line.push({ label: viewsRef.current.find((v) => v.id === place.view)?.title ?? place.view, to: { tab: 'shop', view: place.view } })
        if (place.type && kit) line.push({ label: kit.byId.get(place.type)?.title ?? place.type, to: { tab: 'task', type: place.type } })
        if (place.artifact) line.push({ label: label ?? place.artifact, to: { tab: 'artifacts', artifact: place.artifact }, key: `artifact:${place.artifact}` })
        return line
      }
      // A page's trail ends at its parent; each step goes back up with focus on the way down.
      const trailOf = (place, label) => {
        const line = lineage(place, label)
        return line.slice(0, -1).map((x, i) => ({ label: x.label, onClick: () => up(x.to, line[i + 1].key) }))
      }

      const openSource = React.useCallback((id, { list, label, seed } = {}) => {
        const cur = here.current
        if (seed) seeds.current.set(id, seed)
        move({ ...placeOf(cur), source: id, list: list ?? [id], from: cur.source ? cur.from : label })
      }, [move])
      const stepSource = React.useCallback((id) => move({ ...here.current, source: id }, { step: true }), [move])
      const closeSource = React.useCallback(() => {
        const cur = here.current
        if (!cur.source) return
        const list = cur.list ?? []
        const at = list.indexOf(cur.source)
        setLast(cur.source)
        // Back where it was opened; if it left that list (reviewed out of the queue), the next one takes focus.
        up(placeOf(cur), [cur.source, ...list.slice(at + 1), ...list.slice(0, Math.max(at, 0)).reverse()].map((id) => `source:${id}`))
      }, [up])
      const pickTab = (v) => {
        const cur = here.current
        if (v !== cur.tab) { const to = places.current[v] ?? homeOf(v); return move(to, { top: tops.current[keyOf(to)] ?? 0 }) }
        // The tab already in front: close the source, or go up to the tab's first level, or to its top.
        if (cur.source) return closeSource()
        const line = lineage(cur)
        if (line.length > 1 && cur.tab !== 'task') return up(line[0].to, line[1].key)
        scroll.current?.scrollTo({ top: 0, behavior: 'smooth' })
      }
      // Esc closes the innermost thing first: a field's own use of it, then an open source, then one
      // level up. An Esc used here stops here, so the Host does not also act on it.
      const onKeyDown = (e) => {
        if (e.key !== 'Escape' || e.altKey || e.metaKey || e.ctrlKey || e.shiftKey) return
        if (e.defaultPrevented) return e.stopPropagation()
        if (e.target.closest?.('input, textarea, select, [contenteditable="true"]')) return
        const cur = here.current
        const line = lineage(cur)
        if (!cur.source && !(line.length > 1 && cur.tab !== 'task')) return
        e.preventDefault()
        e.stopPropagation()
        if (cur.source) closeSource()
        else up(line.at(-2).to, line.at(-1).key)
      }
      React.useEffect(() => {
        const on = (e) => {
          const r = e.detail ?? {}
          if (r.source) move({ ...placeOf(places.current.shop ?? homeOf('shop')), source: r.source, list: [r.source] })
          else if (r.tab) go(r)
        }
        window.addEventListener(GO, on)
        return () => window.removeEventListener(GO, on)
      }, [go, move])

      const send = async (text) => {
        const ask = await asks(text)
        setRequests((r) => ({ ...r, asks: [ask, ...r.asks] }))
      }
      // A distill is an agent's work too: it reads the original and saves a summary as a stock version.
      const distill = async (id) => {
        const ask = await asks({ distill: id })
        setRequests((r) => ({ ...r, asks: [ask, ...r.asks] }))
      }
      const refresh = () => { loadUpkeep(); sources.clear(); return reloadKit() }
      const onReviewed = React.useCallback((next) => setCatalog((c) => (c ? { ...c, rows: c.rows.map((r) => (r.id === next.id ? { ...r, ...next } : r)) } : c)), [])
      const reviewedInList = React.useCallback((next) => { sources.forget(next.id); onReviewed(next) }, [sources, onReviewed])
      const rowsById = React.useMemo(() => new Map((catalog?.rows ?? []).map((r) => [r.id, r])), [catalog])
      const shared = { t, go, up, kit, send, refresh, openSession, openPath, stamp, pick, openSource, last, sources, trailOf, scroller: scroll, views, reloadViews }

      // Every tab seen so far stays drawn; only the one in front shows.
      const panes = TABS.filter((v) => drawn.has(v)).map((v) => {
        const active = v === nav.tab
        const props = { ...shared, nav: placeOf(active ? nav : places.current[v] ?? homeOf(v)), active: active && !nav.source }
        const body = v === 'shop' ? h(ShopView, { ...props, catalog, catalogError, reloadCatalog, onReviewed: reviewedInList })
          : v === 'task' ? h(TaskView, props)
            : v === 'artifacts' ? h(ArtifactsView, props)
              : v === 'log' ? h(LogView, { ...props, onCount: setAttention })
                : kitError && !kit ? h('p', { className: 'pxs-empty' }, t('kit.failed'), ' ', kitError) : h(KitView, props)
        return h('div', { key: v, className: 'pxs-pane', hidden: !active || !!nav.source || undefined }, body)
      })
      let detail = null
      if (nav.source) {
        const list = nav.list ?? []
        const at = list.indexOf(nav.source)
        const line = lineage(placeOf(nav), nav.from)
        detail = h(SourceDetail, { key: nav.source, id: nav.source, quiet: stepping.current, seed: rowsById.get(nav.source) ?? seeds.current.get(nav.source), t, go, kit, openSession, pick, sources, send, onReviewed, openSource, shelf: catalog?.rows, stamp,
          distill: requests.available ? distill : undefined, distilling: requests.asks.some((a) => a.status === 'running' && a.kind === 'distill' && a.source === nav.source),
          steps: { prev: at > 0 ? list[at - 1] : null, next: at >= 0 ? list[at + 1] ?? null : null }, onStep: stepSource,
          trail: line.map((x, i) => ({ label: x.label, onClick: i === line.length - 1 ? closeSource : () => up(x.to, line[i + 1].key) })),
          onTag: (x) => go({ tab: 'shop', tag: x, at: Date.now() }) })
      }

      // A place in the sidebar: the section's first level goes back up like its own name does; a
      // place already in front scrolls to its top.
      const pickPlace = (to) => {
        const cur = here.current
        if (keyOf(placeOf(cur)) === keyOf(to)) { if (cur.source) return closeSource(); return scroll.current?.scrollTo({ top: 0, behavior: 'smooth' }) }
        go({ ...to, at: Date.now() })
      }
      return h('section', { className: 'pxs-page', 'aria-label': 'Praxis', onKeyDown },
        h(Sidebar, { t, nav, kit, catalog, views, attention, pickTab, pickPlace }),
        h('div', { className: 'pxs-main' },
          h('div', { className: 'pxs-scroll', ref: scroll }, h('div', { className: 'pxs-content' }, panes, detail)),
          h(Composer, { t, available: requests.available, onSend: send },
            h(AskStrip, { asks: requests.asks, t, openSession, openSource }),
            cart.length ? h(Cart, { t, items: cart, setItems: setCart, openSource, addToChat }) : null)))
    }

    // ---- Sidebar: the five sections, and under the one in front its fixed places -----------------
    // Kit opens on its layers, Shop on its shelves and the views a person saved, Task on the task
    // types. These do not move with the data; filtering and grouping happen in the page itself.
    function Sidebar({ t, nav, kit, catalog, views, attention, pickTab, pickPlace }) {
      const units = kit?.units ?? []
      const rows = catalog?.rows
      const under = (layer) => units.filter((u) => u.id.startsWith(`${layer}/`)).length
      const types = units.filter((u) => u.id.startsWith('task/types/'))
      const open = rows?.filter((r) => !reviewed(r)).length
      const places = {
        kit: LAYERS.filter((l) => kit?.byId.has(l)).map((l) => ({ key: l, label: t(`layer.${l}`), glyph: l, n: under(l), to: { tab: 'kit', unit: l }, on: nav.unit === l || !!nav.unit?.startsWith(`${l}/`) })),
        shop: [
          { key: 'all', label: t('shop.all'), glyph: 'practice', n: rows?.length, to: { tab: 'shop' }, on: !nav.mode && !nav.shelf && !nav.view },
          { key: 'new', label: t('shop.new'), glyph: 'clock', to: { tab: 'shop', shelf: 'new' }, on: nav.shelf === 'new' },
          { key: 'used', label: t('shop.used'), glyph: 'refresh', to: { tab: 'shop', shelf: 'used' }, on: nav.shelf === 'used' },
          { key: 'manage', label: t('tab.manage'), glyph: 'check', n: open, to: { tab: 'shop', mode: 'manage' }, on: nav.mode === 'manage' },
          ...views.map((v) => ({ key: v.id, label: v.title, glyph: 'sliders', to: { tab: 'shop', view: v.id }, on: nav.view === v.id, saved: true })),
        ],
        task: types.map((u, i) => ({ key: u.id, label: u.title, glyph: 'task', to: { tab: 'task', type: u.id }, on: nav.type ? nav.type === u.id : i === 0 })),
      }
      const count = { kit: units.length || undefined, shop: rows?.length, log: attention || undefined }
      return h('nav', { className: 'pxs-side', 'aria-label': t('tab.label') },
        h('div', { className: 'pxs-side-head' }, h(PanelIcon, { size: 18 }), h('span', null, 'Praxis')),
        h('ul', { className: 'pxs-side-list' }, TABS.map((v) => {
          const here = nav.tab === v
          const kids = here ? places[v] ?? [] : []
          return h('li', { key: v },
            h('button', { type: 'button', className: 'pxs-side-item', 'data-top': true, 'aria-current': here && !kids.some((x) => x.on) ? 'page' : undefined, 'data-here': here || undefined, onClick: () => pickTab(v) },
              h(Glyph, { name: SECTION_GLYPH[v] }), h('span', { className: 'pxs-side-label' }, t(`tab.${v}`)),
              count[v] ? h('span', { className: v === 'log' ? 'pxs-badge' : 'pxs-side-n', 'aria-label': v === 'log' ? t('log.attention') : undefined }, String(count[v])) : null),
            kids.length ? h('ul', { className: 'pxs-side-sub' }, kids.map((x, i) => h('li', { key: x.key },
              x.saved && !kids[i - 1]?.saved ? h('p', { className: 'pxs-side-group' }, t('shop.views')) : null,
              h('button', { type: 'button', className: 'pxs-side-item', 'aria-current': x.on ? 'page' : undefined, onClick: () => pickPlace(x.to) },
                h(Glyph, { name: x.glyph, size: 15 }), h('span', { className: 'pxs-side-label' }, x.label),
                x.n ? h('span', { className: 'pxs-side-n' }, String(x.n)) : null)))) : null)
        })))
    }
    const SECTION_GLYPH = { kit: 'book', shop: 'cart', task: 'task', artifacts: 'archive', log: 'clock' }

    const upkeepCount = (r) => (r.reload ? 1 : 0) + r.bindings.length + r.unfiled.length + r.sources.length + r.revisions.length + r.artifacts.length
      + r.collections.reduce((k, c) => k + (c.added?.length ?? 0) + (c.gone?.length ?? 0), 0)

    // Shared pieces of every view: a trail, a page title, an entry row and an empty line.
    // A trail names the places above this page; the page's own name is its title.
    function Crumbs({ trail }) {
      if (!trail.length) return null
      return h('nav', { className: 'pxs-crumbs', 'aria-label': 'Breadcrumb' }, trail.map((c, i) => h(React.Fragment, { key: i },
        i ? h('span', { className: 'pxs-sep', 'aria-hidden': true }, '/') : null,
        h('button', { type: 'button', onClick: c.onClick }, c.label))))
    }
    function Title({ glyph, title, meta, children }) {
      return h('header', { className: 'pxs-detail-head' },
        glyph ? h('span', { className: 'pxs-tile lg' }, glyph) : null,
        h('div', { className: 'pxs-detail-title' }, h('h1', { dir: 'auto', tabIndex: -1 }, title), meta ? h('p', { className: 'pxs-caption' }, meta) : null),
        children)
    }
    function Entry({ glyph, title, aside, sub, desc, onOpen, children, mark, dataKey, last, intent }) {
      return h('div', { className: 'pxs-row', 'data-mark': mark, 'data-key': dataKey, 'data-last': last || undefined },
        h('button', { type: 'button', className: 'pxs-row-main', onClick: onOpen, disabled: !onOpen, ...intent },
          h('span', { className: 'pxs-tile' }, glyph),
          h('span', { className: 'pxs-row-text' },
            h('span', { className: 'pxs-row-title', dir: 'auto' }, title, sub ? h('span', { className: 'pxs-host' }, sub) : null),
            desc ? h('span', { className: 'pxs-row-desc', dir: 'auto' }, desc) : null)),
        h('span', { className: 'pxs-row-side' }, aside, children))
    }
    const Count = ({ n, glyph }) => (n ? h('span', { className: 'pxs-count-chip' }, h(Glyph, { name: glyph, size: 12 }), n) : null)
    const Wait = ({ children }) => h('span', { className: 'pxs-wait' }, children)

    // ---- Kit: home → layer → area → unit, and outside targets by path --------------------------
    const parentOf = (units, id) => { for (let p = id.split('/').slice(0, -1); p.length; p.pop()) { const x = p.join('/'); if (units.some((u) => u.id === x)) return x } return null }

    function KitView({ t, go, up, nav, kit, send, refresh, trailOf, openSource, last, sources }) {
      if (!kit) return h('div', { className: 'pxs-list', 'aria-busy': true }, [0, 1, 2].map((i) => h('div', { key: i, className: 'pxs-skel' }, h('i'), h('i'))))
      const { units, byPath } = kit
      const children = (id) => units.filter((u) => u.id !== id && parentOf(units, u.id) === id)
      const under = (id) => units.filter((u) => u.id === id || u.id.startsWith(`${id}/`))
      const sourcesUnder = (id) => under(id).flatMap((u) => byPath.get(u.path) ?? []).filter((b) => b.state !== 'removed')
      const alerts = (list) => list.filter((b) => b.signals.length).length
      const unitEntry = (u) => {
        const kids = children(u.id).length
        const list = kids ? sourcesUnder(u.id) : (byPath.get(u.path) ?? []).filter((b) => b.state !== 'removed')
        return h(Entry, { key: u.id, dataKey: `unit:${u.id}`, glyph: h(Glyph, { name: !u.id.includes('/') ? u.layer : kids ? 'folder' : 'article' }), title: u.title, desc: u.description,
          onOpen: () => go({ tab: 'kit', unit: u.id }),
          aside: [h(Count, { key: 'u', n: kids ? under(u.id).length - 1 : 0, glyph: 'article' }), h(Count, { key: 's', n: list.length, glyph: 'practice' }), alerts(list) ? h(Wait, { key: 'w' }, alerts(list)) : null] })
      }
      const pages = { t, go, up, kit, refresh, trailOf, openSource, last, sources }
      if (nav.unit && kit.byId.has(nav.unit)) return h(UnitPage, { ...pages, key: nav.unit, unit: kit.byId.get(nav.unit), children: children(nav.unit), unitEntry, send })
      if (nav.target) return h(TargetPage, { ...pages, key: nav.target, path: nav.target })

      const kitPaths = new Set(units.map((u) => u.path))
      const outside = kit.bindings.filter((b) => b.state !== 'removed' && !kitPaths.has(b.target.split('#')[0]))
      const groups = new Map()
      for (const b of outside) { const key = b.target.split('#')[0].split('/').slice(0, 2).join('/'); (groups.get(key) ?? groups.set(key, []).get(key)).push(b) }
      const layer = (id) => kit.byId.get(id)
      return h(React.Fragment, null,
        h('h1', { className: 'pxs-place-title', tabIndex: -1 }, t('tab.kit')),
        h(Block, { label: t('kit.core') }, h('div', { className: 'pxs-list' }, ['design', 'writing'].map(layer).filter(Boolean).map(unitEntry))),
        h(Block, { label: 'Stream' }, h('div', { className: 'pxs-list' }, units.filter((u) => u.layer === 'stream').map(unitEntry))),
        h(Block, { label: t('kit.flow') }, h('div', { className: 'pxs-list' }, ['task', 'publish'].map(layer).filter(Boolean).map(unitEntry))),
        groups.size ? h(Block, { label: t('kit.other') }, h('div', { className: 'pxs-list' }, [...groups].map(([key, list]) => h(Entry, { key, dataKey: `target:${key}`, glyph: h(Glyph, { name: 'folder' }), title: key,
          desc: t('kit.files', { n: new Set(list.map((b) => b.target.split('#')[0])).size }), onOpen: () => go({ tab: 'kit', target: key }), aside: h(Count, { n: list.length, glyph: 'practice' }) })))) : null,
        kit.packs.length ? h(Block, { label: t('kit.packs') }, h('div', { className: 'pxs-list' }, kit.packs.map((p) => h(Entry, { key: p.id, glyph: h(Glyph, { name: 'archive' }), title: p.title, sub: p.kind, desc: p.purpose,
          aside: h(Count, { n: p.sources, glyph: 'practice' }) })))) : null,
        kit.removed.length ? h(Block, { label: t('outline.removed'), aside: h('span', { className: 'pxs-caption' }, String(kit.removed.length)) }, h('div', { className: 'pxs-list' }, kit.removed.map((x) =>
          h(Entry, { key: x.path, glyph: h(Glyph, { name: 'archive' }), title: x.unit ?? x.path, sub: x.into ? t('outline.mergedInto', { u: x.into }) : x.path, desc: x.reason,
            aside: h(ReasonButton, { t, label: t('outline.restore'), placeholder: t('outline.why'), run: (r) => call('praxis_outline', { action: 'restore', path: x.path, expected_revision: x.revision, reason: r }).then(refresh, () => {}) }) })))) : null)
    }

    // Changing the outline, the same moves an agent makes with praxis_outline: an area takes a new page
    // or a new area under it; a page leaves the Kit on its own or merged into another, its sources moving
    // with it. Every change says why; nothing in the package is touched.
    function OutlineEdit({ t, kit, u, rev, refresh, go, up }) {
      const [open, setOpen] = React.useState(null)
      const [problem, setProblem] = React.useState(null)
      const area = u.path.endsWith('/README.md')
      const layer = !u.id.includes('/')
      const parent = parentOf(kit.units, u.id)
      const run = async (args, then) => { setProblem(null); try { const r = await call('praxis_outline', args); await refresh(); setOpen(null); then?.(r) } catch (e) { setProblem(e.status === 409 ? t('review.conflict') : String(e.message ?? e)) } }
      const add = (e) => {
        e.preventDefault()
        const f = new FormData(e.currentTarget)
        const name = String(f.get('name')).trim()
        const holds = f.get('holds') === 'on'
        const path = `${u.path.replace(/\/README\.md$/, '')}/${name}${holds ? '/README.md' : '.md'}`
        const desc = String(f.get('description') ?? '').trim()
        run({ action: 'add', path, body: `# ${String(f.get('title')).trim()}\n\n${desc}\n`, reason: String(f.get('why')).trim() }, (r) => go({ tab: 'kit', unit: r.id }))
      }
      const remove = (e) => {
        e.preventDefault()
        const f = new FormData(e.currentTarget)
        run({ action: 'remove', unit: u.id, into: f.get('into') || undefined, expected_revision: rev?.revision ?? 0, reason: String(f.get('why')).trim() },
          () => up(parent ? { tab: 'kit', unit: parent } : { tab: 'kit' }))
      }
      const others = kit.units.filter((x) => x.layer === u.layer && x.id !== u.id && !x.id.startsWith(`${u.id}/`))
      return h('div', { className: 'pxs-outline-edit' },
        h('div', { className: 'pxs-buttons' },
          area || layer ? h(P.Button, { variant: 'ghost', size: 'sm', icon: h(P.IconPlusOutlineRegular, { size: 13 }), 'aria-expanded': open === 'add', onClick: () => setOpen(open === 'add' ? null : 'add') }, t('outline.add')) : null,
          !layer ? h(P.Button, { variant: 'ghost', size: 'sm', 'aria-expanded': open === 'remove', onClick: () => setOpen(open === 'remove' ? null : 'remove') }, t('outline.remove')) : null),
        problem ? h('p', { className: 'pxs-problem', role: 'alert' }, problem) : null,
        open === 'add' ? h('form', { className: 'pxs-preset', onSubmit: add },
          h('div', { className: 'pxs-fields' },
            h('label', null, h('span', null, t('outline.title')), h('input', { name: 'title', required: true, autoFocus: true })),
            h('label', null, h('span', null, t('outline.name')), h('input', { name: 'name', required: true, pattern: '[a-z0-9]+(-[a-z0-9]+)*', placeholder: 'glass' })),
            h('label', null, h('span', null, t('outline.when')), h('input', { name: 'description' })),
            h('label', null, h('span', null, t('outline.why')), h('input', { name: 'why', required: true }))),
          h('label', { className: 'pxs-inline' }, h('input', { type: 'checkbox', name: 'holds' }), t('outline.holds')),
          h('div', { className: 'pxs-buttons' }, h(P.Button, { variant: 'primary', size: 'sm', type: 'submit' }, t('outline.addDo')), h(P.Button, { variant: 'ghost', size: 'sm', onClick: () => setOpen(null) }, t('review.cancel')))) : null,
        open === 'remove' ? h('form', { className: 'pxs-preset', onSubmit: remove },
          h('div', { className: 'pxs-fields' },
            h('label', null, h('span', null, t('outline.into')), h('select', { name: 'into', defaultValue: '' }, h('option', { value: '' }, t('outline.intoNone')), others.map((x) => h('option', { key: x.id, value: x.id }, `${x.title} · ${x.id}`)))),
            h('label', null, h('span', null, t('outline.why')), h('input', { name: 'why', required: true, autoFocus: true }))),
          h('p', { className: 'pxs-caption' }, area ? t('outline.areaNote') : t('outline.removeNote')),
          h('div', { className: 'pxs-buttons' }, h(P.Button, { variant: 'primary', size: 'sm', type: 'submit' }, t('outline.removeDo')), h(P.Button, { variant: 'ghost', size: 'sm', onClick: () => setOpen(null) }, t('review.cancel')))) : null)
    }

    function UnitPage({ t, kit, unit: u, children, unitEntry, send, refresh, trailOf, ...pages }) {
      const [body, setBody] = React.useState(null)
      const [problem, setProblem] = React.useState(null)
      const rev = kit.revisions.get(u.path)
      const toggleBody = async () => { if (body) return setBody(null); try { setBody((await call('praxis_unit', { ref: u.id })).body) } catch (e) { setProblem(String(e.message ?? e)) } }
      const revert = async () => { try { await call('praxis_unit_revert', { unit: u.id, expected_revision: rev.revision }); refresh() } catch (e) { setProblem(String(e.message ?? e)) } }
      return h('article', { className: 'pxs-page-body' },
        h(Crumbs, { trail: trailOf({ tab: 'kit', unit: u.id }) }),
        h(Title, { glyph: h(Glyph, { name: children.length ? 'folder' : u.layer, size: 20 }), title: u.title,
          meta: [u.id, u.version, u.updated_at ? day(u.updated_at) : null].filter(Boolean).join(' · ') },
          h('div', { className: 'pxs-buttons' },
            u.resident ? h(P.Tag, { tone: 'neutral' }, t('unit.resident')) : null,
            rev ? h(P.Tag, { tone: 'neutral' }, t(rev.added ? 'unit.added' : 'unit.revised')) : null,
            rev?.conflict ? h(Wait, null, t('unit.conflict')) : null)),
        h('p', { className: 'pxs-when', dir: 'auto' }, u.description),
        rev ? h('p', { className: 'pxs-caption' }, t(rev.added ? 'unit.addedWhy' : 'unit.revisedWhy', { r: rev.reason })) : null,
        problem ? h('p', { className: 'pxs-problem', role: 'alert' }, problem) : null,
        h('div', { className: 'pxs-buttons' },
          h(P.Button, { variant: 'outline', size: 'sm', onClick: toggleBody }, body ? t('unit.hide') : t('unit.read')),
          rev && !rev.added ? h(P.Button, { variant: 'ghost', size: 'sm', onClick: revert }, t('unit.revert')) : null,
          h(P.Button, { variant: 'ghost', size: 'sm', onClick: () => send(t('ask.forUnit', { id: u.id, title: u.title })) }, t('unit.askSources'))),
        h(OutlineEdit, { t, kit, u, rev, refresh, go: pages.go, up: pages.up }),
        body ? h('div', { className: 'pxs-doc' }, h(P.MarkdownText, { text: body })) : null,
        children.length ? h(Block, { label: t('unit.contents'), aside: h('span', { className: 'pxs-caption' }, String(children.length)) }, h('div', { className: 'pxs-list' }, children.map(unitEntry))) : null,
        !children.length || (kit.byPath.get(u.path) ?? []).length ? h(Bindings, { t, kit, path: u.path, refresh, ...pages }) : null)
    }

    function TargetPage({ t, go, kit, path, trailOf, ...pages }) {
      const list = kit.bindings.filter((b) => b.state !== 'removed').filter((b) => { const p = b.target.split('#')[0]; return p === path || p.startsWith(`${path}/`) })
      const kids = new Map()
      for (const b of list) {
        const p = b.target.split('#')[0]
        if (p === path) continue
        const key = `${path}/${p.slice(path.length + 1).split('/')[0]}`
        ;(kids.get(key) ?? kids.set(key, []).get(key)).push(b)
      }
      return h('article', { className: 'pxs-page-body' },
        h(Crumbs, { trail: trailOf({ tab: 'kit', target: path }) }),
        h(Title, { glyph: h(Glyph, { name: kids.size ? 'folder' : 'article', size: 20 }), title: path.split('/').at(-1), meta: path }),
        kids.size ? h(Block, { label: t('unit.contents'), aside: h('span', { className: 'pxs-caption' }, String(kids.size)) }, h('div', { className: 'pxs-list' }, [...kids].sort((a, b) => a[0].localeCompare(b[0])).map(([key, items]) =>
          h(Entry, { key, dataKey: `target:${key}`, glyph: h(Glyph, { name: items.some((b) => b.target.split('#')[0] !== key) ? 'folder' : 'article' }), title: key.split('/').pop(), sub: key, onOpen: () => go({ tab: 'kit', target: key }), aside: h(Count, { n: items.length, glyph: 'practice' }) })))) : null,
        list.some((b) => b.target.split('#')[0] === path) ? h(Bindings, { t, kit, path, ...pages }) : null)
    }

    // The sources hung on one page: each says what it is for here and how far its original was read.
    // A person switches, stars, checks or removes them; descriptions are written by the agent.
    function Bindings({ t, kit, path, refresh, openSource, last, sources }) {
      // Drawn at once from the Kit already loaded, then read again with every state.
      const [list, setList] = React.useState(() => (kit ? (kit.byPath.get(path) ?? []).filter((b) => b.target.split('#')[0] === path) : null))
      const [removed, setRemoved] = React.useState(false)
      const [problem, setProblem] = React.useState(null)
      const load = React.useCallback(() => call('praxis_bindings', { target: path, include_removed: removed }).then((all) => setList(all.filter((b) => b.target.split('#')[0] === path)), (e) => setProblem(String(e.message ?? e))), [path, removed])
      React.useEffect(() => { load() }, [load])
      const act = async (fn) => { setProblem(null); try { await fn(); await load(); refresh?.() } catch (e) { setProblem(e.status === 409 ? t('review.conflict') : String(e.message ?? e)); load() } }
      const shown = (list ?? []).slice().sort((a, b) => (b.priority === 'preferred') - (a.priority === 'preferred') || b.favorite - a.favorite || b.enabled - a.enabled)
      return h(Block, { label: t('kit.sources'), aside: h('span', { className: 'pxs-caption' }, String((list ?? []).filter((b) => b.state !== 'removed').length)) },
        h('div', { className: 'pxs-bindings-bar' }, h(P.Checkbox, { checked: removed, onChange: setRemoved, label: t('kit.showRemoved') })),
        problem ? h('p', { className: 'pxs-problem', role: 'alert' }, problem) : null,
        !list ? h('div', { className: 'pxs-skel' }, h('i'), h('i')) : !shown.length ? h('p', { className: 'pxs-none' }, t('kit.noSources')) : h('div', { className: 'pxs-list' }, shown.map((b) => {
          const off = b.state === 'removed'
          return h(Entry, { key: b.id, mark: off ? 'removed' : !b.enabled ? 'off' : undefined, dataKey: `source:${b.source}`, last: b.source === last, intent: intentOn(sources, b.source),
            glyph: h(Glyph, { name: b.form ?? 'article' }), title: b.title, desc: b.description,
            onOpen: () => openSource(b.source, { list: shown.filter((x) => x.state !== 'removed').map((x) => x.source), seed: { title: b.title, form: b.form } }),
            aside: [b.signals.map((g) => h(Wait, { key: g }, t(`gap.${g}`))), b.review ? h(P.Tag, { key: 'r', tone: 'neutral' }, t(`v.${b.review.verdict}`)) : null, h(ReadWord, { key: 'e', row: b, t })] },
            off ? h(P.Button, { variant: 'ghost', size: 'sm', onClick: () => act(() => call('praxis_restore', { binding: b.id, expected_revision: b.revision })) }, t('kit.restore'))
              : h(React.Fragment, null,
                h('button', { type: 'button', className: 'pxs-star', 'aria-pressed': b.favorite, 'aria-label': t('kit.favorite'), title: t('kit.favorite'), onClick: () => act(() => call('praxis_curate', { binding: b.id, expected_revision: b.revision, favorite: !b.favorite })) }, h(Glyph, { name: b.favorite ? 'starOn' : 'star', size: 14 })),
                h(P.Switch, { checked: b.enabled, label: t('kit.enabled'), onChange: () => act(() => call('praxis_curate', { binding: b.id, expected_revision: b.revision, enabled: !b.enabled })) }),
                h(BindingMenu, { b, t, act })))
        })))
    }
    function BindingMenu({ b, t, act }) {
      const [open, setOpen] = React.useState(false)
      const pick = (fn) => () => { setOpen(false); act(fn) }
      return h(P.Menu, { open, onClose: () => setOpen(false), align: 'end', portal: true,
        anchor: h(P.Button, { variant: 'ghost', size: 'sm', 'aria-label': t('review.more'), 'aria-haspopup': 'menu', 'aria-expanded': open, icon: h(P.IconEllipsisOutlineRegular, { size: 16 }), onClick: () => setOpen(!open) }) },
        h(P.MenuItemButton, { icon: h(P.IconRefreshOutlineRegular, { size: 14 }), onSelect: pick(() => call('praxis_refresh', { source: b.source })) }, t('kit.check')),
        h(P.MenuItemButton, { icon: h(P.IconCheckOutlineRegular, { size: 14 }), separatorBefore: true, onSelect: pick(() => call('praxis_review', { binding: b.id, revision: b.revision, verdict: 'accurate' })) }, t('kit.bindingAccurate')),
        h(P.MenuItemButton, { icon: h(P.IconWarningOutlineRegular, { size: 14 }), onSelect: pick(() => call('praxis_review', { binding: b.id, revision: b.revision, verdict: 'needs-work' })) }, t('kit.bindingNeedsWork')),
        h(P.MenuItemButton, { icon: h(P.IconTrashOutlineRegular, { size: 14 }), separatorBefore: true, onSelect: pick(() => call('praxis_remove', { binding: b.id, expected_revision: b.revision })) }, t('kit.remove')))
    }

    // ---- Task: what an agent would read for a task type, and the presets per pipeline ----------
    // The task type is the place, picked in the sidebar; the first one is the section's first page.
    function TaskView({ t, go, nav, openSource, last, sources }) {
      const [entry, setEntry] = React.useState(null)
      const [presets, setPresets] = React.useState(null)
      const [pick, setPick] = React.useState({ type: nav.type ?? '', pipeline: '', preset: '', stream: '' })
      React.useEffect(() => { if (nav.type) setPick((p) => (p.type === nav.type ? p : { ...p, type: nav.type })) }, [nav.type])
      const [r, setR] = React.useState(null)
      const [problem, setProblem] = React.useState(null)
      const [busy, setBusy] = React.useState(false)
      const asked = React.useRef(0)
      const loadPresets = React.useCallback(() => call('praxis_presets').then(setPresets, () => {}), [])
      React.useEffect(() => { call('praxis_entry').then((e) => { setEntry(e); setPick((p) => ({ ...p, type: p.type || e.task_types[0]?.id || '' })) }); loadPresets() }, [loadPresets])
      React.useEffect(() => {
        if (!pick.type) return
        // The last answer stays in view, dimmed, until the new one arrives; a late answer to an old pick is dropped.
        const n = ++asked.current
        setProblem(null); setBusy(true)
        call('praxis_resolve', { task_type: pick.type, pipeline: pick.pipeline || undefined, preset: pick.preset || undefined, stream: pick.stream || undefined })
          .then((x) => { if (n === asked.current) setR(x) }, (e) => { if (n === asked.current) setProblem(String(e.message ?? e)) })
          .finally(() => { if (n === asked.current) setBusy(false) })
      }, [pick])
      if (!entry) return h('div', { className: 'pxs-skel' }, h('i'), h('i'))
      const set = (k) => (v) => setPick((p) => ({ ...p, [k]: v }))
      const select = (label, value, options, onChange) => h('label', { className: 'pxs-select' }, h('span', { className: 'pxs-caption' }, label),
        h('select', { value, onChange: (e) => onChange(e.target.value) }, options.map(([v, l]) => h('option', { key: v, value: v }, l))))
      const layerCount = r ? [...LAYERS, ...(r.stream ? ['stream'] : [])].map((l) => [l, r.units.filter((u) => u.id.split('/')[0] === l).length]) : []
      return h(React.Fragment, null,
        h('div', { className: 'pxs-task-picks' },
          h('h1', { className: 'pxs-place-title', tabIndex: -1 }, entry.task_types.find((x) => x.id === pick.type)?.title ?? t('tab.task')),
          h('div', { className: 'pxs-task-selects' },
            h(P.SegmentedControl, { label: t('task.pipeline'), value: pick.pipeline, onChange: set('pipeline'), options: [{ value: '', label: t('task.default') }, { value: 'html', label: 'html' }, { value: 'video', label: 'video' }] }),
            select(t('task.preset'), pick.preset, [['', t('task.presetDefault')], ...(presets?.presets ?? []).map((p) => [p.id, `${p.pipeline} · ${p.title}`])], set('preset')),
            entry.streams.length ? select('Stream', pick.stream, [['', t('task.noStream')], ...entry.streams.map((s) => [s.id, s.title])], set('stream')) : null)),
        problem ? h('p', { className: 'pxs-problem', role: 'alert' }, problem) : null,
        r ? h('div', { className: 'pxs-result', 'aria-busy': busy || undefined },
          h('p', { className: 'pxs-when', dir: 'auto' }, r.task_type.outcome),
          h('div', { className: 'pxs-flow', 'aria-label': t('task.flow') }, layerCount.map(([l, n]) => h('span', { key: l, 'data-zero': !n || undefined }, h('b', null, n), l)), h('span', { 'data-zero': !r.materials.length || undefined }, h('b', null, r.materials.length), t('task.materials'))),
          h(Block, { label: t('task.units'), aside: h('span', { className: 'pxs-caption' }, String(r.units.length)) }, h('div', { className: 'pxs-list' }, r.units.map((u) =>
            h(Entry, { key: u.id, dataKey: `unit:${u.id}`, glyph: h(Glyph, { name: u.id.split('/')[0] }), title: u.title, sub: u.id, desc: u.description, onOpen: () => go({ tab: 'kit', unit: u.id }), aside: u.reasons.map((x) => h(P.Tag, { key: x, tone: 'neutral' }, x)) })))),
          h(Block, { label: t('task.materials'), aside: h('span', { className: 'pxs-caption' }, String(r.materials.length)) }, r.materials.length ? h('div', { className: 'pxs-list' }, r.materials.map((m) =>
            h(Entry, { key: m.source, dataKey: `source:${m.source}`, last: m.source === last, intent: intentOn(sources, m.source), glyph: h(Glyph, { name: m.form ?? 'article' }), title: m.title, sub: hostOf(m.url), desc: m.description,
              onOpen: () => openSource(m.source, { list: r.materials.map((x) => x.source), seed: { title: m.title, url: m.url, form: m.form } }), aside: h(ReadWord, { row: m, t }) }))) : h('p', { className: 'pxs-none' }, t('task.noMaterials'))),
          r.exemplars.length ? h(Block, { label: t('task.exemplars'), aside: h('span', { className: 'pxs-caption' }, String(r.exemplars.length)) }, h('div', { className: 'pxs-list' }, r.exemplars.map((x) =>
            h(Entry, { key: x.artifact, dataKey: `artifact:${x.artifact}`, glyph: h(Glyph, { name: 'archive' }), title: x.title, sub: t(`kind.${x.kind}`), desc: x.description ?? x.path, onOpen: () => go({ tab: 'artifacts', artifact: x.artifact }) })))) : null,
          r.preset ? h(Block, { label: t('task.presetValues', { p: r.preset.title }) }, h('dl', { className: 'pxs-kv' }, Object.entries(r.preset.values).map(([k, v]) => h(React.Fragment, { key: k }, h('dt', null, k), h('dd', null, Array.isArray(v) ? v.join(' ') : String(v)))))) : null,
          h(Block, { label: t('task.acceptance'), aside: h('span', { className: 'pxs-caption' }, String(r.task_type.acceptance.length)) }, h('ol', { className: 'pxs-checks' }, r.task_type.acceptance.map((a, i) => h('li', { key: i, dir: 'auto' }, a))))) : h('div', { className: 'pxs-skel' }, h('i'), h('i')),
        presets ? h(Presets, { t, data: presets, reload: loadPresets }) : null)
    }

    // Presets are settings, not records: a person edits them here directly.
    function Presets({ t, data, reload }) {
      const [edit, setEdit] = React.useState(null)
      const [problem, setProblem] = React.useState(null)
      const save = async (e) => {
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        const fields = data.fields[edit.pipeline]
        const values = {}
        for (const f of fields) {
          const raw = String(form.get(f.key) ?? '').trim()
          if (raw) values[f.key] = f.type === 'number' ? Number(raw) : f.type === 'boolean' ? raw === 'true' : f.type === 'list' ? raw.split(/\s+/) : raw
        }
        try {
          await call('praxis_preset_save', { id: edit.id || undefined, expected_revision: edit.id ? edit.revision : undefined, pipeline: edit.pipeline,
            title: String(form.get('title')).trim(), description: String(form.get('description') ?? '').trim() || undefined, default: form.get('default') === 'on', values, tags: edit.tags ?? [] })
          setEdit(null); reload()
        } catch (err) { setProblem(err.status === 409 ? t('review.conflict') : String(err.message ?? err)) }
      }
      const remove = async () => { try { await call('praxis_preset_remove', { id: edit.id, expected_revision: edit.revision }); setEdit(null); reload() } catch (err) { setProblem(String(err.message ?? err)) } }
      return h(Block, { label: t('task.presets') },
        Object.keys(data.fields).map((pipeline) => h('div', { key: pipeline, className: 'pxs-form-group' },
          h('h3', null, pipeline),
          h('div', { className: 'pxs-list' }, data.presets.filter((p) => p.pipeline === pipeline).map((p) =>
            h(Entry, { key: p.id, glyph: h(Glyph, { name: 'sliders' }), title: p.title, sub: p.id, desc: p.description, onOpen: () => { setProblem(null); setEdit(p) }, aside: p.default ? h(P.Tag, { tone: 'neutral' }, t('task.isDefault')) : null }))),
          h(P.Button, { variant: 'ghost', size: 'sm', icon: h(P.IconPlusOutlineRegular, { size: 13 }), onClick: () => setEdit({ pipeline, title: '', values: {}, revision: 0 }) }, t('task.newPreset', { p: pipeline })))),
        edit ? h('form', { className: 'pxs-preset', onSubmit: save, key: edit.id ?? `new-${edit.pipeline}` },
          h('h3', null, edit.id ? edit.title : t('task.newPreset', { p: edit.pipeline })),
          problem ? h('p', { className: 'pxs-problem', role: 'alert' }, problem) : null,
          h('div', { className: 'pxs-fields' },
            h('label', null, h('span', null, t('task.presetName')), h('input', { name: 'title', defaultValue: edit.title, required: true })),
            h('label', null, h('span', null, t('task.presetWhen')), h('input', { name: 'description', defaultValue: edit.description ?? '' })),
            data.fields[edit.pipeline].map((f) => {
              const v = edit.values?.[f.key]
              return h('label', { key: f.key }, h('span', null, f.label ?? f.key, f.required ? ' *' : ''),
                f.type === 'boolean' ? h('select', { name: f.key, defaultValue: v === true ? 'true' : v === false ? 'false' : '' }, h('option', { value: '' }, '—'), h('option', { value: 'true' }, t('yes')), h('option', { value: 'false' }, t('no')))
                  : h('input', { name: f.key, defaultValue: Array.isArray(v) ? v.join(' ') : (v ?? ''), placeholder: f.hint ?? '', required: f.required }))
            })),
          h('label', { className: 'pxs-inline' }, h('input', { type: 'checkbox', name: 'default', defaultChecked: !!edit.default }), t('task.makeDefault', { p: edit.pipeline })),
          h('div', { className: 'pxs-buttons' },
            h(P.Button, { variant: 'primary', size: 'sm', type: 'submit' }, t('task.save')),
            h(P.Button, { variant: 'ghost', size: 'sm', onClick: () => setEdit(null) }, t('review.cancel')),
            edit.id ? h(P.Button, { variant: 'ghost', size: 'sm', onClick: remove }, t('task.removePreset')) : null)) : null)
    }

    // ---- Artifacts: local work by project; a version's run says what it was made from -----------
    const ART_VERDICTS = ['needs-work', 'checked', 'accepted']
    function ArtifactsView({ t, go, nav, openPath, active, kit, trailOf, openSource, last, sources }) {
      const [list, setList] = React.useState(null)
      const [projects, setProjects] = React.useState([])
      const [kind, setKind] = React.useState('')
      const [query, setQuery] = React.useState('')
      const load = React.useCallback(() => Promise.all([call('praxis_artifacts', { limit: 500 }), call('praxis_projects')]).then(([a, p]) => { setList(a); setProjects(p) }), [])
      React.useEffect(() => { load() }, [load])
      useReturn(active, load)
      if (nav.artifact) return h(ArtifactDetail, { key: nav.artifact, t, go, id: nav.artifact, seed: list?.find((x) => x.id === nav.artifact), reload: load, openPath, kit, trailOf, openSource, last, sources })
      if (!list) return h('div', { className: 'pxs-skel' }, h('i'), h('i'))
      const q = query.trim().toLowerCase()
      const shown = list.filter((a) => (!kind || a.kind === kind) && (!q || `${a.title} ${a.description ?? ''} ${a.path}`.toLowerCase().includes(q)))
      const row = (a) => h(Entry, { key: a.id, dataKey: `artifact:${a.id}`, glyph: h(Glyph, { name: a.kind === 'pipeline' ? 'tool' : a.kind === 'example' ? 'case' : 'article' }), title: a.title, sub: `v${a.version}`, desc: a.project_path ?? a.path,
        onOpen: () => go({ tab: 'artifacts', artifact: a.id }),
        aside: [a.kind !== 'delivery' ? h(P.Tag, { key: 'k', tone: 'neutral' }, t(`kind.${a.kind}`)) : null, a.status === 'modified' ? h(P.Tag, { key: 'm', tone: 'neutral' }, t('as.modified')) : null, a.signals.map((g) => h(Wait, { key: g }, t(`as.${g}`)))] })
      const groups = projects.map((p) => [p, shown.filter((a) => a.project?.id === p.id)]).filter(([p, items]) => items.length || (!q && !kind && p.unregistered.length))
      const outside = shown.filter((a) => !a.project)
      return h(React.Fragment, null,
        h('h1', { className: 'pxs-place-title', tabIndex: -1 }, t('tab.artifacts')),
        h('div', { className: 'pxs-bar' },
          h('div', { className: 'pxs-pills', role: 'group' }, ['', 'delivery', 'pipeline', 'example'].map((k) => h(P.Pill, { key: k || 'all', active: kind === k, 'aria-pressed': kind === k, onClick: () => setKind(k) }, k ? t(`kind.${k}`) : t('review.f.all')))),
          h(P.Input, { className: 'pxs-search', type: 'search', value: query, placeholder: t('art.search'), 'aria-label': t('art.search'), icon: h(P.IconSearchOutlineRegular, { size: 14 }), onChange: (e) => setQuery(e.target.value) })),
        !groups.length && !outside.length ? h('p', { className: 'pxs-empty' }, t(list.length ? 'art.noMatch' : 'art.none')) : null,
        groups.map(([p, items]) => h(Block, { key: p.id, label: p.title, aside: h('span', { className: 'pxs-caption' }, p.root || '.') },
          p.unregistered.length ? h('details', { className: 'pxs-unreg' }, h('summary', null, h(Wait, null, t('art.unregistered', { n: p.unregistered.length }))), h('ul', null, p.unregistered.map((f) => h('li', { key: f }, h('code', null, f))))) : null,
          h('div', { className: 'pxs-list' }, items.map(row)))),
        outside.length ? h(Block, { label: t('art.outside') }, h('div', { className: 'pxs-list' }, outside.map(row))) : null)
    }

    function ArtifactDetail({ t, go, id, seed, reload, openPath, kit, trailOf, openSource, last, sources }) {
      const [a, setA] = React.useState(null)
      const [note, setNote] = React.useState('')
      const [verdict, setVerdict] = React.useState('checked')
      const [problem, setProblem] = React.useState(null)
      const load = React.useCallback(() => call('praxis_artifact', { id }).then(setA, (e) => setProblem(String(e.message ?? e))), [id])
      React.useEffect(() => { load() }, [load])
      const review = async () => { try { await call('praxis_artifact_review', { id, version: a.version, verdict, note: note.trim() || undefined }); setNote(''); load(); reload() } catch (e) { setProblem(String(e.message ?? e)) } }
      const trail = h(Crumbs, { trail: trailOf({ tab: 'artifacts', artifact: id }) })
      // The row it was opened from already names it: draw that while the versions load.
      if (!a) return h('article', { className: 'pxs-page-body' }, trail,
        seed ? h(Title, { glyph: h(Glyph, { name: 'article', size: 20 }), title: seed.title, meta: [seed.kind !== 'delivery' ? t(`kind.${seed.kind}`) : null, `v${seed.version}`, seed.path].filter(Boolean).join(' · ') }) : null,
        problem ? h('p', { className: 'pxs-problem' }, problem) : h('div', { className: 'pxs-skel' }, h('i'), h('i')))
      return h('article', { className: 'pxs-page-body' },
        trail,
        h(Title, { glyph: h(Glyph, { name: 'article', size: 20 }), title: a.title, meta: [a.kind !== 'delivery' ? t(`kind.${a.kind}`) : null, `v${a.version}`, a.path].filter(Boolean).join(' · ') },
          h('div', { className: 'pxs-buttons' },
            h(P.Button, { variant: 'ghost', size: 'sm', onClick: () => openPath(a.absolute, 'reveal').then((ok) => ok || setProblem(t('art.failed'))) }, t('art.reveal')),
            h('button', { type: 'button', className: 'pxs-open', onClick: () => openPath(a.absolute, 'open').then((ok) => ok || setProblem(t('art.failed'))) }, t('art.openFile'), h(Glyph, { name: 'out', size: 14 })))),
        a.description ? h('p', { className: 'pxs-when', dir: 'auto' }, a.description) : null,
        a.signals.length ? h('p', null, a.signals.map((g) => h(Wait, { key: g }, t(`as.${g}`)))) : null,
        problem ? h('p', { className: 'pxs-problem', role: 'alert' }, problem) : null,
        h(Block, { label: t('art.serves') }, a.serves.length ? h('div', { className: 'pxs-list' }, a.serves.map((s) =>
          h(Entry, { key: s.target, glyph: h(Glyph, { name: 'article' }), title: (s.unit && kit?.byId.get(s.unit)?.title) || s.unit || s.target, desc: s.description, onOpen: s.unit ? () => go({ tab: 'kit', unit: s.unit }) : undefined }))) : h('p', { className: 'pxs-none' }, t('art.servesNone'))),
        h(Block, { label: t('art.versions'), aside: h('span', { className: 'pxs-caption' }, String(a.versions.length)) }, h('ol', { className: 'pxs-versions' }, [...a.versions].reverse().map((v) =>
          h('li', { key: v.version },
            h('time', null, day(v.at)),
            h('div', null,
              h('p', null, h('b', null, `v${v.version}`), ' ', v.run ? v.run.title : v.by ?? t('art.noRun'), v.run?.changed ? [' ', h(Wait, { key: 'c' }, t('art.basis'))] : null),
              v.run && (v.run.units.length || v.run.sources.length) ? h('p', { className: 'pxs-links' }, h('span', { className: 'pxs-caption' }, t('art.used')),
                v.run.units.map((u) => h('button', { key: u, type: 'button', className: 'pxs-link', onClick: () => go({ tab: 'kit', unit: u }) }, kit?.byId.get(u)?.title ?? u)),
                v.run.sources.map((x) => h('button', { key: x.id, type: 'button', className: 'pxs-link', 'data-key': `source:${x.id}`, 'data-last': x.id === last || undefined, ...intentOn(sources, x.id),
                  onClick: () => openSource(x.id, { list: v.run.sources.map((y) => y.id), label: a.title, seed: { title: x.title } }) }, x.title))) : null,
              v.made_with ? h('p', { className: 'pxs-links' }, h('span', { className: 'pxs-caption' }, t('art.madeWith')), h('button', { type: 'button', className: 'pxs-link', onClick: () => go({ tab: 'artifacts', artifact: v.made_with.id }) }, v.made_with.title)) : null,
              v.review ? h('p', { className: 'pxs-caption' }, `${t(`av.${v.review.verdict}`)} · ${v.review.by ?? '—'}${v.review.note ? ` · ${v.review.note}` : ''}`) : null))))),
        h('footer', { className: 'pxs-verdict' },
          h('span', { className: 'pxs-verdict-q' }, t('art.question', { v: a.version })),
          h('div', { className: 'pxs-ask-note' },
            h(P.SegmentedControl, { label: t('art.question', { v: a.version }), value: verdict, onChange: setVerdict, options: ART_VERDICTS.map((v) => ({ value: v, label: t(`av.${v}`) })) }),
            h(P.Input, { value: note, placeholder: t('review.noteOptional'), 'aria-label': t('review.noteOptional'), onChange: (e) => setNote(e.target.value) })),
          h(P.Button, { variant: 'primary', size: 'sm', onClick: review }, t('art.record'))))
    }

    // ---- Log: what needs someone now (usually nothing), then runs and maintenance -------------
    function LogView({ t, go, send, refresh, onCount, stamp, active, openSource, last, sources }) {
      const [up, setUp] = React.useState(null)
      const [runs, setRuns] = React.useState(null)
      const [history, setHistory] = React.useState(null)
      const [problem, setProblem] = React.useState(null)
      const load = React.useCallback(() => Promise.all([call('praxis_upkeep'), call('praxis_runs'), call('praxis_history', { limit: 60 })])
        .then(([u, r, hs]) => { setUp(u); setRuns(r); setHistory(hs); onCount(upkeepCount(u)) }, (e) => setProblem(String(e.message ?? e))), [onCount])
      React.useEffect(() => { load() }, [load, stamp])
      useReturn(active, load)
      const act = async (fn) => { try { await fn(); load(); refresh() } catch (e) { setProblem(String(e.message ?? e)) } }
      if (!up) return problem ? h('p', { className: 'pxs-problem' }, problem) : h('div', { className: 'pxs-skel' }, h('i'), h('i'))
      const items = [
        up.reload ? h(Entry, { key: 'reload', glyph: h(Glyph, { name: 'refresh' }), title: t('log.reload') }) : null,
        ...up.bindings.map((b) => h(Entry, { key: b.id, glyph: h(Glyph, { name: 'practice' }), title: b.title, sub: b.unit ?? b.target, onOpen: () => go(b.unit ? { tab: 'kit', unit: b.unit } : { tab: 'kit', target: b.target.split('#')[0] }), aside: b.signals.map((g) => h(Wait, { key: g }, t(`gap.${g}`))) })),
        ...up.sources.map((s) => h(Entry, { key: s.id, dataKey: `source:${s.id}`, last: s.id === last, intent: intentOn(sources, s.id), glyph: h(Glyph, { name: s.form ?? 'article' }), title: s.title, sub: hostOf(s.url),
          onOpen: () => openSource(s.id, { list: up.sources.map((x) => x.id), seed: { title: s.title, form: s.form, url: s.url } }), aside: s.signals.map((g) => h(Wait, { key: g }, t(`gap.${g}`))) })),
        ...up.unfiled.map((s) => h(Entry, { key: s.id, glyph: h(Glyph, { name: 'article' }), title: s.title, sub: hostOf(s.url), desc: t('log.unfiled'), aside: h(P.Button, { variant: 'ghost', size: 'sm', onClick: () => send(t('ask.file', { id: s.id, title: s.title })) }, t('log.sendFile')) })),
        ...up.collections.flatMap((c) => [
          ...(c.added ?? []).map((url) => h(Entry, { key: `${c.id}+${url}`, glyph: h(Glyph, { name: 'case-library' }), title: url, sub: c.title ?? c.id, desc: t('log.added'),
            aside: [h(P.Button, { key: 'a', variant: 'ghost', size: 'sm', onClick: () => send(t('ask.member', { url, id: c.id })) }, t('log.sendCapture')),
              h(ReasonButton, { key: 's', t, label: t('log.skip'), placeholder: t('log.skipWhy'), run: (r) => act(() => call('praxis_skip_member', { source: c.id, url, reason: r, expected_revision: c.revision })) })] })),
          ...(c.gone ?? []).map((m) => h(Entry, { key: `${c.id}-${m.id}`, glyph: h(Glyph, { name: 'case-library' }), title: m.title ?? m.id, sub: c.title ?? c.id, desc: t('log.gone'),
            aside: h(ReasonButton, { t, label: t('log.retire'), placeholder: t('log.retireWhy'), run: (r) => act(() => call('praxis_retire', { source: m.id, reason: r, expected_revision: m.revision })) }) }))]),
        ...up.revisions.map((x) => h(Entry, { key: x.unit, glyph: h(Glyph, { name: 'article' }), title: x.unit, desc: t('unit.conflict'), onOpen: () => go({ tab: 'kit', unit: x.unit }),
          aside: h(P.Button, { variant: 'ghost', size: 'sm', onClick: () => act(() => call('praxis_unit_revert', { unit: x.unit, expected_revision: x.revision })) }, t('unit.revert')) })),
        ...up.artifacts.map((a) => h(Entry, { key: a.id, glyph: h(Glyph, { name: 'article' }), title: a.title, sub: a.path, onOpen: () => go({ tab: 'artifacts', artifact: a.id }), aside: a.signals.map((g) => h(Wait, { key: g }, t(`as.${g}`))) })),
      ].filter(Boolean)
      const line = (at, main, sub) => h('li', null, h('time', null, day(at)), h('div', null, h('p', null, main), sub ? h('p', { className: 'pxs-caption' }, sub) : null))
      return h(React.Fragment, null,
        h('h1', { className: 'pxs-place-title', tabIndex: -1 }, t('tab.log')),
        problem ? h('p', { className: 'pxs-problem', role: 'alert' }, problem) : null,
        h(Block, { label: t('log.attention'), aside: items.length ? h(Wait, null, items.length) : null }, items.length ? h('div', { className: 'pxs-list' }, items) : h('p', { className: 'pxs-none' }, t('log.none'))),
        h(Block, { label: t('log.runs'), aside: h('span', { className: 'pxs-caption' }, String(runs.length)) }, runs.length ? h('ol', { className: 'pxs-versions' }, runs.slice(0, 40).map((r) =>
          h('li', { key: r.id }, h('time', null, day(r.at)), h('div', null,
            h('p', null, r.title),
            h('p', { className: 'pxs-links' }, h('span', { className: 'pxs-caption' }, t('log.runCounts', { u: r.units.length, s: r.sources.length })),
              r.artifacts.filter((x) => x.artifact).map((x) => h('button', { key: x.artifact, type: 'button', className: 'pxs-link', onClick: () => go({ tab: 'artifacts', artifact: x.artifact }) }, `${x.path.split('/').pop()} v${x.version}`))))))) : h('p', { className: 'pxs-none' }, t('log.noRuns'))),
        h(Block, { label: t('log.history'), aside: h('span', { className: 'pxs-caption' }, String(history.length)) }, history.length ? h('ol', { className: 'pxs-versions' }, history.map((x, i) =>
          h(React.Fragment, { key: i }, line(x.at, h(React.Fragment, null, h('code', null, x.op), ' ', x.id ?? ''), [x.by, x.reason].filter(Boolean).join(' · '))))) : h('p', { className: 'pxs-none' }, t('log.noHistory'))))
    }

    // An action that needs a written reason: the button opens a one-line field in place.
    function ReasonButton({ t, label, placeholder, run }) {
      const [open, setOpen] = React.useState(false)
      const [text, setText] = React.useState('')
      if (!open) return h(P.Button, { variant: 'ghost', size: 'sm', onClick: () => setOpen(true) }, label)
      return h('form', { className: 'pxs-reason', onSubmit: (e) => { e.preventDefault(); if (text.trim()) { run(text.trim()); setOpen(false) } } },
        h(P.Input, { value: text, autoFocus: true, placeholder, 'aria-label': placeholder, onChange: (e) => setText(e.target.value), onKeyDown: (e) => { if (e.key === 'Escape') setOpen(false) } }),
        h(P.Button, { variant: 'primary', size: 'sm', type: 'submit', disabled: !text.trim() }, label))
    }

    // ---- Shop: All lays the catalog out as shelves; Manage is the review queue -----------------
    // The places are the sidebar's: All, the New and Recently used shelves, Manage, and the views a
    // person saved. A saved view is a name for a filter: what it shops for, a tag, search words and
    // how the shelves are grouped. Filters stay as they were while a source is open or another section
    // is in front; picking a place in the sidebar sets them to that place's.
    function ShopView({ t, go, up, nav, kit, catalog, catalogError, reloadCatalog, onReviewed, openSource, last, pick, sources, scroller, active, stamp, views, reloadViews }) {
      const mode = nav.mode === 'manage' ? 'manage' : 'browse'
      const shelf = nav.shelf
      const saved = nav.view ? views.find((v) => v.id === nav.view) : null
      const [filter, setFilter] = React.useState('open')
      const [query, setQuery] = React.useState('')
      const [searching, setSearching] = React.useState(false)
      const [view, setView] = React.useState(() => recall('praxis.shop.layout', 'list'))
      const [tag, setTag] = React.useState(null)
      const [group, setGroup] = React.useState('area')
      const [openAreas, setOpenAreas] = React.useState(() => new Set())
      const [problem, setProblem] = React.useState(null)
      // A tag picked on a source page arrives with the place it sends you to; a saved view brings its
      // filter; any other place picked in the sidebar starts clear.
      const applied = React.useRef(null)
      React.useEffect(() => {
        if (nav.tag) { setTag(nav.tag); setQuery(''); setSearching(false); return }
        if (nav.view && !saved) return
        const mark = `${nav.view ?? ''}|${nav.at ?? ''}`
        if (applied.current === mark || (!nav.view && !nav.at)) return
        applied.current = mark
        const f = saved?.filter ?? {}
        setNeed(f.need ?? ''); setTag(f.tag ?? null); setQuery(f.query ?? ''); setSearching(!!f.query); setGroup(f.group ?? 'area'); setProblem(null)
      }, [nav.tag, nav.at, nav.view, saved])

      const rows = catalog?.rows ?? null
      const byId = React.useMemo(() => new Map((rows ?? []).map((r) => [r.id, r])), [rows])
      const switchView = (v) => { setView(v); remember('praxis.shop.layout', v) }
      const keep = (r) => (filter === 'open' ? !reviewed(r) : filter === 'needs-work' ? reviewed(r) && r.review.verdict === 'needs-work' : filter === 'reviewed' ? reviewed(r)
        : filter === 'link-only' ? !r.stock : filter === 'restock' ? !!r.stock?.restock : true)

      // Shopping for a need: a task type or a stream lays out what praxis_resolve hands that task, in
      // its order, catalogued or not; a Kit page lays out the sources on it. '' shops for anything.
      const [need, setNeed] = React.useState('')
      const [wanted, setWanted] = React.useState(null)
      const neededAt = React.useRef(0)
      React.useEffect(() => {
        if (!need || need.startsWith('page:')) return
        const n = ++neededAt.current
        const id = need.slice(need.indexOf(':') + 1)
        call('praxis_resolve', need.startsWith('type:') ? { task_type: id } : { stream: id }).then((r) => r.materials, () => [])
          .then((list) => { if (n === neededAt.current) setWanted({ need, list }) })
      }, [need, stamp])
      const needRows = !need ? null : need.startsWith('page:') ? (rows ?? []).filter((r) => r.pages?.includes(need.slice(5)))
        : wanted?.need === need ? wanted.list.map((m) => byId.get(m.source) ?? { id: m.source, title: m.title, url: m.url, form: m.form, description: m.description, evidence_status: m.evidence_status, tags: [], areas: [], pages: m.pages }) : null
      const units = kit?.units ?? []
      const types = units.filter((u) => u.id.startsWith('task/types/'))
      const streams = units.filter((u) => u.id.startsWith('stream/'))
      const pageIds = [...new Set((rows ?? []).flatMap((r) => r.pages ?? []))].sort()

      // What runs read lately, latest first, for the Recently used row.
      const [used, setUsed] = React.useState([])
      const loadUsed = React.useCallback(() => call('praxis_runs', { limit: 40 }).then((runs) => {
        const ids = []
        for (const r of [...runs].sort((a, b) => String(b.at).localeCompare(String(a.at)))) for (const x of r.sources ?? []) if (!ids.includes(x.id)) ids.push(x.id)
        setUsed(ids)
      }, () => {}), [])
      React.useEffect(() => { loadUsed() }, [loadUsed, stamp])
      useReturn(active, loadUsed)

      const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
      const said = terms.join(' ')
      // Core matches more than the row shows: notes written on bindings and the excerpts. Its answer
      // comes a moment after the instant match below and only adds to it, with the passages that hold
      // a searched word; an answer to an older query is ignored.
      const [found, setFound] = React.useState({ q: '', hits: new Map() })
      React.useEffect(() => {
        if (!said) return
        const timer = setTimeout(() => call('praxis_catalog', { query: said }).then((r) => {
          const hits = new Map()
          for (const area of r.areas) for (const group of area.forms) for (const x of group.sources ?? []) hits.set(x.id, x.matched)
          setFound({ q: said, hits })
        }, () => {}), 150)
        return () => clearTimeout(timer)
      }, [said])
      const hits = found.q === said ? found.hits : null
      const filtering = terms.length > 0 || !!tag
      const shopping = mode === 'browse' && !shelf && !!need
      // A changed filter shows its result from the top.
      const asked = `${mode}|${shelf}|${nav.view}|${need}|${filter}|${tag}|${said}|${group}`
      const before = React.useRef(asked)
      React.useEffect(() => { if (before.current !== asked && active) scroller?.current?.scrollTo({ top: 0 }); before.current = asked }, [asked])
      const match = (r) => (!tag || r.tags?.includes(tag)) && (terms.every((x) => [r.title, r.description, r.url, r.id, ...(r.tags ?? [])].join(' ').toLowerCase().includes(x)) || !!hits?.has(r.id))
      // The two shelves, each in the order it names: newest collected, latest read by a run.
      const fresh = rows ? rows.filter((r) => r.captured_at).sort((a, b) => String(b.captured_at).localeCompare(String(a.captured_at))) : []
      const recent = used.map((x) => byId.get(x)).filter(Boolean)
      const pool = shelf ? (rows && (shelf === 'new' ? fresh : recent)) : shopping ? needRows : rows
      const shown = (pool ?? []).filter((r) => (mode === 'browse' || keep(r)) && match(r)).map((r) => (hits?.get(r.id) ? { ...r, matched: hits.get(r.id) } : r))
      // How All is laid out: by Kit area as shelves (the default), by form, or as one list.
      const shelved = mode === 'browse' && !shopping && !shelf
      const layers = shelved && group === 'area' && catalog ? shelves(catalog.outline, catalog.forms, shown) : []
      const byForm = shelved && group === 'form' && catalog ? catalog.forms.map((f) => ({ form: f, rows: shown.filter((r) => r.form === f) })).filter((x) => x.rows.length) : []
      const full = (g) => filtering || openAreas.has(g.area)
      // Before the shelves, while nothing narrows them: the newest arrivals and what runs read lately.
      const strips = shelved && group === 'area' && !filtering && !nav.view && rows ? [
        { area: 'new', title: t('shop.new'), basis: t('shop.newBasis'), own: fresh },
        { area: 'used', title: t('shop.used'), basis: t('shop.usedBasis'), own: recent },
      ].filter((x) => x.own.length) : []
      // What ← → step through: the sources in the order they are drawn, or the row a source was opened from.
      const order = () => [...new Set((layers.length ? layers.flatMap((l) => l.groups.flatMap((g) => onShelf(g, full(g)))) : byForm.length ? byForm.flatMap((f) => f.rows) : shown).map((r) => r.id))]
      const open = (r, list) => openSource(r.id, { list: list ?? order(), seed: r })
      const pickTag = (x) => setTag((cur) => (cur === x ? null : x))
      const clearAll = () => { setQuery(''); setTag(null); setSearching(false); setNeed(''); setGroup('area') }
      // The filter as a saved view keeps it; a view names it once, and is changed or removed from its own place.
      const current = Object.fromEntries([['need', need], ['tag', tag ?? ''], ['query', said], ['group', group === 'area' ? '' : group]].filter(([, v]) => v))
      const same = (a = {}, b = {}) => ['need', 'tag', 'query', 'group'].every((k) => (a[k] ?? '') === (b[k] ?? ''))
      const keepView = async (title) => {
        setProblem(null)
        try { const v = await call('praxis_view_save', { title, filter: current }); await reloadViews(); go({ tab: 'shop', view: v.id }) } catch (e) { setProblem(String(e.message ?? e)) }
      }
      const changeView = async (fields) => {
        setProblem(null)
        try { await call('praxis_view_save', { id: saved.id, expected_revision: saved.revision, ...fields }); await reloadViews() } catch (e) { setProblem(e.status === 409 ? t('review.conflict') : String(e.message ?? e)) }
      }
      const dropView = async () => {
        setProblem(null)
        try { await call('praxis_view_remove', { id: saved.id, expected_revision: saved.revision }); await reloadViews(); up({ tab: 'shop' }) } catch (e) { setProblem(String(e.message ?? e)) }
      }
      const entry = (r, list) => (view === 'grid'
        ? h(SourceCard, { key: r.id, row: r, t, pick, sources, onTag: pickTag, tag, last: r.id === last, onOpen: () => open(r, list) })
        : h(SourceRow, { key: r.id, row: r, t, pick, sources, last: r.id === last, onOpen: () => open(r, list), onReviewed, onConflict: () => open(r, list) }))

      let body
      if (catalogError && !rows) body = h(Empty, { title: t('review.failedTitle'), hint: catalogError, action: h(P.Button, { variant: 'outline', size: 'sm', onClick: reloadCatalog }, t('review.retry')) })
      else if (!rows || (shopping && !needRows)) body = h('div', { className: 'pxs-list', 'aria-busy': true }, [0, 1, 2, 3, 4].map((i) => h('div', { key: i, className: 'pxs-skel' }, h('i'), h('i'))))
      else if (!shown.length) body = filtering || shopping ? h(Empty, { title: t('review.noMatch'), hint: t('review.noMatchHint'), action: h(P.Button, { variant: 'outline', size: 'sm', onClick: clearAll }, t('review.clearAll')) })
        : mode === 'browse' ? h(Empty, { title: t('review.empty.all'), hint: t('review.empty.allHint') }) : h(Empty, { title: t(`review.empty.${filter}`) })
      else if (byForm.length) body = h('div', { className: 'pxs-outline' }, byForm.map((f) => h('section', { key: f.form, className: 'pxs-form-group' },
        h('h4', null, h(Glyph, { name: f.form, size: 14 }), t(`form.${f.form}`), h('span', { className: 'pxs-caption' }, String(f.rows.length))),
        h('div', { className: view === 'grid' ? 'pxs-grid' : 'pxs-list' }, f.rows.map((r) => entry(r))))))
      else if (!layers.length) body = h('div', { className: view === 'grid' ? 'pxs-grid' : 'pxs-list' }, shown.map((r) => entry(r)))
      else body = h(React.Fragment, null, strips.length ? h(Strips, { strips, t, view, entry, openAreas, setOpenAreas }) : null, h(Outline, { layers, t, view, entry, filtering, full, setOpenAreas }))

      // What the filters leave, said once beside them: a status message, read out when it changes.
      const status = !rows ? '' : filtering ? t('review.matches', { n: shown.length })
        : shopping ? (needRows ? t(need.startsWith('page:') ? 'shop.forPage' : 'shop.forTask', { n: shown.length }) : '')
          : shelf ? t(shelf === 'new' ? 'shop.newBasis' : 'shop.usedBasis') : mode === 'browse' ? t('tab.browseHint', { n: rows.length }) : ''
      const title = saved ? saved.title : shelf ? t(`shop.${shelf}`) : mode === 'manage' ? t('tab.manage') : t('tab.shop')
      const narrowed = Object.keys(current).length > 0
      return h(React.Fragment, null,
        h('header', { className: 'pxs-place' },
          h('h1', { className: 'pxs-place-title', tabIndex: -1 }, title),
          h('div', { className: 'pxs-buttons' },
            saved ? h(React.Fragment, null,
              !same(saved.filter, current) ? h(P.Button, { variant: 'outline', size: 'sm', onClick: () => changeView({ filter: current }) }, t('shop.viewUpdate')) : null,
              h(ReasonButton, { t, label: t('shop.viewRename'), placeholder: t('shop.viewName'), run: (name) => changeView({ title: name }) }),
              h(P.Button, { variant: 'ghost', size: 'sm', onClick: dropView }, t('shop.viewRemove')))
              : mode === 'browse' && !shelf && narrowed ? h(ReasonButton, { t, label: t('shop.viewSave'), placeholder: t('shop.viewName'), run: keepView }) : null)),
        problem ? h('p', { className: 'pxs-problem', role: 'alert' }, problem) : null,
        h('div', { className: 'pxs-bar' },
          h('div', { className: 'pxs-modes' },
          mode === 'browse' && !shelf && kit ? h('label', { className: 'pxs-select pxs-for' }, h('span', { className: 'pxs-caption' }, t('shop.for')),
            h('select', { value: need, onChange: (e) => setNeed(e.target.value) },
              h('option', { value: '' }, t('shop.forAny')),
              types.length ? h('optgroup', { label: t('shop.forTypes') }, types.map((u) => h('option', { key: u.id, value: `type:${u.id}` }, u.title))) : null,
              streams.length ? h('optgroup', { label: t('shop.forStreams') }, streams.map((u) => h('option', { key: u.id, value: `stream:${u.id}` }, u.title))) : null,
              pageIds.length ? h('optgroup', { label: t('shop.forPages') }, pageIds.map((id) => h('option', { key: id, value: `page:${id}` }, kit.byId.get(id)?.title ?? id))) : null)) : null,
          shelved ? h('label', { className: 'pxs-select pxs-for' }, h('span', { className: 'pxs-caption' }, t('shop.group')),
            h('select', { value: group, onChange: (e) => setGroup(e.target.value) }, ['area', 'form', 'none'].map((g) => h('option', { key: g, value: g }, t(`shop.group.${g}`))))) : null,
          mode === 'manage' ? h('div', { className: 'pxs-pills', role: 'group', 'aria-label': t('review.filter') },
            ['open', 'needs-work', 'reviewed', 'link-only', 'restock', 'all'].map((v) => h(P.Pill, { key: v, active: filter === v, 'aria-pressed': filter === v, onClick: () => setFilter(v) }, t(`review.f.${v}`)))) : null,
          tag ? h('button', { type: 'button', className: 'pxs-tag-on', 'aria-label': `${t('review.clearTag')}: ${tag}`, onClick: () => setTag(null) }, '#', tag, h(Glyph, { name: 'close', size: 12 })) : null,
          h('span', { className: 'pxs-caption', role: 'status' }, status)),
          h('div', { className: 'pxs-icons' },
            searching ? h(P.Input, { className: 'pxs-search', type: 'search', role: 'searchbox', value: query, autoFocus: true, placeholder: t('review.search'), 'aria-label': t('review.search'),
              icon: h(P.IconSearchOutlineRegular, { size: 14 }), onChange: (e) => setQuery(e.target.value),
              onKeyDown: (e) => { if (e.key === 'Escape') { e.preventDefault(); setQuery(''); setSearching(false) } },
              onBlur: () => { if (!query) setSearching(false) } })
              : h(P.Button, { variant: 'ghost', size: 'sm', 'aria-label': t('review.search'), title: t('review.search'), icon: h(P.IconSearchOutlineRegular, { size: 16 }), onClick: () => setSearching(true) }),
            h('div', { className: 'pxs-views', role: 'group', 'aria-label': t('review.view') },
              ['list', 'grid'].map((v) => h('button', { key: v, type: 'button', className: 'pxs-view', 'aria-pressed': view === v, 'aria-label': t(`review.view.${v}`), title: t(`review.view.${v}`), onClick: () => switchView(v) }, h(Glyph, { name: v })))))),
        body)
    }

    // Two rows before the shelves, each in an order it names: newest collected, latest read by a run.
    // Each shows a few and opens in full like an area's shelf; ← → walk the row as drawn.
    function Strips({ strips, t, view, entry, openAreas, setOpenAreas }) {
      return h('section', { className: 'pxs-layer pxs-strips' }, strips.map((x) => {
        const all = openAreas.has(x.area)
        const rows = all ? x.own : x.own.slice(0, SHELF)
        const toggle = (e) => {
          const head = e.currentTarget.closest('.pxs-area')
          setOpenAreas((cur) => { const next = new Set(cur); all ? next.delete(x.area) : next.add(x.area); return next })
          if (all) requestAnimationFrame(() => head?.scrollIntoView({ block: 'nearest' }))
        }
        return h('section', { key: x.area, className: 'pxs-area' },
          h('header', { className: 'pxs-area-head' },
            h('div', { className: 'pxs-area-text' }, h('h3', { className: 'pxs-area-title' }, x.title), h('p', { className: 'pxs-area-desc' }, x.basis)),
            x.own.length > SHELF ? h('button', { type: 'button', className: 'pxs-shelf-more', 'aria-expanded': all, onClick: toggle }, all ? t('shelf.less') : t('shelf.all', { n: x.own.length })) : null),
          h('div', { className: view === 'grid' ? 'pxs-grid' : 'pxs-list' }, rows.map((r) => entry(r, rows.map((y) => y.id)))))
      }))
    }

    /** Requests from the last day: running ones shimmer, finished ones name what was captured. */
    /**
     * What the cart hands on: each source with its link, when it applies and its Praxis ID, so an agent
     * with the Praxis MCP can look it up and record it, and any other agent can still follow the links.
     */
    const cartText = (items) => [
      'Use these sources from Praxis for this work. Each says when it applies; open the original at its link before relying on it. With the Praxis MCP, praxis_source <id> gives the read scope and where the excerpts are, and praxis_consume should list the ids you used, each with what you used it for.',
      ...items.map((x, i) => `${i + 1}. ${x.title} — ${x.url}${x.description ? ` — When: ${x.description}` : ''} (praxis: ${x.id})`),
    ].join('\n')
    /** The IDs alone, for an agent that has the Praxis MCP and looks each one up itself. */
    const idsText = (items) => ['Praxis source IDs. With the Praxis MCP, praxis_source <id> gives each one; praxis_consume should list the ones you used.', ...items.map((x) => x.id)].join('\n')
    const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches

    function Cart({ t, items, setItems, openSource, addToChat }) {
      const [copied, setCopied] = React.useState(null)
      const box = React.useRef(null)
      const copy = (what) => navigator.clipboard.writeText(what === 'ids' ? idsText(items) : cartText(items)).then(() => setCopied({ what, ok: true }), () => setCopied({ what, ok: false }))
      React.useEffect(() => { if (!copied) return; const id = setTimeout(() => setCopied(null), 1800); return () => clearTimeout(id) }, [copied])
      const said = (what, label) => (copied?.what === what ? t(copied.ok ? 'cart.copied' : 'cart.copyFailed') : label)
      // Checking out into a chat hands the sources over and folds the cart away.
      const checkout = () => {
        addToChat(cartText(items))
        const el = box.current
        if (!el || calm()) return setItems([])
        el.style.overflow = 'hidden'
        el.animate([{ height: `${el.offsetHeight}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 220, easing: 'cubic-bezier(.4,0,1,1)' }).finished.finally(() => setItems([]))
      }
      return h('section', { className: 'pxs-cart', 'aria-label': t('cart.label'), ref: box },
        h('header', null,
          h(Glyph, { name: 'cart' }), h('b', null, t('cart.count', { n: items.length })),
          h('button', { type: 'button', className: 'pxs-link', onClick: () => setItems([]) }, t('cart.clear'))),
        h('ul', null, items.map((x) => h('li', { key: x.id },
          h('button', { type: 'button', className: 'pxs-cart-item', 'data-key': `source:${x.id}`, title: x.description, onClick: () => openSource(x.id, { list: items.map((y) => y.id), seed: x }) }, x.title),
          h('button', { type: 'button', className: 'pxs-cart-x', 'aria-label': `${t('cart.remove')}: ${x.title}`, onClick: () => setItems((c) => c.filter((y) => y.id !== x.id)) }, h(Glyph, { name: 'close', size: 12 }))))),
        h('footer', null,
          h(P.Button, { variant: 'ghost', size: 'sm', icon: h(Glyph, { name: 'copy', size: 14 }), onClick: () => copy('text') }, said('text', t('cart.copy'))),
          h(P.Button, { variant: 'ghost', size: 'sm', onClick: () => copy('ids') }, said('ids', t('cart.copyIds'))),
          addToChat ? h(P.Button, { size: 'sm', icon: h(Glyph, { name: 'chat', size: 14 }), onClick: checkout }, t('cart.chat')) : null))
    }

    /**
     * Requests in flight, one line each; finished ones fold into a single line that shows the latest
     * outcome, with the earlier ones behind "N more". Dismiss puts away everything finished so far.
     */
    function AskStrip({ asks, t, openSession, openSource }) {
      const [seen, setSeen] = React.useState(() => Number(recall('praxis.asks.seen', 0)))
      const [open, setOpen] = React.useState(false)
      const running = asks.filter((a) => a.status === 'running')
      const finished = asks.filter((a) => a.status !== 'running' && Date.parse(a.done_at ?? a.at) > Math.max(seen, Date.now() - 864e5))
      if (!running.length && !finished.length) return null
      const dismiss = () => { const now = Date.now(); remember('praxis.asks.seen', String(now)); setSeen(now); setOpen(false) }
      const outcome = (a) => a.status === 'done' && a.kind === 'distill' ? (a.distilled?.length ? [t('ask.distilled'), ' ', h('button', { key: 's', type: 'button', className: 'pxs-link', onClick: () => openSource(a.source, { list: [a.source], seed: { title: a.text } }) }, a.text)] : t('ask.distillNone'))
        : a.status === 'done' ? (a.captured.length ? [t('ask.done', { n: a.captured.length }), ...a.captured.slice(0, 3).map((x) => h(React.Fragment, { key: x.id }, ' ',
          h('button', { type: 'button', className: 'pxs-link', onClick: () => openSource(x.id, { list: a.captured.map((y) => y.id), seed: x }) }, x.title)))] : t('ask.doneNone'))
          : t(`ask.${a.status}`)
      const line = (a, tail) => h('li', { key: a.id, 'data-status': a.status },
        a.status === 'running' ? h('span', { className: 'pxs-spin', 'aria-hidden': true }) : h(a.status === 'done' ? P.IconCheckOutlineRegular : P.IconWarningOutlineRegular, { size: 14 }),
        h('span', { className: 'pxs-ask-text' }, a.status === 'running' ? h(P.TextShimmer, { active: true }, a.kind === 'distill' ? t('ask.distilling', { title: a.text }) : t('ask.running')) : outcome(a)),
        h('button', { type: 'button', className: 'pxs-link', onClick: () => openSession(a.session) }, t('ask.session')), tail)
      const [latest, ...earlier] = finished
      return h('ul', { className: 'pxs-asks', 'aria-live': 'polite' },
        running.map((a) => line(a)),
        latest ? line(latest, [
          earlier.length ? h('button', { key: 'more', type: 'button', className: 'pxs-link', 'aria-expanded': open, onClick: () => setOpen(!open) }, open ? t('ask.fewer') : t('ask.more', { n: earlier.length })) : null,
          h('button', { key: 'x', type: 'button', className: 'pxs-ask-x', 'aria-label': t('ask.dismiss'), onClick: dismiss }, h(Glyph, { name: 'close', size: 12 }))]) : null,
        open ? earlier.map((a) => line(a)) : null)
    }

    /** affectUI Chat Composer, plain: grows to six lines, Enter sends, Shift+Enter breaks a line. */
    function Composer({ t, available, onSend, children }) {
      const [text, setText] = React.useState('')
      const [busy, setBusy] = React.useState(false)
      const [problem, setProblem] = React.useState(null)
      const ref = React.useRef(null)
      // Fit the text; measure again when the width changes, since a page opened hidden measures at zero width.
      const fit = React.useCallback(() => {
        const el = ref.current
        if (!el) return
        el.style.height = 'auto'
        el.style.height = `${Math.min(el.scrollHeight, 6 * 22 + 4)}px`
      }, [])
      React.useLayoutEffect(fit, [text, fit])
      React.useEffect(() => {
        if (!ref.current || typeof ResizeObserver === 'undefined') return
        let width = 0
        const watch = new ResizeObserver(([e]) => { if (e.contentRect.width !== width) { width = e.contentRect.width; fit() } })
        watch.observe(ref.current)
        return () => watch.disconnect()
      }, [fit])
      const submit = async () => {
        if (!text.trim() || busy || !available) return
        setBusy(true); setProblem(null)
        try { await onSend(text.trim()); setText('') } catch (e) { setProblem(String(e.message ?? e)) } finally { setBusy(false) }
      }
      return h('div', { className: 'pxs-dock' },
        children,
        problem ? h('p', { className: 'pxs-problem', role: 'alert' }, problem) : null,
        h('form', { className: 'pxs-composer', 'data-disabled': !available || undefined, onSubmit: (e) => { e.preventDefault(); submit() } },
          h('textarea', { ref, rows: 1, value: text, disabled: !available, 'aria-label': t('ask.label'),
            placeholder: available ? t('ask.placeholder') : t('ask.unavailable'),
            onChange: (e) => setText(e.target.value),
            onKeyDown: (e) => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submit() } } }),
          h('button', { type: 'submit', className: 'pxs-send', disabled: !available || busy || !text.trim(), 'aria-label': t('ask.send'), title: t('ask.send') },
            busy ? h('span', { className: 'pxs-spin', 'aria-hidden': true }) : h(Glyph, { name: 'up' }))))
    }

    // The catalog's own structure, laid out as shelves: Kit layer, then each area with its newest few
    // sources in view and the rest one click away, shown in full by form. A search or a tag shows every
    // match in full. Nothing is folded shut: the first view is already sources.
    const SHELF = 3
    function shelves(areas, forms, rows) {
      const layers = []
      for (const a of areas) {
        const own = rows.filter((r) => r.areas.some((x) => x.area === a.area))
        if (!own.length) continue
        const g = { ...a, own, byForm: forms.map((f) => ({ form: f, rows: own.filter((r) => r.form === f) })).filter((x) => x.rows.length) }
        const layer = a.area.split('/')[0] || ''
        ;(layers.find((l) => l.layer === layer) ?? (layers.push({ layer, groups: [] }), layers.at(-1))).groups.push(g)
      }
      return layers
    }
    /** What one area shows, in the order it is drawn: in full by form, or its newest few. */
    const onShelf = (g, full) => (full ? g.byForm.flatMap((f) => f.rows) : g.own.slice(0, SHELF))

    function Outline({ layers, t, view, entry, filtering, full, setOpenAreas }) {
      const items = (rows) => h('div', { className: view === 'grid' ? 'pxs-grid' : 'pxs-list' }, rows.map(entry))
      return h('div', { className: 'pxs-outline' }, layers.map((l) => h('section', { key: l.layer || '-', className: 'pxs-layer' },
        h('h2', { className: 'pxs-layer-title' }, l.layer ? t(`layer.${l.layer}`) : t('review.noArea')),
        l.groups.map((g) => {
          const all = full(g)
          const toggle = (e) => {
            const head = e.currentTarget.closest('.pxs-area')
            setOpenAreas((cur) => { const next = new Set(cur); all ? next.delete(g.area) : next.add(g.area); return next })
            // Folding a long shelf back keeps its heading where the eye is, instead of leaving you far below it.
            if (all) requestAnimationFrame(() => head?.scrollIntoView({ block: 'nearest' }))
          }
          return h('section', { key: g.area || '-', className: 'pxs-area' },
            h('header', { className: 'pxs-area-head' },
              h('div', { className: 'pxs-area-text' },
                h('h3', { className: 'pxs-area-title' }, g.title || g.area || t('review.noArea')),
                g.description ? h('p', { className: 'pxs-area-desc', dir: 'auto' }, g.description) : null),
              !filtering && g.own.length > SHELF ? h('button', { type: 'button', className: 'pxs-shelf-more', 'aria-expanded': all, onClick: toggle }, all ? t('shelf.less') : t('shelf.all', { n: g.own.length })) : null),
            all ? g.byForm.map((f) => h('div', { key: f.form, className: 'pxs-form-group' },
              h('h4', null, h(Glyph, { name: f.form, size: 14 }), t(`form.${f.form}`), h('span', { className: 'pxs-caption' }, String(f.rows.length))),
              items(f.rows)))
              : items(onShelf(g, false)))
        }))))
    }

    // The accent marks only what waits on a person; a settled verdict is plain.
    function StateTag({ row, t }) {
      if (!reviewed(row)) return null
      return row.review.verdict === 'needs-work' ? h('span', { className: 'pxs-wait' }, t('v.needs-work')) : h(P.Tag, { tone: 'neutral' }, t(`v.${row.review.verdict}`))
    }
    // How far the original was read, in three steps: the detail draws it as a meter and says it in words.
    const readOf = (status) => (status === 'verified' ? 'verified' : status === 'unavailable' ? 'unavailable' : 'partial')
    // Partly read is where most sources stand, so lists name only the exceptions; the detail shows all three.
    const ReadWord = ({ row, t }) => { const at = readOf(row.evidence_status); return at === 'partial' ? null : h('span', { className: 'pxs-ev', 'data-level': at }, t(`ev.${at}`)) }

    function RowMenu({ row, t, onReviewed, onConflict }) {
      const [open, setOpen] = React.useState(false)
      const busy = React.useRef(false)
      const verdict = async (v) => {
        setOpen(false)
        if (busy.current) return
        busy.current = true
        let s
        try { s = await call('praxis_review', { source: row.id, verdict: v, revision: row.entry_revision }) } catch { return onConflict?.() } finally { busy.current = false }
        onReviewed({ id: row.id, entry_revision: s.entry_revision, review: s.review })
      }
      return h(P.Menu, { open, onClose: () => setOpen(false), align: 'end', portal: true,
        anchor: h(P.Button, { variant: 'ghost', size: 'sm', 'aria-label': t('review.more'), 'aria-haspopup': 'menu', 'aria-expanded': open, icon: h(P.IconEllipsisOutlineRegular, { size: 16 }),
          onClick: (e) => { e.stopPropagation(); setOpen(!open) } }) },
        h(P.MenuItemButton, { icon: h(Glyph, { name: 'out', size: 14 }), onSelect: () => { setOpen(false); window.open(row.url, '_blank', 'noreferrer') } }, t('review.openOriginal')),
        h(P.MenuItemButton, { icon: h(P.IconCheckOutlineRegular, { size: 14 }), separatorBefore: true, onSelect: () => verdict('accurate') }, t('review.markAccurate')),
        h(P.MenuItemButton, { icon: h(P.IconWarningOutlineRegular, { size: 14 }), onSelect: () => verdict('needs-work') }, t('review.markNeedsWork')))
    }

    // Add to cart: the one action a person takes on a source besides reading it.
    // Adding to the cart sends a small likeness of the item from the button to the cart, so the eye
    // follows where it went; with reduced motion the cart's count changing says it.
    function flyToCart(from) {
      if (!from || calm()) return
      const start = from.getBoundingClientRect()
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const count = document.querySelector('.pxs-cart header b')
        if (!count) return
        const end = count.getBoundingClientRect()
        const dot = document.createElement('span')
        dot.className = 'pxs-fly'
        dot.style.left = `${start.left + start.width / 2 - 6}px`
        dot.style.top = `${start.top + start.height / 2 - 6}px`
        document.body.append(dot)
        const dx = end.left - (start.left + start.width / 2)
        const dy = end.top + end.height / 2 - (start.top + start.height / 2)
        dot.animate([{ transform: 'translate(0, 0) scale(1)', opacity: 1 }, { transform: `translate(${dx}px, ${dy}px) scale(.6)`, opacity: .5 }], { duration: 420, easing: 'cubic-bezier(.3,.7,.2,1)' })
          .finished.finally(() => { dot.remove(); count.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: 220, easing: 'ease-out' }) })
      }))
    }
    function CartButton({ row, t, pick, label }) {
      const on = pick.inCart(row.id)
      const name = t(on ? 'cart.remove' : 'cart.add')
      return h('button', { type: 'button', className: label ? 'pxs-cart-add' : 'pxs-cart-btn', 'aria-pressed': on, 'aria-label': name, title: name,
        onClick: (e) => { e.stopPropagation(); pick.toggleCart(row); if (!on) flyToCart(e.currentTarget) } }, h(Glyph, { name: on ? 'cartIn' : 'cartAdd' }), label ? h('span', null, t(on ? 'cart.in' : 'cart.add')) : null)
    }

    function SourceRow({ row, t, pick, sources, last, onOpen, onReviewed, onConflict }) {
      return h('div', { className: 'pxs-row', 'data-key': `source:${row.id}`, 'data-last': last || undefined },
        h('button', { type: 'button', className: 'pxs-row-main', onClick: onOpen, ...intentOn(sources, row.id) },
          h('span', { className: 'pxs-tile', title: row.form ? t(`form.${row.form}`) : undefined }, h(Glyph, { name: row.form ?? 'article' })),
          h('span', { className: 'pxs-row-text' },
            h('span', { className: 'pxs-row-title', dir: 'auto' }, row.title, h('span', { className: 'pxs-host' }, hostOf(row.url))),
            h('span', { className: 'pxs-row-desc', dir: 'auto', title: row.description }, row.description),
            row.matched ? h('span', { className: 'pxs-row-found', dir: 'auto', title: row.matched[0].claim }, h('q', null, row.matched[0].claim), row.matched[0].locator ? h('small', null, row.matched[0].locator) : null) : null)),
        h('span', { className: 'pxs-row-side' }, h(StateTag, { row, t }), h(StockTag, { row, t }), h(ReadWord, { row, t }), h('time', { dateTime: row.captured_at }, day(row.captured_at)), h(CartButton, { row, t, pick }), row.form ? h(RowMenu, { row, t, onReviewed, onConflict }) : null))
    }

    const Tags = ({ tags, active, onTag, max = 3 }) => (tags?.length ? h('span', { className: 'pxs-tags' },
      tags.slice(0, max).map((x) => h('button', { key: x, type: 'button', className: 'pxs-tagchip', 'aria-pressed': active === x, onClick: (e) => { e.stopPropagation(); onTag?.(x) } }, '#', x))) : null)

    // A card reads like an item on a shelf: a look inside (the first excerpt, with where it is in the
    // original), then its name, kind and site, and when to open it. Tags, state, date and the cart sit
    // at the foot, weaker than what the card is about.
    function SourceCard({ row, t, pick, sources, last, onOpen, onTag, tag }) {
      return h('div', { className: 'pxs-card', 'data-key': `source:${row.id}`, 'data-picked': pick.inCart(row.id) || undefined, 'data-last': last || undefined },
        h('button', { type: 'button', className: 'pxs-card-main', onClick: onOpen, ...intentOn(sources, row.id) },
          row.stock?.cover && !row.matched ? h('img', { className: 'pxs-card-cover', src: stockUrl(row.id, row.stock.cover.version, row.stock.cover.file), alt: '', loading: 'lazy' })
            : (row.matched?.[0] ?? row.preview) ? (({ claim, locator }) => h('span', { className: 'pxs-card-look', dir: 'auto' }, h('q', null, claim), h('small', null, locator)))(row.matched?.[0] ?? row.preview) : null,
          h('span', { className: 'pxs-card-title', dir: 'auto' }, row.title),
          h('span', { className: 'pxs-card-meta' }, h(Glyph, { name: row.form, size: 12 }), h('span', null, [t(`form.${row.form}`), hostOf(row.url)].filter(Boolean).join(' · '))),
          h('span', { className: 'pxs-card-desc', dir: 'auto' }, row.description)),
        h('div', { className: 'pxs-card-foot' },
          h(Tags, { tags: row.tags, active: tag, onTag }),
          h('span', { className: 'pxs-card-facts' }, h(StateTag, { row, t }), h(StockTag, { row, t }), h(ReadWord, { row, t }), h('time', { dateTime: row.captured_at }, day(row.captured_at))),
          h(CartButton, { row, t, pick })))
    }

    // An empty list says why it is empty and what to do next: a short title, a hint when the next
    // step is not obvious, at most one action.
    const Empty = ({ title, hint, action }) => h('div', { className: 'pxs-empty' }, h('p', { className: 'pxs-empty-title' }, title), hint ? h('p', null, hint) : null, action ? h('div', { className: 'pxs-empty-action' }, action) : null)

    // Full-page detail, one fixed schema for every source so the eye learns where things are. It reads
    // in the order a decision needs: what it is and when to open it; what the original holds, how far
    // it was read, its limits and why it was collected; then the question on the description, beside
    // the evidence it rests on. Where it is used and who read it follow as paths onward. A block with
    // nothing to show keeps its place and says so.
    const DEPTH = ['unavailable', 'partial', 'verified']
    function DepthMeter({ level, t }) {
      const at = DEPTH.indexOf(readOf(level))
      return h('div', { className: 'pxs-meter', role: 'img', 'aria-label': t(`ev.${DEPTH[at]}`) },
        h('div', { className: 'pxs-meter-bar' }, DEPTH.map((d, i) => h('span', { key: d, 'data-on': i <= at || undefined, 'data-level': DEPTH[at] }))),
        h('span', { className: 'pxs-meter-label' }, t(`ev.${DEPTH[at]}`)))
    }
    function Block({ label, aside, children }) {
      return h('section', { className: 'pxs-block' }, h('header', null, h('h2', null, label), aside ?? null), children)
    }
    const None = ({ children }) => h('p', { className: 'pxs-none' }, children)

    // ---- Stock: local versions of a source's original ------------------------------------------
    const stockUrl = (id, version, file) => `/api/praxis.file?source=${encodeURIComponent(id)}&version=${encodeURIComponent(version)}&file=${encodeURIComponent(file)}`
    const size = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : n >= 1024 ? `${Math.round(n / 1024)} KB` : `${n} B`)
    const moment = (iso) => (iso ? new Intl.DateTimeFormat(document.documentElement.lang || undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso)) : '')
    /** A kept page as readable text: the words of its main content, block ends as line breaks; nothing in it runs. */
    function readable(html) {
      const doc = new DOMParser().parseFromString(html.replace(/<\/(p|div|h[1-6]|li|tr|section|article|header|footer|blockquote|pre|dd|dt)>|<br\s*\/?>/gi, '$&\n'), 'text/html')
      const main = doc.querySelector('main, [role="main"], article') ?? doc.body
      main?.querySelectorAll('script, style, noscript, template, svg, nav, aside, form, button, [hidden], [aria-hidden="true"]').forEach((n) => n.remove())
      return (main?.textContent ?? '').split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n')
    }
    // The shelves say a source is in stock only when it is; a link alone is the usual state.
    const StockTag = ({ row, t }) => (row.stock ? h('span', { className: 'pxs-stock', title: moment(row.stock.at) }, t('stock.in')) : null)

    // A look inside one version without leaving Praxis: the cover and words of a page, a repository's
    // README, a distill, or a PDF, image or video as the browser shows it.
    function QuickLook({ t, id, v, url }) {
      const [m, setM] = React.useState(null)
      const [text, setText] = React.useState(null)
      React.useEffect(() => { fetch(stockUrl(id, v.version, 'manifest.json')).then((r) => r.json()).then(setM, () => setM({ files: [] })) }, [id, v.version])
      const files = m?.files ?? []
      const main = v.kind === 'distill' ? 'distill.md' : (files.find((f) => f.path === 'index.html') ?? files.find((f) => /^readme/i.test(f.path)) ?? files.find((f) => !f.path.startsWith('assets/') && f.path !== m?.cover && !/\.tar\.gz$/.test(f.path)))?.path
      const ext = main ? main.split('.').pop().toLowerCase() : ''
      const textual = /^(html?|md|markdown|rst|txt|json|csv)$/.test(ext)
      React.useEffect(() => {
        if (!main || !textual) return
        fetch(stockUrl(id, v.version, main)).then((r) => r.text()).then((x) => setText(/^html?$/.test(ext) ? readable(x) : x), () => setText(''))
      }, [main])
      const src = main && stockUrl(id, v.version, main)
      return h('div', { className: 'pxs-look' },
        h('p', { className: 'pxs-caption' }, t('stock.lookFrom', { at: moment(v.at) }), url ? [' · ', h('a', { key: 'o', href: url, target: '_blank', rel: 'noreferrer', className: 'pxs-link' }, t('review.openOriginal'))] : null),
        !m ? h('div', { className: 'pxs-skel' }, h('i'), h('i')) : h(React.Fragment, null,
          m.cover ? h('img', { className: 'pxs-look-cover', src: stockUrl(id, v.version, m.cover), alt: '' }) : null,
          ext === 'pdf' ? h('iframe', { className: 'pxs-look-frame', src, title: main }) : null,
          /^(png|jpe?g|gif|webp)$/.test(ext) && main !== m.cover ? h('img', { className: 'pxs-look-cover', src, alt: '' }) : null,
          /^(mp4|webm)$/.test(ext) ? h('video', { className: 'pxs-look-cover', controls: true, preload: 'metadata', src }) : null,
          /^(mp3|ogg)$/.test(ext) ? h('audio', { controls: true, preload: 'metadata', src }) : null,
          textual ? (text === null ? h('div', { className: 'pxs-skel' }, h('i'), h('i')) : h('pre', { className: 'pxs-look-text', dir: 'auto' }, text.slice(0, 8000))) : null))
    }

    // Stock on a source page: the versions, newest first, what changed between them, and the button
    // that gets a copy (or a newer one). Getting a copy says it is under way, never how far.
    function StockBlock({ t, id, row, stock, onChanged, distill, distilling }) {
      const [busy, setBusy] = React.useState(false)
      const [problem, setProblem] = React.useState(null)
      const [said, setSaid] = React.useState(null)
      const [look, setLook] = React.useState(null)
      const versions = stock?.versions ?? []
      const has = versions.some((v) => v.kind === 'download')
      const download = async () => {
        setBusy(true); setProblem(null); setSaid(null)
        try {
          const r = await call('praxis_stock', { source: id, action: 'download' })
          if (r.unchanged) setSaid(t('stock.unchanged', { at: moment(r.latest.at) }))
          await onChanged()
        } catch (e) { setProblem(String(e.message ?? e)) } finally { setBusy(false) }
      }
      const facts = (v) => [t(`stock.kind.${v.kind}`), size(v.bytes), v.files > 1 ? t('stock.files', { n: v.files }) : null,
        ...['added', 'removed', 'changed'].map((k) => (v.changes?.[k]?.length ? t(`stock.${k}`, { n: v.changes[k].length }) : null)),
        v.missing ? t('stock.missing', { n: v.missing }) : null].filter(Boolean).join(' · ')
      return h(Block, { label: t('stock.label'), aside: versions.length ? h('span', { className: 'pxs-caption' }, String(versions.length)) : null },
        versions.length ? h('ol', { className: 'pxs-versions pxs-stock-list' }, [...versions].reverse().map((v) => h('li', { key: v.version },
          h('time', { dateTime: v.at }, moment(v.at)),
          h('div', null,
            h('p', null, facts(v), ' ', h('button', { type: 'button', className: 'pxs-link', 'aria-expanded': look === v.version, onClick: () => setLook(look === v.version ? null : v.version) }, t('stock.look'))),
            look === v.version ? h(QuickLook, { t, id, v, url: row.url }) : null))))
          : h(None, null, t('stock.linkOnly')),
        stock?.restock ? h('p', { className: 'pxs-fact' }, t('stock.restock')) : null,
        said ? h('p', { className: 'pxs-fact', role: 'status' }, said) : null,
        problem ? h('p', { className: 'pxs-problem', role: 'alert' }, problem) : null,
        row.url?.startsWith('http') ? h('div', { className: 'pxs-buttons' },
          busy ? h('span', { className: 'pxs-busy', role: 'status' }, h('span', { className: 'pxs-spin', 'aria-hidden': true }), t('stock.getting'))
            : h(P.Button, { variant: stock?.restock ? 'primary' : 'outline', size: 'sm', onClick: download }, t(has ? 'stock.update' : 'stock.download')),
          distilling ? h('span', { className: 'pxs-busy', role: 'status' }, h('span', { className: 'pxs-spin', 'aria-hidden': true }), t('stock.distilling'))
            : distill ? h(P.Button, { variant: 'ghost', size: 'sm', onClick: () => distill(id).catch((e) => setProblem(String(e.message ?? e))) }, t('stock.distill')) : null) : null)
    }

    function SourceDetail({ id, quiet, seed, t, go, kit, openSession, pick, sources, steps, onStep, trail, onTag, onReviewed, send, openSource, shelf, stamp, distill, distilling }) {
      // Drawn from the record already fetched when there is one, else from the row it was opened from.
      const [d, setD] = React.useState(() => sources.peek(id) ?? null)
      const [problem, setProblem] = React.useState(null)
      const [asking, setAsking] = React.useState(false)
      const [note, setNote] = React.useState('')
      const [done, setDone] = React.useState(null)
      const [busy, setBusy] = React.useState(false)
      const head = React.useRef(null)
      const verdictBar = React.useRef(null)
      // Focus never drops to the page: a closed note hands it back to Needs work, a recorded verdict to Next source.
      const asked = React.useRef(false)
      React.useEffect(() => {
        if (asking) { asked.current = true; return }
        if (!asked.current) return
        asked.current = false
        if (!done) verdictBar.current?.querySelector('button:last-of-type')?.focus({ preventScroll: true })
      }, [asking, done])
      React.useEffect(() => { if (done) (verdictBar.current?.querySelector('button') ?? head.current)?.focus({ preventScroll: true }) }, [done])
      React.useEffect(() => {
        let live = true
        // Drawn at once from a kept record, then from a fresh one, which may know a newer check or stock.
        ;(sources.peek(id) ? sources.fresh(id) : sources.get(id)).then((x) => { if (live) setD(x) }, (e) => { if (live) setProblem(String(e.message ?? e)) })
        return () => { live = false }
      }, [id, sources])
      // When an agent settles (a capture or a distill), the record may have changed under the page.
      const settled = React.useRef(stamp)
      React.useEffect(() => { if (settled.current === stamp) return; settled.current = stamp; sources.fresh(id).then(setD, () => {}) }, [stamp])
      // The neighbours load now, so ← → draw at once.
      React.useEffect(() => { for (const x of [steps.prev, steps.next]) if (x) sources.get(x).catch(() => {}) }, [steps.prev, steps.next, sources])
      const row = { id, title: id, form: 'article', ...seed, ...d }
      // The title takes focus on arrival, so a screen reader names the new page and ← → keep stepping.
      React.useEffect(() => { head.current?.focus({ preventScroll: true }) }, [])
      const stepKey = (e) => {
        if (e.altKey || e.metaKey || e.ctrlKey || e.shiftKey || e.target.closest?.('input, textarea, select, [contenteditable="true"]')) return
        const to = e.key === 'ArrowLeft' ? steps.prev : e.key === 'ArrowRight' ? steps.next : null
        if (to) { e.preventDefault(); onStep(to) }
      }

      async function verdict(v) {
        setBusy(true); setProblem(null)
        try {
          // The verdict is about the description on screen; if it changed meanwhile, show the new one first.
          const seen = row.entry_revision
          let s
          try { s = await call('praxis_review', { source: id, verdict: v, note: note.trim() || undefined, revision: seen }) } catch (e) {
            if (e.status !== 409) throw e
            sources.forget(id)
            setD(await sources.get(id)); setProblem(t('review.changed')); return
          }
          onReviewed({ id, entry_revision: s.entry_revision, review: s.review })
          const next = { ...row, entry_revision: s.entry_revision, review: s.review, description: s.description ?? row.description }
          sources.put(id, next)
          setD(next)
          // A description marked needs work goes to an agent, the only one who rewrites records.
          if (v === 'needs-work') await send(t('ask.revise', { id, title: row.title, note: note.trim() || t('ask.noNote') }))
          setDone(v); setAsking(false)
        } catch (e) { setProblem(String(e.message ?? e)) } finally { setBusy(false) }
      }

      const check = d?.check
      const excerpts = d?.excerpts ?? []
      const pages = d?.relations ?? []
      const runs = d?.used_by ?? []
      const link = (href, text, cls = 'pxs-loc') => h('a', { href, target: '_blank', rel: 'noreferrer', className: cls }, text)
      const pageTitle = (b) => (b.unit && kit?.byId.get(b.unit)?.title) || b.unit || b.target
      // Its neighbours: other catalogued sources on the pages it is on, those sharing more pages first.
      const mine = new Set(pages.map((b) => b.unit).filter(Boolean))
      const neighbours = mine.size && shelf ? shelf.filter((r) => r.id !== id && r.pages?.some((p) => mine.has(p)))
        .map((r) => ({ r, n: r.pages.filter((p) => mine.has(p)).length })).sort((a, b) => b.n - a.n || a.r.title.localeCompare(b.r.title)).slice(0, 6).map((x) => x.r) : []
      const stepButton = (to, glyph, label) => h('button', { type: 'button', className: 'pxs-step', disabled: !to, 'aria-label': label, title: to ? `${label} (${glyph === 'back' ? '←' : '→'})` : undefined, onClick: () => onStep(to) }, h(Glyph, { name: glyph, size: 14 }))
      // Its Kit area: its own category, else the areas of the pages it is attached to.
      const areas = row.category ? [row.category] : [...new Set((d?.relations ?? []).map((b) => b.unit?.split('/').slice(0, 2).join('/')).filter(Boolean))]
      const area = areas.map((a) => kit?.byId.get(a)?.title ?? a).join(' · ')
      return h('article', { className: 'pxs-detail', 'data-quiet': quiet || undefined, onKeyDown: stepKey },
        h('div', { className: 'pxs-detail-bar' },
          h(Crumbs, { trail }),
          steps.prev || steps.next ? h('div', { className: 'pxs-steps' }, stepButton(steps.prev, 'back', t('review.prev')), stepButton(steps.next, 'forward', t('review.next'))) : null),
        h('header', { className: 'pxs-detail-head' },
          h('span', { className: 'pxs-tile lg' }, h(Glyph, { name: row.form, size: 20 })),
          h('div', { className: 'pxs-detail-title' },
            h('h1', { dir: 'auto', tabIndex: -1, ref: head }, row.title),
            h('p', { className: 'pxs-caption' }, [t(`form.${row.form}`), hostOf(row.url), area].filter(Boolean).join(' · '))),
          h('div', { className: 'pxs-detail-actions' }, h(CartButton, { row, t, pick, label: true }),
            row.url ? h('a', { className: 'pxs-open', href: row.url, target: '_blank', rel: 'noreferrer' }, t('review.openOriginal'), h(Glyph, { name: 'out', size: 14 })) : null)),
        // An original that stopped answering changes how everything below can be used: say it first.
        check && check.status !== 'ok' ? h('p', { className: 'pxs-notice', role: 'note' }, h(P.IconWarningOutlineRegular, { size: 14 }),
          h('span', null, d?.stock ? t('d.unreachableStock', { at: day(check.at), v: moment(d.stock.at) }) : t('d.unreachable', { at: day(check.at) }))) : null,
        h('p', { className: 'pxs-when', dir: 'auto' }, row.description),
        h(Tags, { tags: row.tags, onTag, max: 12 }),
        problem ? h('p', { className: 'pxs-problem', role: 'alert' }, problem) : null,
        !d ? h('div', { className: 'pxs-skel' }, h('i'), h('i'), h('i')) : h(React.Fragment, null,
          h(Block, { label: t('review.excerpts'), aside: excerpts.length ? h('span', { className: 'pxs-caption' }, String(excerpts.length)) : null },
            excerpts.length ? h('ol', { className: 'pxs-rail' }, excerpts.map((x, i) => h('li', { key: i },
              h('span', { className: 'pxs-rail-dot', 'aria-hidden': true }, i + 1),
              h('div', null, x.locator ? (/^https?:\/\//.test(x.locator) ? link(x.locator, x.locator) : h('span', { className: 'pxs-loc' }, x.locator)) : null, h('p', { dir: 'auto' }, x.claim)))))
              : h(None, null, t('d.noExcerpts'))),
          h(Block, { label: t('d.read'), aside: h(DepthMeter, { level: d.evidence_status, t }) },
            d.read_scope ? h('p', { dir: 'auto' }, d.read_scope) : h(None, null, '—'),
            check?.status === 'ok' || !check ? h('p', { className: 'pxs-fact' }, check ? t('d.checked', { at: day(check.at), http: check.http }) : t('d.noCheck')) : null,
            d.summary ? h('details', { className: 'pxs-summary' }, h('summary', null, t('review.summary')), h('p', { dir: 'auto' }, d.summary)) : null),
          h('div', { className: 'pxs-pair' },
            h(Block, { label: t('review.limits') }, d.limits?.filter(Boolean).length ? h('p', { dir: 'auto' }, d.limits.filter(Boolean).join('；')) : h(None, null, '—')),
            h(Block, { label: t('d.revisit') }, d.revisit_when ? h('p', { dir: 'auto' }, d.revisit_when) : h(None, null, '—'))),
          h('footer', { className: 'pxs-verdict', ref: verdictBar },
            done ? h(React.Fragment, null,
              h('p', { className: 'pxs-done', role: 'status' }, h(P.IconCheckOutlineRegular, { size: 14 }), ' ', t(done === 'needs-work' ? 'review.sentToAgent' : 'review.recorded', { v: t(`v.${done}`) })),
              steps.next ? h(P.Button, { variant: 'ghost', size: 'sm', onClick: () => onStep(steps.next) }, t('review.next')) : null)
              : asking ? h('div', { className: 'pxs-ask-note' },
                h(DraftBox, { value: note, onChange: setNote, label: t('review.note'), hint: t('review.noteHint'), onSave: () => verdict('needs-work'), onCancel: () => setAsking(false) }),
                h('div', { className: 'pxs-buttons' },
                  h(P.Button, { variant: 'primary', size: 'sm', disabled: busy, onClick: () => verdict('needs-work') }, t('review.sendNeedsWork')),
                  h(P.Button, { variant: 'ghost', size: 'sm', disabled: busy, onClick: () => setAsking(false) }, t('review.cancel'))))
                : h(React.Fragment, null,
                  h('span', { className: 'pxs-verdict-q' }, t('review.question'), row.review ? h('span', { className: 'pxs-caption' }, ' ', t('review.last', { v: t(`v.${row.review.verdict}`), by: row.review.by ?? '—', at: (row.review.at ?? '').slice(0, 10) })) : null),
                  h('div', { className: 'pxs-buttons' },
                    h(P.Button, { variant: 'primary', size: 'sm', disabled: busy, icon: h(P.IconCheckOutlineRegular, { size: 13 }), onClick: () => verdict('accurate') }, t('v.accurate')),
                    h(P.Button, { variant: 'outline', size: 'sm', disabled: busy, onClick: () => setAsking(true) }, t('v.needs-work'))))),
          // Paths onward: each page this source is attached to, with what that page takes from it.
          h(Block, { label: t('review.pages') },
            pages.length ? h('ul', { className: 'pxs-paths' }, pages.map((b) => h('li', { key: b.binding },
              h('button', { type: 'button', className: 'pxs-path', 'data-off': !b.enabled || undefined, onClick: () => go(b.unit ? { tab: 'kit', unit: b.unit } : { tab: 'kit', target: b.target.split('#')[0] }) },
                h('span', { className: 'pxs-path-text' },
                  h('span', { className: 'pxs-path-title', dir: 'auto' }, pageTitle(b)),
                  b.description ? h('span', { className: 'pxs-path-desc', dir: 'auto' }, b.description) : null),
                h(Glyph, { name: 'forward', size: 14 })))))
              : h(None, null, t('d.noPages')),
            d.serves?.length ? h('p', { className: 'pxs-serves' }, h('span', { className: 'pxs-caption' }, t('d.serves')), d.serves.map((x) => h(P.Tag, { key: x.id, tone: 'neutral' }, x.title))) : null),
          neighbours.length ? h(Block, { label: t('d.neighbours') },
            h('ul', { className: 'pxs-paths' }, neighbours.map((r) => h('li', { key: r.id },
              h('button', { type: 'button', className: 'pxs-path', 'data-key': `source:${r.id}`, ...intentOn(sources, r.id), onClick: () => openSource(r.id, { list: neighbours.map((x) => x.id), seed: r }) },
                h(Glyph, { name: r.form ?? 'article', size: 14 }),
                h('span', { className: 'pxs-path-text' },
                  h('span', { className: 'pxs-path-title', dir: 'auto' }, r.title),
                  h('span', { className: 'pxs-path-desc', dir: 'auto' }, [t(`form.${r.form}`), hostOf(r.url)].filter(Boolean).join(' · '))),
                h(Glyph, { name: 'forward', size: 14 })))))) : null,
          // Activity is the roster's record of this source, apart from the entry above: what it was
          // collected for and which runs read it. The entry reads the same in any project; this does not.
          h(Block, { label: t('d.activity') },
            h('ol', { className: 'pxs-timeline' },
              d.captured_for || d.collection ? h('li', { key: 'in' }, h('time', null, day(d.captured_for?.at)),
                h('span', { dir: 'auto' }, d.captured_for ? t('d.collected', { task: d.captured_for.task ?? '—' }) : [t('d.fromPack', { pack: d.collection.title ?? '—' }), d.collection.purpose ? ` — ${d.collection.purpose}` : ''].join(''),
                  d.captured_for?.by ? h('span', { className: 'pxs-caption' }, ' · ', d.captured_for.by) : null,
                  d.captured_for?.session?.id ? [' · ', h('button', { key: 's', type: 'button', className: 'pxs-link', onClick: () => openSession(d.captured_for.session.id) }, t('ask.session'))] : null)) : null,
              runs.slice(0, 6).map((r, i) => h('li', { key: i }, h('time', null, day(r.at)), h('span', { dir: 'auto' }, t('d.readFor', { title: r.title }), r.use ? h('span', { className: 'pxs-caption' }, ' — ', r.use) : null,
                r.artifacts.map((a) => h(React.Fragment, { key: a.artifact }, ' · ', h('button', { type: 'button', className: 'pxs-link', onClick: () => go({ tab: 'artifacts', artifact: a.artifact }) }, `${a.path.split('/').pop()} v${a.version}`))))))),
            runs.length ? null : h(None, null, t('d.noRuns'))),
          h(StockBlock, { t, id, row, stock: d.stock, distill, distilling, onChanged: async () => {
            sources.forget(id)
            const next = await sources.get(id)
            setD(next)
            onReviewed({ id, stock: next.stock ? (({ versions, ...latest }) => latest)(next.stock) : undefined })
          } })))
    }

    // affectUI Text Area: grows with the text, a count that warns near the limit, ⌘/Ctrl+Enter saves, Escape cancels.
    function DraftBox({ value, onChange, onSave, onCancel, label, hint, max = 240 }) {
      const ref = React.useRef(null)
      React.useLayoutEffect(() => {
        const el = ref.current
        if (!el) return
        el.style.height = 'auto'
        el.style.height = `${Math.min(el.scrollHeight + 2, 240)}px`
      }, [value])
      React.useEffect(() => { ref.current?.focus() }, [])
      const left = max - value.length
      return h('div', { className: 'pxs-draft' },
        h('textarea', { ref, value, maxLength: max, rows: 2, 'aria-label': label, placeholder: label,
          onChange: (e) => onChange(e.target.value),
          onKeyDown: (e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); onSave() }
            if (e.key === 'Escape') { e.preventDefault(); onCancel() }
          } }),
        h('div', { className: 'pxs-draft-foot' },
          h('span', { className: 'pxs-caption' }, hint),
          h('span', { className: 'pxs-count', 'data-near': left <= 20 || undefined }, `${value.length}/${max}`)))
    }

    const PAGE_CSS = `
.pxs-page{position:relative;width:100%;height:100%;min-height:0;display:flex;container-type:inline-size;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);font-size:14px;line-height:1.6}
.pxs-main{position:relative;flex:1;min-width:0;min-height:0;display:flex;flex-direction:column}
.pxs-scroll{flex:1;min-height:0;overflow:auto;scrollbar-gutter:stable}
.pxs-side{flex:none;width:232px;box-sizing:border-box;overflow:auto;padding:20px 12px;border-right:.5px solid var(--dsw-alias-border-l3);background:var(--dsw-alias-bg-layer-1)}
.pxs-side-head{display:flex;align-items:center;gap:8px;height:32px;margin:0 0 14px;padding:0 10px;font-size:15px;font-weight:600;letter-spacing:-.01em}
.pxs-side-head svg{color:var(--dsw-alias-label-secondary)}
.pxs-side-list,.pxs-side-sub{list-style:none;margin:0;padding:0;display:grid;gap:2px}
.pxs-side-sub{margin:2px 0 6px 17px;padding-left:8px;border-left:.5px solid var(--dsw-alias-border-l3);animation:pxs-in .18s cubic-bezier(.22,1,.36,1)}
.pxs-side-item{display:flex;align-items:center;gap:10px;width:100%;min-height:34px;padding:0 10px;border:0;border-radius:10px;background:none;color:var(--dsw-alias-label-secondary);font:inherit;font-size:14px;text-align:left;cursor:pointer;transition:background .14s ease,color .14s ease}
.pxs-side-item svg{flex:none;color:var(--dsw-alias-label-tertiary)}
@media (hover:hover){.pxs-side-item:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}}
.pxs-side-item[data-here]{color:var(--dsw-alias-label-primary)}
.pxs-side-item[aria-current=page]{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font-weight:500}
.pxs-side-item[aria-current=page] svg{color:var(--dsw-alias-state-business-primary)}
.pxs-side-item:focus-visible{outline:2px solid var(--dsw-focus-ring-color);outline-offset:-2px}
.pxs-side-label{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pxs-side-n{color:var(--dsw-alias-label-tertiary);font-size:12px;font-variant-numeric:tabular-nums}
.pxs-side-group{margin:10px 0 2px;padding:0 10px;color:var(--dsw-alias-label-tertiary);font-size:12px}
.pxs-outline-edit{margin:4px 0 0}.pxs-outline-edit .pxs-preset{margin-top:8px}
.pxs-place{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 16px;min-height:32px}
.pxs-place-title{margin:0;font-size:22px;line-height:30px;font-weight:600;letter-spacing:-.01em;outline:0}
.pxs-pane>.pxs-place-title{margin-bottom:8px}
@container (width<720px){.pxs-side{width:60px;padding:16px 8px}.pxs-side-head span,.pxs-side-label,.pxs-side-n,.pxs-side-sub{display:none}.pxs-side-head,.pxs-side-item{justify-content:center;padding:0}.pxs-side-item .pxs-badge{position:absolute;transform:translate(10px,-10px)}.pxs-side-item{position:relative}}
.pxs-content{max-width:880px;margin:0 auto;padding:0 clamp(20px,4vw,48px) 140px;min-height:100%;box-sizing:border-box}
.pxs-wait{display:inline-flex;align-items:center;height:20px;padding:0 8px;border-radius:999px;background:var(--dsw-alias-state-business-tertiary);color:var(--dsw-alias-state-business-primary);font-size:12px;font-weight:500}
.pxs-ev{font-size:12px;color:var(--dsw-alias-label-tertiary);white-space:nowrap}
.pxs-content{padding-top:36px}
[data-platform=darwin] .pxs-content{padding-top:calc(36px + var(--dsh-frame-top-clearance,0px))}
[data-platform=darwin] .pxs-side{padding-top:calc(20px + var(--dsh-frame-top-clearance,0px))}
.pxs-wordmark{display:flex;align-items:center;gap:10px;margin:0;font-size:22px;line-height:30px;font-weight:600;letter-spacing:-.01em}
.pxs-wordmark svg{flex:none;color:var(--dsw-alias-label-secondary)}
.pxs-tabs{display:flex;flex-wrap:wrap;gap:4px 22px;margin:22px 0 8px;border-bottom:.5px solid var(--dsw-alias-border-l3)}
.pxs-tab{position:relative;display:inline-flex;align-items:center;gap:6px;padding:8px 0 10px;border:0;background:none;color:var(--dsw-alias-label-tertiary);font:inherit;font-size:14px;cursor:pointer;transition:color .16s ease}
@media (hover:hover){.pxs-tab:hover{color:var(--dsw-alias-label-primary)}}
.pxs-tab[aria-current=page]{color:var(--dsw-alias-label-primary)}
.pxs-tab[aria-current=page]::after{content:"";position:absolute;left:0;right:0;bottom:-.5px;height:2px;border-radius:1px;background:var(--dsw-alias-label-primary)}
.pxs-tab:focus-visible{outline:2px solid var(--dsw-focus-ring-color);outline-offset:2px;border-radius:4px}
.pxs-badge{min-width:16px;height:16px;padding:0 4px;border-radius:8px;background:var(--dsw-alias-state-business-primary);color:var(--dsw-static-neutral-bluish-00);font-size:10px;line-height:16px;font-weight:600;font-variant-numeric:tabular-nums;text-align:center}
.pxs-modes{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px}
.pxs-page-body{animation:pxs-in .2s cubic-bezier(.22,1,.36,1)}
.pxs-crumbs{display:flex;flex-wrap:wrap;align-items:center;gap:2px;margin:18px 0 14px;font-size:13px;color:var(--dsw-alias-label-tertiary)}
.pxs-crumbs button{padding:2px 6px;border:0;border-radius:6px;background:none;color:inherit;font:inherit;cursor:pointer}
@media (hover:hover){.pxs-crumbs button:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}}
.pxs-crumbs [aria-current]{padding:2px 6px;color:var(--dsw-alias-label-primary)}
.pxs-sep{color:var(--dsw-alias-border-l4)}
.pxs-count-chip{display:inline-flex;align-items:center;gap:4px;font:500 11.5px ui-monospace,'SF Mono',Menlo,monospace;color:var(--dsw-alias-label-tertiary)}
.pxs-row[data-mark=off] .pxs-row-title,.pxs-row[data-mark=off] .pxs-row-desc{color:var(--dsw-alias-label-tertiary)}
.pxs-row[data-mark=removed]{opacity:.55}
.pxs-row-main:disabled{cursor:default}
.pxs-star{display:grid;place-items:center;width:28px;height:28px;padding:0;border:0;border-radius:7px;background:none;color:var(--dsw-alias-label-tertiary);cursor:pointer}
.pxs-star[aria-pressed=true]{color:var(--dsw-alias-label-primary)}
.pxs-star[aria-pressed=true] path{fill:currentColor}
@media (hover:hover){.pxs-star:hover{background:var(--dsw-alias-interactive-bg-hover)}}
.pxs-bindings-bar{display:flex;justify-content:flex-end;margin:-30px 0 8px;font-size:12.5px}
.pxs-doc{margin:16px 0 0;padding:18px 22px;border-radius:12px;background:var(--dsw-alias-bg-layer-1);font-size:14px;max-height:560px;overflow:auto}
.pxs-task-picks{display:grid;gap:12px;margin:18px 0 6px}
.pxs-task-selects{display:flex;flex-wrap:wrap;align-items:flex-end;gap:12px 18px}
.pxs-select{display:flex;flex-direction:column;gap:4px}
.pxs-for{flex-direction:row;align-items:center;gap:8px}.pxs-for select{min-width:0;max-width:220px;height:28px}
.pxs-stock{font-size:11.5px;color:var(--dsw-alias-state-business-primary);white-space:nowrap}
.pxs-card-cover{display:block;width:100%;aspect-ratio:1.91/1;object-fit:cover;margin-bottom:8px;border-radius:10px;background:var(--dsw-alias-bg-layer-1)}
.pxs-look{margin:8px 0 4px;display:grid;gap:8px}.pxs-look-cover{display:block;max-width:100%;max-height:320px;border-radius:8px;border:.5px solid var(--dsw-alias-border-l2)}
.pxs-look-frame{width:100%;height:420px;border:.5px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-base)}
.pxs-look-text{margin:0;max-height:320px;overflow:auto;padding:10px 12px;border-radius:8px;background:var(--dsw-alias-bg-layer-1);font:inherit;font-size:12.5px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere;color:var(--dsw-alias-label-secondary)}
.pxs-busy{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--dsw-alias-label-secondary)}
.pxs-fly{position:fixed;z-index:2147483000;width:12px;height:12px;border-radius:50%;background:var(--dsw-alias-state-business-primary);box-shadow:var(--dsw-shadow-lv2);pointer-events:none}
.pxs-select select,.pxs-fields input,.pxs-fields select{min-width:180px;height:32px;padding:0 10px;border:.5px solid var(--dsw-alias-border-l3);border-radius:8px;background:var(--dsw-alias-bg-base);color:inherit;font:inherit;font-size:13px}
.pxs-select select:focus-visible,.pxs-fields input:focus-visible,.pxs-fields select:focus-visible{outline:2px solid var(--dsw-focus-ring-color);outline-offset:0}
.pxs-result{transition:opacity .15s ease}
.pxs-result[aria-busy]{opacity:.55}
.pxs-flow{display:flex;flex-wrap:wrap;margin:14px 0 4px;border-top:.5px solid var(--dsw-alias-border-l3);border-bottom:.5px solid var(--dsw-alias-border-l3)}
.pxs-flow span{flex:1 1 0;min-width:76px;display:flex;flex-direction:column;gap:2px;padding:10px 12px;font-size:12px;color:var(--dsw-alias-label-tertiary);text-transform:capitalize}
.pxs-flow span+span{border-left:.5px solid var(--dsw-alias-border-l2)}
.pxs-flow b{font-size:22px;line-height:28px;font-weight:600;color:var(--dsw-alias-label-primary)}
.pxs-flow span[data-zero] b{color:var(--dsw-alias-border-l4)}
.pxs-kv{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:4px 16px;margin:0;font-size:13px}
.pxs-kv dt{color:var(--dsw-alias-label-tertiary);font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:12px}
.pxs-kv dd{margin:0;overflow-wrap:anywhere}
.pxs-checks{margin:0;padding-left:20px;display:grid;gap:6px;font-size:13.5px;color:var(--dsw-alias-label-secondary)}
.pxs-preset{margin-top:12px;padding:16px;border-radius:12px;background:var(--dsw-alias-bg-layer-1);display:grid;gap:12px}
.pxs-preset h3{margin:0;font-size:14px;font-weight:500}
.pxs-fields{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px 16px}
.pxs-fields label{display:flex;flex-direction:column;gap:4px;font-size:12px;color:var(--dsw-alias-label-tertiary)}
.pxs-fields input,.pxs-fields select{min-width:0}
.pxs-inline{display:inline-flex;align-items:center;gap:8px;font-size:13px}
.pxs-unreg{margin:0 0 8px;font-size:12.5px}
.pxs-unreg summary{cursor:pointer;list-style:none}
.pxs-unreg ul{margin:6px 0 0;padding-left:18px;color:var(--dsw-alias-label-secondary)}
.pxs-versions{list-style:none;margin:0;padding:0;display:grid}
.pxs-versions li{display:grid;grid-template-columns:72px minmax(0,1fr);gap:12px;padding:8px 0;border-top:.5px solid var(--dsw-alias-border-l2)}
.pxs-versions li:first-child{border-top:0}
.pxs-versions time{color:var(--dsw-alias-label-tertiary);font-size:12.5px;font-variant-numeric:tabular-nums}
.pxs-versions p{margin:0;font-size:13.5px;overflow-wrap:anywhere}
.pxs-versions code{font-size:12px;color:var(--dsw-alias-label-secondary)}
.pxs-links{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 10px;margin-top:4px!important}
.pxs-reason{display:flex;align-items:center;gap:6px}
@media (width<=767px){.pxs-bindings-bar{margin:0 0 8px}.pxs-versions li{grid-template-columns:1fr}}
.pxs-outline{display:grid;grid-template-columns:minmax(0,1fr);gap:40px}
.pxs-layer,.pxs-area,.pxs-form-group{min-width:0}
.pxs-layer-title{margin:0;font-size:13px;line-height:20px;font-weight:600;color:var(--dsw-alias-label-tertiary)}
.pxs-area{margin-top:18px}
.pxs-area+.pxs-area{margin-top:30px}
.pxs-area-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:8px}
.pxs-area-text{min-width:0}
.pxs-area-title{margin:0;font-size:15px;line-height:22px;font-weight:600}
.pxs-area-desc{margin:2px 0 0;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:1.55}
.pxs-shelf-more{flex:none;padding:3px 8px;border:0;border-radius:8px;background:none;color:var(--dsw-alias-state-business-primary);font:inherit;font-size:13px;white-space:nowrap;cursor:pointer}
@media (hover:hover){.pxs-shelf-more:hover{background:var(--dsw-alias-interactive-bg-hover)}}
.pxs-form-group{padding:6px 0 4px}
.pxs-form-group h4{display:flex;align-items:center;gap:6px;margin:6px 8px;font-size:12px;font-weight:500;color:var(--dsw-alias-label-tertiary)}
.pxs-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px 16px;margin:24px 0 16px}
.pxs-pills{display:flex;flex-wrap:wrap;gap:6px}
.pxs-icons{display:flex;align-items:center;gap:6px}
.pxs-search{width:220px}
.pxs-views{display:flex;gap:2px}
.pxs-view{display:grid;place-items:center;width:30px;height:30px;padding:0;border:0;border-radius:8px;background:none;color:var(--dsw-alias-label-tertiary);cursor:pointer;transition:background-color .16s ease,color .16s ease,box-shadow .16s ease}
@media (hover:hover){.pxs-view:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}}
.pxs-view[aria-pressed=true]{color:var(--dsw-alias-state-business-primary);box-shadow:inset 0 0 0 1px var(--dsw-alias-state-business-primary)}
.pxs-view:focus-visible,.pxs-step:focus-visible,.pxs-shelf-more:focus-visible,.pxs-path:focus-visible,.pxs-tagchip:focus-visible,.pxs-row-main:focus-visible,.pxs-card-main:focus-visible,.pxs-cart-btn:focus-visible,.pxs-cart-add:focus-visible,.pxs-cart-item:focus-visible,.pxs-cart-x:focus-visible,.pxs-crumbs button:focus-visible,.pxs-link:focus-visible,.pxs-open:focus-visible,.pxs-send:focus-visible{outline:2px solid var(--dsw-focus-ring-color);outline-offset:2px}
.pxs-cart-btn{flex:none;display:inline-grid;place-items:center;width:28px;height:28px;padding:0;border:0;border-radius:8px;background:none;color:var(--dsw-alias-label-tertiary);cursor:pointer;opacity:0;transition:opacity .16s ease,background-color .16s ease,color .16s ease}
@media (hover:hover){.pxs-cart-btn:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}}
.pxs-cart-btn[aria-pressed=true]{opacity:1;color:var(--dsw-alias-state-business-primary)}
.pxs-cart-btn:focus-visible{opacity:1}
@media (hover:hover){.pxs-row:hover .pxs-cart-btn,.pxs-card:hover .pxs-cart-btn{opacity:1}}
@media (hover:none){.pxs-cart-btn{opacity:1}}
.pxs-detail-actions{display:flex;align-items:center;gap:8px;flex:none}
.pxs-cart-add{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;border:0;border-radius:999px;background:none;box-shadow:inset 0 0 0 .5px var(--dsw-alias-border-l4);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;cursor:pointer}
@media (hover:hover){.pxs-cart-add:hover{background:var(--dsw-alias-interactive-bg-hover)}}
.pxs-cart-add[aria-pressed=true]{color:var(--dsw-alias-state-business-primary);background:var(--dsw-alias-state-business-tertiary);box-shadow:none}
.pxs-cart{margin:0 auto 8px;padding:10px 12px;border-radius:16px;background:var(--dsw-alias-bg-base);box-shadow:inset 0 0 0 .5px var(--dsw-alias-border-l3),var(--dsw-shadow-lv2);display:grid;gap:8px}
.pxs-cart header{display:flex;align-items:center;gap:8px;min-width:0}
.pxs-cart header svg{flex:none;color:var(--dsw-alias-state-business-primary)}
.pxs-cart header b{font-weight:600;white-space:nowrap}
.pxs-cart header .pxs-caption{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pxs-cart ul{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px;max-height:64px;overflow:auto}
.pxs-cart li{display:inline-flex;align-items:center;max-width:100%;border-radius:999px;background:var(--dsw-alias-bg-layer-1);box-shadow:inset 0 0 0 .5px var(--dsw-alias-border-l2)}
.pxs-cart-item{max-width:240px;padding:3px 4px 3px 10px;border:0;background:none;color:var(--dsw-alias-label-primary);font:inherit;font-size:12.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}
.pxs-cart-x{display:inline-grid;place-items:center;width:22px;height:22px;margin-right:2px;padding:0;border:0;border-radius:50%;background:none;color:var(--dsw-alias-label-tertiary);cursor:pointer}
@media (hover:hover){.pxs-cart-x:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}}
.pxs-cart footer{display:flex;justify-content:flex-end;gap:6px}
.pxs-asks{list-style:none;margin:0 auto 8px;padding:0;display:grid;gap:4px}
.pxs-asks li{display:flex;align-items:center;gap:8px;min-height:32px;padding:4px 12px;border-radius:12px;background:var(--dsw-alias-bg-layer-1);box-shadow:inset 0 0 0 .5px var(--dsw-alias-border-l2);font-size:13px;color:var(--dsw-alias-label-secondary);animation:pxs-in .2s cubic-bezier(.22,1,.36,1)}
.pxs-asks li[data-status=done] svg{color:var(--dsw-alias-state-business-primary)}
.pxs-asks li[data-status=failed] svg,.pxs-asks li[data-status=stopped] svg{color:var(--dsw-alias-state-error-primary)}
.pxs-ask-x{display:grid;place-items:center;width:24px;height:24px;margin-right:-6px;padding:0;border:0;border-radius:8px;background:none;color:var(--dsw-alias-label-tertiary);cursor:pointer}.pxs-ask-x:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary)}
.pxs-ask-text{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pxs-link{flex:none;padding:0;border:0;background:none;color:var(--dsw-alias-state-business-primary);font:inherit;font-size:12.5px;cursor:pointer;border-radius:4px}
.pxs-spin{flex:none;width:14px;height:14px;border-radius:50%;border:1.6px solid color-mix(in srgb,currentColor 22%,transparent);border-top-color:currentColor;animation:pxs-rot .8s linear infinite}
.pxs-list{display:flex;flex-direction:column}
.pxs-row{display:flex;align-items:center;gap:8px;border-radius:12px;transition:background-color .16s ease}
@media (hover:hover){.pxs-row:hover{background:var(--dsw-alias-interactive-bg-hover)}}
.pxs-row-main{flex:1;min-width:0;display:flex;align-items:center;gap:12px;padding:10px 8px;border:0;border-radius:12px;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}
.pxs-tile{flex:none;display:grid;place-items:center;width:30px;height:30px;border-radius:8px;background:var(--dsw-alias-bg-layer-1);box-shadow:inset 0 0 0 .5px var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary)}
.pxs-tile.lg{width:44px;height:44px;border-radius:12px}
.pxs-row-text{flex:1;min-width:0;display:flex;flex-direction:column}
.pxs-row-title{font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pxs-host{margin-left:8px;color:var(--dsw-alias-label-tertiary);font-weight:400;font-size:12.5px}
.pxs-row-desc{color:var(--dsw-alias-label-secondary);font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pxs-row-found{color:var(--dsw-alias-label-tertiary);font-size:12.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pxs-row-found q{quotes:none}.pxs-row-found small{margin-left:8px;font-size:11px}
.pxs-row-side{flex:none;display:flex;align-items:center;gap:10px;padding-right:4px;color:var(--dsw-alias-label-tertiary);font-size:12.5px;font-variant-numeric:tabular-nums}
.pxs-row-side time{min-width:52px;text-align:right}
.pxs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px}
.pxs-card{position:relative;display:flex;flex-direction:column;min-height:148px;border-radius:16px;background:var(--dsw-alias-bg-base);box-shadow:inset 0 0 0 .5px var(--dsw-alias-border-l3),var(--dsw-shadow-lv1);overflow:hidden;transition:box-shadow .16s ease,transform .16s cubic-bezier(.22,1,.36,1)}
@media (hover:hover){.pxs-card:hover{transform:translateY(-1px);box-shadow:inset 0 0 0 .5px var(--dsw-alias-border-l4),var(--dsw-shadow-lv2)}}
.pxs-card-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;padding:14px 16px 8px;border:0;border-radius:inherit;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}
.pxs-card[data-picked]{box-shadow:inset 0 0 0 1px var(--dsw-alias-state-business-primary),var(--dsw-shadow-lv1)}
.pxs-card[data-last]:not([data-picked]){box-shadow:inset 0 0 0 1px var(--dsw-alias-border-l4),var(--dsw-shadow-lv1)}
.pxs-card-look{display:grid;gap:4px;margin-bottom:8px;padding:10px 12px;border-radius:10px;background:var(--dsw-alias-bg-layer-1)}
.pxs-card-look q{color:var(--dsw-alias-label-secondary);font-size:12.5px;line-height:1.55;quotes:none;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.pxs-card-look small{color:var(--dsw-alias-label-tertiary);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pxs-tags{display:flex;flex-wrap:wrap;gap:4px 6px}
.pxs-tagchip{padding:1px 8px;border:0;border-radius:999px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);font:inherit;font-size:11.5px;cursor:pointer}
@media (hover:hover){.pxs-tagchip:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}}
.pxs-tagchip[aria-pressed=true],.pxs-tag-on{background:var(--dsw-alias-state-business-tertiary);color:var(--dsw-alias-state-business-primary)}
.pxs-tag-on{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border:0;border-radius:999px;font:inherit;font-size:12px;cursor:pointer}
.pxs-detail .pxs-tags{margin:-4px 0 16px}
.pxs-card-title{font-size:15px;line-height:22px;font-weight:600;color:var(--dsw-alias-label-primary);overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.pxs-card-meta{display:flex;align-items:center;gap:5px;min-width:0;color:var(--dsw-alias-label-tertiary);font-size:12px}
.pxs-card-meta svg{flex:none}
.pxs-card-meta span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pxs-card-desc{margin-top:4px;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:1.55;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.pxs-card-foot{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;min-height:28px;padding:0 10px 10px 16px}
.pxs-card-foot .pxs-tags{min-width:0}
.pxs-card-facts{flex:none;display:inline-flex;align-items:center;gap:8px;margin-left:auto;color:var(--dsw-alias-label-tertiary);font-size:12px;font-variant-numeric:tabular-nums}
.pxs-row,.pxs-card{scroll-margin:16px 0 150px}
.pxs-row[data-last]{background:color-mix(in srgb,var(--dsw-alias-interactive-bg-hover) 70%,transparent)}
.pxs-caption{color:var(--dsw-alias-label-tertiary);font-size:12px}
.pxs-detail{animation:pxs-in .18s cubic-bezier(.22,1,.36,1)}
.pxs-detail[data-quiet]{animation:none}
.pxs-detail-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:28px;margin:18px 0 14px}
.pxs-detail-bar .pxs-crumbs{margin:0}
.pxs-steps{display:flex;gap:2px}
.pxs-step{display:grid;place-items:center;width:28px;height:28px;padding:0;border:0;border-radius:8px;background:none;color:var(--dsw-alias-label-secondary);cursor:pointer}
.pxs-step:disabled{color:var(--dsw-alias-border-l4);cursor:default}
@media (hover:hover){.pxs-step:not(:disabled):hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}}
.pxs-detail-title h1:focus{outline:none}
.pxs-notice{display:flex;align-items:flex-start;gap:8px;margin:18px 0 0;padding:10px 12px;border-radius:10px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font-size:13px}
.pxs-notice svg{flex:none;margin-top:3px;color:var(--dsw-alias-state-error-primary)}
.pxs-detail-head{display:flex;align-items:flex-start;gap:14px}
.pxs-detail-title{flex:1;min-width:0}
.pxs-detail-title h1{margin:0;font-size:20px;line-height:28px;font-weight:600;overflow-wrap:anywhere}
.pxs-open{flex:none;display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 14px;border-radius:16px;background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-base);font-size:13px;font-weight:500;text-decoration:none;transition:opacity .16s ease}
@media (hover:hover){.pxs-open:hover{opacity:.86}}
.pxs-when{margin:20px 0 8px;font-size:16px;line-height:1.65;color:var(--dsw-alias-label-primary)}
.pxs-loc{font:12px ui-monospace,'SF Mono',Menlo,monospace;color:var(--dsw-alias-label-tertiary)}
a.pxs-loc{color:var(--dsw-alias-state-business-primary)}
.pxs-meter{display:flex;align-items:center;gap:10px}
.pxs-meter-bar{display:flex;gap:3px}
.pxs-meter-bar span{width:22px;height:6px;border-radius:3px;background:var(--dsw-alias-border-l2);transition:background-color .3s ease}
.pxs-meter-bar span[data-on]{background:var(--dsw-alias-label-primary)}
.pxs-meter-bar span[data-on][data-level=unavailable]{background:var(--dsw-alias-label-tertiary)}
.pxs-meter-label{font-size:13px}
.pxs-block>header .pxs-meter{align-self:center}
.pxs-block .pxs-fact{margin-top:6px;color:var(--dsw-alias-label-tertiary);font-size:12px}
.pxs-block{margin-top:22px}
.pxs-block>header{display:flex;align-items:baseline;gap:8px;margin-bottom:8px}
.pxs-block h2{margin:0;font-size:14px;line-height:22px;font-weight:600;color:var(--dsw-alias-label-primary)}
.pxs-block p{margin:0;color:var(--dsw-alias-label-secondary);font-size:13.5px;overflow-wrap:anywhere}
.pxs-none{color:var(--dsw-alias-label-tertiary)!important;font-size:13px!important}
.pxs-rail{list-style:none;margin:0;padding:0;display:grid}
.pxs-rail li{position:relative;display:grid;grid-template-columns:22px minmax(0,1fr);gap:10px;padding-bottom:12px}
.pxs-rail li:not(:last-child)::before{content:"";position:absolute;left:10.5px;top:22px;bottom:0;width:1px;background:var(--dsw-alias-border-l3)}
.pxs-rail-dot{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:var(--dsw-alias-bg-layer-1);box-shadow:inset 0 0 0 .5px var(--dsw-alias-border-l3);font-size:11px;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-secondary)}
.pxs-rail li>div{display:flex;flex-direction:column;gap:2px;padding-top:2px}
.pxs-rail p{color:var(--dsw-alias-label-primary)!important}
.pxs-paths{list-style:none;margin:0 -10px;padding:0;display:grid}
.pxs-path{width:100%;display:flex;align-items:center;gap:12px;padding:8px 10px;border:0;border-radius:10px;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer;transition:background-color .16s ease}
@media (hover:hover){.pxs-path:hover{background:var(--dsw-alias-interactive-bg-hover)}}
.pxs-path[data-off]{opacity:.55}
.pxs-path>svg{flex:none;color:var(--dsw-alias-label-tertiary)}
.pxs-path-text{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.pxs-path-title{font-size:13.5px;font-weight:500;color:var(--dsw-alias-label-primary)}
.pxs-path-desc{font-size:13px;color:var(--dsw-alias-label-secondary)}
.pxs-serves{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:10px!important}
.pxs-timeline{list-style:none;margin:0;padding:0;display:grid;gap:6px;font-size:13px}
.pxs-timeline li{display:grid;grid-template-columns:64px minmax(0,1fr);gap:10px;color:var(--dsw-alias-label-secondary)}
.pxs-timeline time{color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums}
.pxs-pair{display:grid;grid-template-columns:1fr 1fr;gap:0 24px}
.pxs-summary{margin-top:10px}
.pxs-summary summary{cursor:pointer;font-size:12.5px;color:var(--dsw-alias-label-tertiary);list-style:none}
.pxs-summary summary::before{content:"›";display:inline-block;margin-right:6px;transition:transform .2s ease}
.pxs-summary[open] summary::before{transform:rotate(90deg)}
.pxs-summary p{margin-top:6px!important}
@media (width<=767px){.pxs-pair{grid-template-columns:1fr}}
.pxs-verdict{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px 16px;margin-top:28px;padding:14px 16px;border-radius:14px;background:var(--dsw-alias-bg-layer-1)}
.pxs-verdict-q{font-size:13.5px;color:var(--dsw-alias-label-secondary)}
.pxs-buttons{display:flex;flex-wrap:wrap;gap:8px}
.pxs-ask-note{flex:1;display:flex;flex-direction:column;gap:8px}
.pxs-done{display:inline-flex;align-items:center;gap:6px;margin:0;color:var(--dsw-alias-state-business-primary);font-size:13px;font-weight:500;animation:pxs-in .2s cubic-bezier(.22,1,.36,1)}
.pxs-draft{display:flex;flex-direction:column;gap:2px}
.pxs-draft textarea{width:100%;box-sizing:border-box;min-height:56px;padding:8px 10px;border:.5px solid var(--dsw-alias-border-l3);border-radius:10px;background:var(--dsw-alias-bg-base);color:inherit;font:inherit;font-size:13px;line-height:1.55;resize:none;overflow:auto}
.pxs-draft textarea:focus-visible{outline:0;border-color:var(--dsw-focus-ring-color);box-shadow:0 0 0 3px color-mix(in srgb,var(--dsw-focus-ring-color) 22%,transparent)}
.pxs-draft-foot{display:flex;justify-content:space-between;gap:8px}
.pxs-count{color:var(--dsw-alias-label-tertiary);font-size:12px;font-variant-numeric:tabular-nums}
.pxs-count[data-near]{color:var(--dsw-alias-state-error-primary)}
.pxs-dock{position:absolute;left:0;right:0;bottom:0;padding:0 clamp(20px,4vw,48px) 20px;pointer-events:none;background:linear-gradient(to bottom,transparent,var(--dsw-alias-bg-base) 40%)}
.pxs-dock>*{pointer-events:auto;max-width:784px;margin-left:auto;margin-right:auto}
.pxs-composer{display:flex;align-items:center;gap:10px;padding:10px 10px 10px 22px;border-radius:28px;background:var(--dsw-alias-bg-base);box-shadow:inset 0 0 0 .5px var(--dsw-alias-border-l3),var(--dsw-shadow-lv2);transition:box-shadow .2s ease}
.pxs-composer:focus-within{box-shadow:inset 0 0 0 .5px var(--dsw-alias-border-l4),var(--dsw-shadow-lv3)}
.pxs-composer textarea{box-sizing:border-box;flex:1;min-height:36px;max-height:136px;padding:7px 0;border:0;outline:0;background:none;color:inherit;font:inherit;font-size:15px;line-height:22px;resize:none}
.pxs-composer textarea::placeholder{color:var(--dsw-alias-label-tertiary)}
.pxs-send{flex:none;display:grid;place-items:center;width:36px;height:36px;padding:0;border:0;border-radius:50%;background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-base);cursor:pointer;transition:opacity .16s ease,transform .16s ease}
.pxs-send:disabled{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-tertiary);cursor:default}
.pxs-send:not(:disabled):active{transform:scale(.94)}
.pxs-problem{margin:0 0 8px;color:var(--dsw-alias-state-error-primary);font-size:13px}
.pxs-empty{padding:40px 8px;color:var(--dsw-alias-label-tertiary);font-size:13px}
.pxs-empty p{margin:0 0 4px}
.pxs-empty-title{color:var(--dsw-alias-label-primary);font-size:14px;font-weight:500}
.pxs-empty-action{margin-top:12px}
.pxs-skel{display:flex;flex-direction:column;gap:8px;padding:14px 8px}
.pxs-skel i{display:block;height:10px;border-radius:5px;background:linear-gradient(90deg,var(--dsw-alias-border-l1) 0%,var(--dsw-alias-border-l2) 50%,var(--dsw-alias-border-l1) 100%);background-size:200% 100%;animation:pxs-shimmer 1.4s linear infinite}
.pxs-skel i:first-child{width:40%}.pxs-skel i:nth-child(2){width:72%}.pxs-skel i:nth-child(3){width:56%}
@media (width<=767px){.pxs-host,.pxs-row-side time,.pxs-row-side .pxs-ev{display:none}.pxs-detail-head{flex-wrap:wrap}.pxs-content{padding-left:16px;padding-right:16px}}
.pxs-cart-btn,.pxs-cart-add,.pxs-open,.pxs-view,.pxs-step,.pxs-shelf-more,.pxs-tagchip{transition:opacity .16s ease,background-color .16s ease,color .16s ease,box-shadow .16s ease,transform .1s ease-out}
.pxs-cart-btn:active,.pxs-cart-add:active,.pxs-open:active,.pxs-view:active,.pxs-step:not(:disabled):active,.pxs-shelf-more:active,.pxs-tagchip:active{transform:scale(.97)}
@keyframes pxs-shimmer{from{background-position:100% 0}to{background-position:-100% 0}}
@keyframes pxs-in{from{opacity:0;transform:translateY(3px)}}
@keyframes pxs-rot{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.pxs-page *{animation-duration:1ms!important;animation-iteration-count:1!important;transition-duration:1ms!important}}
.pxc{margin:4px 0;border-radius:12px;background:var(--dsw-alias-bg-base);box-shadow:inset 0 0 0 .5px var(--dsw-alias-border-l3);font-size:13px;line-height:1.45;color:var(--dsw-alias-label-secondary)}
.pxc-head{display:flex;align-items:center;gap:10px;width:100%;min-height:40px;padding:6px 10px 6px 7px;border:0;border-radius:12px;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer;transition:background-color .16s ease}
.pxc[data-open] .pxc-head{border-radius:12px 12px 0 0}
.pxc-head:disabled{cursor:default}
.pxc-head:focus-visible,.pxc-link:focus-visible{outline:2px solid var(--dsw-focus-ring-color);outline-offset:-2px}
.pxc-icon{display:grid;place-items:center;flex:none;width:26px;height:26px;border-radius:7px;background:var(--dsw-alias-bg-layer-1);box-shadow:inset 0 0 0 .5px var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary)}
.pxc-main{display:flex;align-items:baseline;gap:8px;flex:1;min-width:0}
.pxc-name{flex:0 1 auto;max-width:55%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary);font:500 12.5px ui-monospace,'SF Mono',Menlo,monospace}
.pxc-summary{flex:1 1 0;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pxc-status{display:inline-flex;align-items:center;gap:6px;flex:none;color:var(--dsw-alias-label-tertiary);font-size:12.5px;font-variant-numeric:tabular-nums;animation:pxc-in .36s cubic-bezier(.22,1,.36,1) both}
.pxc[data-status=error] .pxc-status{color:var(--dsw-alias-state-error-primary)}
.pxc-status svg{width:14px;height:14px;fill:none;stroke-linecap:round;stroke-linejoin:round}
.pxc-spin{animation:pxc-spin .8s linear infinite}.pxc-spin circle{stroke:currentColor;stroke-width:1.6;opacity:.22}.pxc-spin path{stroke:var(--dsw-alias-label-primary);stroke-width:1.6}
.pxc-ok{stroke:var(--dsw-alias-label-primary);stroke-width:1.8}.pxc-ok path{stroke-dasharray:1;stroke-dashoffset:1;animation:pxc-draw .36s cubic-bezier(.22,1,.36,1) 80ms forwards}
.pxc-err{stroke:var(--dsw-alias-state-error-primary);stroke-width:1.5}
.pxc-link{flex:none;color:var(--dsw-alias-state-business-primary);font-size:12.5px;cursor:pointer;border-radius:4px}
.pxc-chev{flex:none;width:14px;height:14px;fill:none;stroke:var(--dsw-alias-label-tertiary);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;transition:transform .36s cubic-bezier(.22,1,.36,1)}
.pxc[data-open] .pxc-chev{transform:rotate(180deg)}.pxc[data-status=running] .pxc-chev{opacity:.35}
.pxc-body{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows .38s cubic-bezier(.22,1,.36,1),opacity .24s ease}
.pxc[data-open] .pxc-body{grid-template-rows:1fr;opacity:1}
.pxc-clip{min-height:0;overflow:hidden}
.pxc-sections{display:grid;gap:12px;padding:10px 12px 12px;border-top:.5px solid var(--dsw-alias-border-l2)}
.pxc-section{display:grid;gap:4px;min-width:0}
.pxc-label{color:var(--dsw-alias-label-tertiary);font-size:12px;font-weight:500}
.pxc-list{margin:0;padding:0;list-style:none;display:grid;gap:4px}
.pxc-list li{display:flex;flex-wrap:wrap;gap:2px 8px;color:var(--dsw-alias-label-primary);overflow-wrap:anywhere}
.pxc-list a,.pxc-file{color:var(--dsw-alias-state-business-primary)}
.pxc-file{padding:0;border:0;background:none;font:inherit;cursor:pointer;text-align:left}
.pxc-dim{color:var(--dsw-alias-label-tertiary)}
.pxc-error{margin:0;color:var(--dsw-alias-state-error-primary);white-space:pre-line}
@keyframes pxc-in{from{opacity:0;transform:translateY(3px);filter:blur(2px)}}
@keyframes pxc-spin{to{transform:rotate(360deg)}}
@keyframes pxc-draw{to{stroke-dashoffset:0}}
@media (prefers-reduced-motion:reduce){.pxc *{animation-duration:1ms!important;animation-iteration-count:1!important;transition-duration:1ms!important}.pxc-ok path{stroke-dashoffset:0}}
`

    module.exports.apply = apply
    module.exports.inject = ['slots', 'locale', 'remote', 'remote.session', 'commandUi', 'uiWorkspace', 'layout']
    return module.exports
  },
})
