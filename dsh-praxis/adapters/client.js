// DSH web client half: a right-sidebar tab type "Praxis" whose body embeds the control plane
// the server half serves on the authenticated /api channel of the same origin. The body also
// relays the frame's file requests to the host: preview in DSH's document tab, reveal, open.
// `/praxis` opens the tab; praxis_resolve and praxis_consume calls show as compact cards.
window.__ModuleLoader__.load({
  id: 'dsh-praxis',
  factory: (require) => {
    var module = { exports: {} }
    Object.defineProperty(module.exports, Symbol.toStringTag, { value: 'Module' })
    const React = require('react')
    const TAB = 'dsh-praxis/control-plane'
    const NS = 'praxis'
    const COPY = {
      zh: { title: 'Praxis 控制面', description: 'Kit 整合包：单元、来源、预设与记录', frame: 'Praxis 控制面', command: '打开 Praxis 控制面',
        resolve: '按 Praxis 取用', consume: '在 Praxis 登记', units: '单元', materials: '素材', artifacts: '产物', sources: '来源', open: '控制面', running: '进行中', failed: '没有完成',
        panel: 'Praxis',
        'review.title': '来源 review', 'review.lede': '名册里每个已编目来源的 description 写的是何时打开、取什么。展开一条，对照原件和收录理由，判断它准不准。',
        'review.reload': '刷新', 'review.controlPlane': '打开控制面', 'review.filter': '筛选', 'review.search': '按标题、说明或链接找',
        'review.f.open': '待看', 'review.f.needs-work': '待改', 'review.f.reviewed': '已 review', 'review.f.all': '全部',
        'review.empty.open': '当前的 description 都 review 过了。新登记的来源会出现在这里。', 'review.empty.needs-work': '没有标为待改的来源。', 'review.empty.reviewed': '还没有 review 过的来源。', 'review.empty.all': '名册里还没有编目的来源。',
        'review.noMatch': '没有匹配的来源', 'review.failed': '读不到名册：', 'review.stale': '上次 review（r{r}）之后编目又改过',
        'review.url': '原件', 'review.summary': '概要', 'review.why': '收录理由', 'review.area': 'Kit 分类', 'review.noArea': '未分类', 'review.scope': '读取范围', 'review.limits': '边界', 'review.pages': '挂在这些页上',
        'review.last': '上次 review：{v}，r{r}，{by}，{at}', 'review.note': 'review 说明（可选）', 'review.rewrite': '改写', 'review.saveRevised': '保存并记为已改', 'review.cancel': '取消', 'review.saveHint': '⌘/Ctrl + Enter 保存，Esc 取消',
        'review.description': 'description，240 字以内', 'review.recorded': '已记录：{v}', 'review.conflict': '这条刚被别处改过，刷新后再看。',
        'v.accurate': '准确', 'v.revised': '已改', 'v.needs-work': '待改',
        'form.standard': '标准规范', 'form.practice': '成熟实践', 'form.component-library': '组件库', 'form.case-library': '案例库', 'form.case': '单个案例', 'form.skill': 'Skill', 'form.tool': '工具', 'form.article': '文章', 'form.research': '研究' },
      en: { title: 'Praxis', description: 'Kit bundle: units, sources, presets and log', frame: 'Praxis control plane', command: 'Open the Praxis control plane',
        resolve: 'Praxis resolve', consume: 'Praxis record', units: 'units', materials: 'materials', artifacts: 'artifacts', sources: 'sources', open: 'Control plane', running: 'running', failed: 'Failed',
        panel: 'Praxis',
        'review.title': 'Source review', 'review.lede': 'Each catalogued source carries a description: when to open it and what to take. Open one, compare it with the original and why it was collected, and judge whether it holds.',
        'review.reload': 'Reload', 'review.controlPlane': 'Open control plane', 'review.filter': 'Filter', 'review.search': 'Find by title, description or link',
        'review.f.open': 'To review', 'review.f.needs-work': 'Needs work', 'review.f.reviewed': 'Reviewed', 'review.f.all': 'All',
        'review.empty.open': 'Every current description has a review. Newly captured sources show up here.', 'review.empty.needs-work': 'No source is marked needs work.', 'review.empty.reviewed': 'No source has been reviewed yet.', 'review.empty.all': 'The roster has no catalogued sources yet.',
        'review.noMatch': 'No matching sources', 'review.failed': 'Could not read the roster:', 'review.stale': 'Entry edited since the last review (r{r})',
        'review.url': 'Original', 'review.summary': 'Summary', 'review.why': 'Collected for', 'review.area': 'Kit area', 'review.noArea': 'Unfiled', 'review.scope': 'Read scope', 'review.limits': 'Limits', 'review.pages': 'Attached to',
        'review.last': 'Last review: {v}, r{r}, {by}, {at}', 'review.note': 'Review note (optional)', 'review.rewrite': 'Rewrite', 'review.saveRevised': 'Save as revised', 'review.cancel': 'Cancel', 'review.saveHint': '⌘/Ctrl + Enter to save, Esc to cancel',
        'review.description': 'Description, up to 240 characters', 'review.recorded': 'Recorded: {v}', 'review.conflict': 'Someone changed this entry meanwhile. Reload and look again.',
        'v.accurate': 'Accurate', 'v.revised': 'Revised', 'v.needs-work': 'Needs work',
        'form.standard': 'Standard', 'form.practice': 'Practice', 'form.component-library': 'Component library', 'form.case-library': 'Case library', 'form.case': 'Case', 'form.skill': 'Skill', 'form.tool': 'Tool', 'form.article': 'Article', 'form.research': 'Research' },
    }

    // Same mark as the control plane's header: three layers, shortening downward.
    function Icon() {
      return React.createElement('svg', { viewBox: '0 0 24 24', width: 48, height: 48, fill: 'currentColor', 'aria-hidden': true },
        React.createElement('rect', { x: 4, y: 4, width: 16, height: 3.2, rx: 1.6 }),
        React.createElement('rect', { x: 4, y: 9.6, width: 12, height: 3.2, rx: 1.6, opacity: 0.7 }),
        React.createElement('rect', { x: 4, y: 15.2, width: 8, height: 3.2, rx: 1.6, opacity: 0.45 }))
    }

    // The address DSH's document preview claims, as @deepseek-ai/dsh-util-workspace-path spells it.
    const segment = (s) => encodeURIComponent(s).replace(/%3A/gi, ':')
    const fileAddress = (sessionId, path) => `dsh-resource://file/session/${segment(sessionId)}/${path.split('/').map(segment).join('/')}`

    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, COPY), 'dsh-praxis: locale')
      const t = ctx.locale.bind(NS)

      // {type:'praxis:file', id, action:'preview'|'reveal'|'open', path:<absolute>} from the frame only.
      async function fileAction(tab, sessionId, { action, path }) {
        if (action === 'preview') {
          if (!sessionId) return { ok: false, error: 'no session' }
          ;(tab?.actions ?? ctx.sidebarRight).openResource(fileAddress(sessionId, path))
          return { ok: true }
        }
        if (action === 'reveal' || action === 'open') {
          const result = await ctx.remote.session.openWorkspacePath(action === 'reveal' ? { path, action } : { path })
          return { ok: !!result?.ok }
        }
        return { ok: false, error: `unknown action: ${action}` }
      }

      function Body({ sessionId, useTabInfo }) {
        const frame = React.useRef(null)
        const tab = useTabInfo?.().tab
        React.useEffect(() => {
          function onMessage(event) {
            const data = event.data
            if (!frame.current || event.source !== frame.current.contentWindow || data?.type !== 'praxis:file') return
            fileAction(tab, sessionId, data)
              .catch((error) => ({ ok: false, error: String(error?.message ?? error) }))
              .then((result) => event.source.postMessage({ type: 'praxis:file:result', id: data.id, ...result }, location.origin))
          }
          window.addEventListener('message', onMessage)
          return () => window.removeEventListener('message', onMessage)
        }, [tab, sessionId])
        return React.createElement('iframe', {
          ref: frame,
          src: '/api/praxis',
          title: t('frame'),
          style: { border: 0, width: '100%', height: '100%', display: 'block', background: 'transparent' },
        })
      }

      ctx.effect(() => ctx.sidebarRightTabs.register({
        id: TAB,
        kind: 'praxis',
        title: () => 'Praxis',
        // The iframe keeps its place and open cards across tab, Session and collapse changes.
        keepMounted: true,
        guide: [{ id: 'praxis', order: 60, title: () => t('title'), description: () => t('description'), icon: Icon }],
      }), 'dsh-praxis: tab type')
      ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register({ name: 'sidebar.right.pane.tab', key: TAB }, Body)), 'dsh-praxis: tab body')

      const openPanel = () => ctx.sidebarRight.openTab('praxis', { revealIfOpened: true })
      // Bare `/praxis` opens the control plane; with text it reaches the host command.
      ctx.effect(() => ctx.commandUi.decorate({ name: 'praxis', available: () => true, ui: { kind: 'action', run: openPanel } }), 'dsh-praxis: command')

      // A settled call's value is the JSON text the server half rendered.
      const valueOf = (block) => {
        if (!block || !('kind' in block) || block.isError) return null
        try { return JSON.parse(block.content.filter((c) => c.type === 'text').map((c) => c.text).join('')) } catch { return null }
      }
      const h = React.createElement
      // affectUI Tool Call Card: icon tile, tool name in mono, a one-line summary, the status
      // (spinner and live timer, a check that draws itself with the duration, or Failed), and a
      // body that grows open. Restyled on DSH tokens.
      function Card({ name, summary, status, error, children }) {
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
            h('span', { role: 'link', tabIndex: 0, className: 'pxc-link', onClick: (e) => { e.stopPropagation(); openPanel() }, onKeyDown: (e) => { if (e.key === 'Enter') { e.stopPropagation(); openPanel() } } }, t('open')),
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
        return h(Card, { name: 'praxis_resolve', status: statusOf(block, phase), error: errorOf(block),
          summary: v ? `${v.task_type?.title ?? ''} ${v.pipeline ?? ''} · ${units.length} ${t('units')} · ${mats.length} ${t('materials')}` : '' },
          h('div', { className: 'pxc-section' }, h('span', { className: 'pxc-label' }, t('units')),
            h('ul', { className: 'pxc-list' }, units.map((u) => h('li', { key: u.id }, h('span', null, u.title), h('span', { className: 'pxc-dim' }, u.reasons?.join('；')))))),
          mats.length ? h('div', { className: 'pxc-section' }, h('span', { className: 'pxc-label' }, t('materials')),
            h('ul', { className: 'pxc-list' }, mats.map((m) => h('li', { key: m.binding }, m.url ? h('a', { href: m.url, target: '_blank', rel: 'noreferrer' }, m.title) : h('span', null, m.title), h('span', { className: 'pxc-dim' }, m.description))))) : null)
      }
      function ConsumeRow({ block, phase, openFile }) {
        const v = valueOf(block)
        const files = v?.artifacts ?? []
        return h(Card, { name: 'praxis_consume', status: statusOf(block, phase), error: errorOf(block),
          summary: v ? `${v.title} · ${(v.units ?? []).length} ${t('units')} · ${(v.sources ?? []).length} ${t('sources')} · ${files.length} ${t('artifacts')}` : '' },
          h('div', { className: 'pxc-section' }, h('span', { className: 'pxc-label' }, t('artifacts')),
            h('ul', { className: 'pxc-list' }, files.map((a) => h('li', { key: a.artifact },
              h('button', { type: 'button', className: 'pxc-file', onClick: () => openFile?.(a.absolute) }, a.path), h('span', { className: 'pxc-dim' }, `v${a.version}`))))))
      }
      for (const [key, Row] of [['praxis_resolve', ResolveRow], ['praxis_consume', ConsumeRow]]) {
        ctx.effect(() => ctx.slots.inject('tool.call.toolview', () => ctx.slots.register({ name: 'tool.call.toolview', key }, Row)), `dsh-praxis: ${key} card`)
      }

      // Left sidebar: a "Praxis" panel whose main page reviews the source catalog with DSH's own controls.
      ctx.effect(() => {
        const style = document.createElement('style')
        style.dataset.plugin = 'dsh-praxis'
        style.textContent = REVIEW_CSS
        document.head.append(style)
        return () => style.remove()
      }, 'dsh-praxis: styles')
      ctx.effect(() => ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({ name: 'sidebar.panellist', id: PANEL, order: 40, locale: NS, label: () => t('panel') }, PanelIcon)), 'dsh-praxis: sidebar entry')
      ctx.effect(() => ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: PANEL, locale: NS, inject: () => ({ openPanel }) }, ReviewPage)), 'dsh-praxis: review page')
    }

    // ---- source review page -------------------------------------------------------------------
    // One row per catalogued source, newest first. "To review" holds rows whose current description
    // has no review yet; a verdict confirms in place, then the row folds away (affectUI Decision Inbox).
    const PANEL = 'praxis'
    const P = require('@deepseek-ai/dsh-client-ui-primitives')

    async function call(tool, args = {}) {
      const res = await fetch('/api/praxis.call', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool, args }) })
      const body = await res.json()
      if (!res.ok) throw Object.assign(new Error(body.error || res.statusText), { status: res.status })
      return body
    }

    function PanelIcon({ size = 16 }) {
      return React.createElement('svg', { viewBox: '0 0 16 16', width: size, height: size, fill: 'currentColor', 'aria-hidden': true },
        React.createElement('rect', { x: 2, y: 3, width: 12, height: 2, rx: 1 }),
        React.createElement('rect', { x: 2, y: 7, width: 9, height: 2, rx: 1, opacity: 0.7 }),
        React.createElement('rect', { x: 2, y: 11, width: 6, height: 2, rx: 1, opacity: 0.45 }))
    }

    /** A review counts until the entry is edited again; core says whether it still holds. */
    const reviewed = (row) => !!row.review?.current

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
      return [...byId.values()].sort((a, b) => String(b.captured_at ?? '').localeCompare(String(a.captured_at ?? '')) || a.title.localeCompare(b.title))
    }

    function ReviewPage({ t, openPanel }) {
      const h = React.createElement
      const [rows, setRows] = React.useState(null)
      const [error, setError] = React.useState(null)
      const [filter, setFilter] = React.useState('open')
      const [query, setQuery] = React.useState('')
      const [openId, setOpenId] = React.useState(null)
      const [gone, setGone] = React.useState(() => new Set())

      const load = React.useCallback(() => {
        setError(null)
        loadCatalog().then(setRows, (e) => setError(String(e.message ?? e)))
      }, [])
      React.useEffect(load, [load])

      // A settled row stays in view long enough to read its confirmation, then folds if the filter no longer holds it.
      const settle = (next) => {
        setRows((all) => all.map((r) => (r.id === next.id ? { ...r, ...next } : r)))
        setTimeout(() => setGone((g) => new Set(g).add(next.id)), 1100)
      }
      const keep = (r) => {
        if (filter === 'open') return !reviewed(r)
        if (filter === 'needs-work') return reviewed(r) && r.review.verdict === 'needs-work'
        if (filter === 'reviewed') return reviewed(r)
        return true
      }
      const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
      const match = (r) => terms.every((x) => [r.title, r.description, r.url, r.id].join(' ').toLowerCase().includes(x))
      // Rows settled under this filter stay mounted (folded, inert) until the filter changes.
      const changeFilter = (f) => { setFilter(f); setGone(new Set()); setOpenId(null); setRows((all) => all?.map((r) => (r.settled ? { ...r, settled: false } : r))) }
      const shown = (rows ?? []).filter((r) => match(r) && (keep(r) || r.settled))

      const head = h('div', { className: 'pxr-head' },
        h('div', null, h('h1', null, t('review.title')), h('p', { className: 'pxr-lede' }, t('review.lede'))),
        h('div', { className: 'pxr-actions' },
          h(P.Button, { variant: 'ghost', size: 'sm', icon: h(P.IconRefreshOutlineRegular, { size: 14 }), onClick: load }, t('review.reload')),
          h(P.Button, { variant: 'outline', size: 'sm', onClick: openPanel }, t('review.controlPlane'))))
      const tools = h('div', { className: 'pxr-tools' },
        h(P.SegmentedControl, { label: t('review.filter'), value: filter, onChange: changeFilter,
          options: ['open', 'needs-work', 'reviewed', 'all'].map((v) => ({ value: v, label: t(`review.f.${v}`) })) }),
        h(P.Input, { className: 'pxr-search', type: 'search', role: 'searchbox', value: query, placeholder: t('review.search'), 'aria-label': t('review.search'),
          icon: h(P.IconSearchOutlineRegular, { size: 14 }), onChange: (e) => setQuery(e.target.value) }))

      let body
      if (error) body = h('div', { className: 'pxr-empty' }, h(P.StateDot, { state: 'error' }), ' ', t('review.failed'), ' ', error)
      else if (!rows) body = h('div', { className: 'pxr-list', 'aria-busy': true }, [0, 1, 2, 3].map((i) => h('div', { key: i, className: 'pxr-skel' }, h('i'), h('i'))))
      else if (!shown.length) body = h('p', { className: 'pxr-empty' }, terms.length ? t('review.noMatch') : t(`review.empty.${filter}`))
      else body = h('div', { className: 'pxr-list' }, shown.map((r) => h(ReviewRow, {
        key: r.id, row: r, t, open: openId === r.id, folding: gone.has(r.id) && !keep(r),
        onToggle: () => setOpenId(openId === r.id ? null : r.id), onSettled: (next) => settle({ ...next, settled: true }),
      })))

      return h('section', { className: 'pxr-page', 'aria-label': t('review.title') },
        h('div', { className: 'pxr-scroll' }, h('div', { className: 'pxr-content' }, head, tools, body)))
    }

    function ReviewRow({ row, t, open, folding, onToggle, onSettled }) {
      const h = React.createElement
      const [detail, setDetail] = React.useState(null)
      const [note, setNote] = React.useState('')
      const [draft, setDraft] = React.useState(null)
      const [busy, setBusy] = React.useState(false)
      const [done, setDone] = React.useState(null)
      const [problem, setProblem] = React.useState(null)
      React.useEffect(() => {
        if (!open) { setDone(null); setDraft(null); setProblem(null); return }
        if (!detail) call('praxis_source', { id: row.id }).then(setDetail, (e) => setProblem(String(e.message ?? e)))
      }, [open])

      async function verdict(v) {
        setBusy(true); setProblem(null)
        try {
          let next = row
          if (v === 'revised') {
            const s = await call('praxis_file', { source: row.id, expected_revision: row.entry_revision, description: draft.trim() })
            next = { ...next, description: s.description, entry_revision: s.entry_revision }
            setDetail(s)
          }
          const s = await call('praxis_review', { source: row.id, verdict: v, note: note.trim() || undefined })
          next = { ...next, entry_revision: s.entry_revision, review: { verdict: v, revision: s.review?.revision, by: s.review?.by, at: s.review?.at, current: true } }
          setDone(v); setDraft(null)
          onSettled(next)
        } catch (e) {
          setProblem(e.status === 409 ? t('review.conflict') : String(e.message ?? e))
        } finally { setBusy(false) }
      }

      const current = reviewed(row)
      const state = current ? (row.review.verdict === 'needs-work' ? h(P.Tag, { tone: 'warning' }, t('v.needs-work')) : h(P.Tag, { tone: 'success' }, t(`v.${row.review.verdict}`))) : null
      const stale = !current && row.review ? h('span', { className: 'pxr-caption' }, t('review.stale', { r: row.review.revision })) : null
      const head = h('button', { type: 'button', className: 'pxr-row-head', 'aria-expanded': open, onClick: onToggle },
        h(open ? P.IconChevronDownOutlineRegular : P.IconChevronRightOutlineRegular, { size: 14, className: 'pxr-chev' }),
        h('span', { className: 'pxr-row-text' },
          h('span', { className: 'pxr-row-title', dir: 'auto' }, row.title),
          h('span', { className: 'pxr-row-desc', dir: 'auto' }, row.description), stale),
        h('span', { className: 'pxr-row-meta' }, h(P.Tag, { tone: 'neutral' }, t(`form.${row.form}`)), state))

      let more = null
      if (open) {
        const d = detail
        more = h('div', { className: 'pxr-more' },
          problem ? h('p', { className: 'pxr-problem', role: 'alert' }, problem) : null,
          !d ? h('div', { className: 'pxr-skel' }, h('i'), h('i')) : h(React.Fragment, null,
            h('dl', { className: 'pxr-facts' },
              h('dt', null, t('review.url')), h('dd', null, h('a', { href: d.url, target: '_blank', rel: 'noreferrer' }, d.url)),
              d.summary ? [h('dt', { key: 'a' }, t('review.summary')), h('dd', { key: 'b', dir: 'auto' }, d.summary)] : null,
              h('dt', null, t('review.why')), h('dd', { dir: 'auto' }, d.captured_for?.task ?? d.collection?.purpose ?? '—'),
              h('dt', null, t('review.area')), h('dd', null, row.areas.map((a) => a.title || a.area || t('review.noArea')).join(' · ')),
              d.read_scope ? [h('dt', { key: 'a' }, t('review.scope')), h('dd', { key: 'b', dir: 'auto' }, d.read_scope)] : null,
              d.limits?.length ? [h('dt', { key: 'a' }, t('review.limits')), h('dd', { key: 'b', dir: 'auto' }, d.limits.join('；'))] : null),
            d.excerpts?.length ? h('ul', { className: 'pxr-excerpts' }, d.excerpts.map((x, i) => h('li', { key: i }, h('span', { className: 'pxr-caption' }, x.locator), ' ', x.claim))) : null,
            d.relations?.length ? h('div', { className: 'pxr-pages' }, h('span', { className: 'pxr-caption' }, t('review.pages')),
              h('ul', null, d.relations.map((b) => h('li', { key: b.binding }, h('code', null, b.unit ?? b.target), ' ', h('span', { dir: 'auto' }, b.description))))) : null,
            row.review ? h('p', { className: 'pxr-caption' }, t('review.last', { v: t(`v.${row.review.verdict}`), r: row.review.revision, by: row.review.by ?? '—', at: (row.review.at ?? '').slice(0, 10) })) : null,
            done ? h('p', { className: 'pxr-done', role: 'status' }, h(P.IconCheckOutlineRegular, { size: 14 }), ' ', t('review.recorded', { v: t(`v.${done}`) }))
              : h('div', { className: 'pxr-decide' },
                draft !== null ? h(DraftBox, { value: draft, onChange: setDraft, label: t('review.description'), hint: t('review.saveHint'),
                  onSave: () => { if (!busy && draft.trim() && draft.trim() !== row.description) verdict('revised') }, onCancel: () => setDraft(null) }) : null,
                h(P.Input, { value: note, placeholder: t('review.note'), 'aria-label': t('review.note'), onChange: (e) => setNote(e.target.value) }),
                h('div', { className: 'pxr-buttons' },
                  draft !== null
                    ? [h(P.Button, { key: 's', variant: 'primary', size: 'sm', disabled: busy || !draft.trim() || draft.trim() === row.description, onClick: () => verdict('revised') }, t('review.saveRevised')),
                      h(P.Button, { key: 'c', variant: 'ghost', size: 'sm', disabled: busy, onClick: () => setDraft(null) }, t('review.cancel'))]
                    : [h(P.Button, { key: 'a', variant: 'primary', size: 'sm', disabled: busy, icon: h(P.IconCheckOutlineRegular, { size: 13 }), onClick: () => verdict('accurate') }, t('v.accurate')),
                      h(P.Button, { key: 'n', variant: 'outline', size: 'sm', disabled: busy, onClick: () => verdict('needs-work') }, t('v.needs-work')),
                      h(P.Button, { key: 'e', variant: 'ghost', size: 'sm', disabled: busy, icon: h(P.IconEditOutlineRegular, { size: 13 }), onClick: () => setDraft(row.description ?? '') }, t('review.rewrite'))]))))
      }
      return h('div', { className: 'pxr-row', 'data-open': open || undefined, 'data-gone': folding || undefined, inert: folding || undefined },
        h('div', { className: 'pxr-row-inner' }, head, more))
    }

    // affectUI Text Area: grows with the text, a count that warns near the limit, ⌘/Ctrl+Enter saves, Escape cancels.
    function DraftBox({ value, onChange, onSave, onCancel, label, hint, max = 240 }) {
      const h = React.createElement
      const ref = React.useRef(null)
      React.useLayoutEffect(() => {
        const el = ref.current
        if (!el) return
        el.style.height = 'auto'
        el.style.height = `${Math.min(el.scrollHeight + 2, 240)}px`
      }, [value])
      React.useEffect(() => { ref.current?.focus(); ref.current?.setSelectionRange(value.length, value.length) }, [])
      const left = max - value.length
      return h('div', { className: 'pxr-draft' },
        h('textarea', { ref, value, maxLength: max, rows: 2, 'aria-label': label, 'aria-describedby': 'pxr-draft-hint',
          onChange: (e) => onChange(e.target.value),
          onKeyDown: (e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); onSave() }
            if (e.key === 'Escape') { e.preventDefault(); onCancel() }
          } }),
        h('div', { className: 'pxr-draft-foot' },
          h('span', { id: 'pxr-draft-hint', className: 'pxr-caption' }, hint),
          h('span', { className: 'pxr-count', 'data-near': left <= 20 || undefined, 'aria-live': left <= 20 ? 'polite' : 'off' }, `${value.length}/${max}`)))
    }

    const REVIEW_CSS = `
.pxr-page{width:100%;height:100%;min-height:0;display:flex;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);font-size:14px;line-height:1.6}
.pxr-scroll{flex:1;min-height:0;overflow:auto;scrollbar-gutter:stable}
.pxr-content{max-width:960px;margin:0 auto;padding:0 clamp(24px,4vw,48px) 48px}
@media (width<=767px){.pxr-content{padding-inline:20px}}
.pxr-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-start;gap:16px;padding-top:28px;margin-bottom:20px}
[data-platform=darwin] .pxr-head{padding-top:calc(28px + var(--dsh-frame-top-clearance,0px))}
.pxr-head h1{margin:0;font-size:20px;font-weight:500;line-height:28px}
.pxr-lede{margin:4px 0 0;max-width:60ch;color:var(--dsw-alias-label-secondary);font-size:13px}
.pxr-actions{display:flex;gap:8px;align-items:center}
.pxr-tools{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin-bottom:12px}
.pxr-search{flex:1;min-width:180px}
.pxr-list{display:flex;flex-direction:column}
.pxr-row{display:grid;grid-template-rows:1fr;transition:grid-template-rows 460ms cubic-bezier(.22,1,.36,1),opacity 300ms ease}
.pxr-row[data-gone]{grid-template-rows:0fr;opacity:0}
.pxr-row-inner{min-height:0;overflow:hidden;border-radius:12px}
.pxr-row+.pxr-row .pxr-row-inner{box-shadow:0 -.5px 0 var(--dsw-alias-border-l2)}
.pxr-row[data-open] .pxr-row-inner{background:var(--dsw-alias-bg-layer-1);box-shadow:0 0 0 .5px var(--dsw-alias-border-l2)}
.pxr-row-head{display:flex;align-items:flex-start;gap:10px;width:100%;padding:10px 8px;border:0;border-radius:12px;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}
@media (hover:hover){.pxr-row:not([data-open]) .pxr-row-head:hover{background:var(--dsw-alias-interactive-bg-hover)}}
.pxr-row-head:focus-visible{outline:2px solid var(--dsw-focus-ring-color);outline-offset:-2px}
.pxr-chev{flex:none;margin-top:4px;color:var(--dsw-alias-label-tertiary)}
.pxr-row-text{flex:1;min-width:0;display:flex;flex-direction:column}
.pxr-row-title{font-weight:500;overflow-wrap:anywhere}
.pxr-row-desc{color:var(--dsw-alias-label-secondary);font-size:13px;overflow-wrap:anywhere}
.pxr-row:not([data-open]) .pxr-row-desc{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.pxr-row-meta{flex:none;display:flex;flex-direction:column;align-items:flex-end;gap:4px}
.pxr-caption{color:var(--dsw-alias-label-tertiary);font-size:12px}
.pxr-more{padding:0 16px 14px 32px;animation:pxr-in 360ms cubic-bezier(.22,1,.36,1)}
.pxr-facts{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:4px 14px;margin:0 0 10px;font-size:13px}
.pxr-facts dt{color:var(--dsw-alias-label-tertiary)}
.pxr-facts dd{margin:0;overflow-wrap:anywhere}
.pxr-facts a{color:var(--dsw-alias-state-business-primary)}
.pxr-excerpts,.pxr-pages ul{margin:6px 0 10px;padding-left:18px;font-size:13px}
.pxr-pages code{font-size:12px;color:var(--dsw-alias-label-secondary)}
.pxr-decide{display:flex;flex-direction:column;gap:8px;margin-top:10px}
.pxr-buttons{display:flex;flex-wrap:wrap;gap:8px}
.pxr-draft{display:flex;flex-direction:column;gap:2px}
.pxr-draft textarea{width:100%;box-sizing:border-box;min-height:56px;padding:8px 10px;border:.5px solid var(--dsw-alias-border-l3);border-radius:10px;background:var(--dsw-alias-bg-base);color:inherit;font:inherit;font-size:13px;line-height:1.55;resize:none;overflow:auto;transition:height .18s cubic-bezier(.22,1,.36,1),border-color .16s ease,box-shadow .16s ease}
.pxr-draft textarea:focus-visible{outline:0;border-color:var(--dsw-focus-ring-color);box-shadow:0 0 0 3px color-mix(in srgb,var(--dsw-focus-ring-color) 22%,transparent)}
.pxr-draft-foot{display:flex;justify-content:space-between;gap:8px}
.pxr-count{color:var(--dsw-alias-label-tertiary);font-size:12px;font-variant-numeric:tabular-nums;transition:color .16s ease}
.pxr-count[data-near]{color:var(--dsw-alias-state-error-primary)}
.pxr-done{display:inline-flex;align-items:center;gap:6px;margin:10px 0 0;color:var(--dsw-alias-state-business-primary);font-size:13px;font-weight:500;animation:pxr-in 360ms cubic-bezier(.22,1,.36,1)}
.pxr-problem{margin:0 0 8px;color:var(--dsw-alias-state-error-primary);font-size:13px}
.pxr-empty{padding:32px 8px;color:var(--dsw-alias-label-tertiary);font-size:13px}
.pxr-skel{display:flex;flex-direction:column;gap:8px;padding:12px 8px}
.pxr-skel i{display:block;height:10px;border-radius:5px;background:linear-gradient(90deg,var(--dsw-alias-border-l1) 0%,var(--dsw-alias-border-l2) 50%,var(--dsw-alias-border-l1) 100%);background-size:200% 100%;animation:pxr-shimmer 1.4s linear infinite}
.pxr-skel i:first-child{width:40%}.pxr-skel i:last-child{width:72%}
@keyframes pxr-shimmer{from{background-position:100% 0}to{background-position:-100% 0}}
@keyframes pxr-in{from{opacity:0;transform:translateY(3px)}}
@media (prefers-reduced-motion:reduce){.pxr-row{transition:none}.pxr-more,.pxr-done,.pxr-skel i{animation:none}}
.pxc{margin:4px 0;border-radius:12px;background:var(--dsw-alias-bg-base);box-shadow:inset 0 0 0 .5px var(--dsw-alias-border-l3);font-size:13px;line-height:1.45;color:var(--dsw-alias-label-secondary)}
.pxc-head{display:flex;align-items:center;gap:10px;width:100%;min-height:40px;padding:6px 10px 6px 7px;border:0;border-radius:12px;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer;transition:background-color .16s ease}
.pxc[data-open] .pxc-head{border-radius:12px 12px 0 0}
.pxc-head:disabled{cursor:default}
@media (hover:hover){.pxc-head:not(:disabled):hover{background:var(--dsw-alias-interactive-bg-hover)}}
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
    module.exports.inject = ['slots', 'sidebarRightTabs', 'sidebarRight', 'locale', 'remote', 'remote.session', 'commandUi']
    return module.exports
  },
})
