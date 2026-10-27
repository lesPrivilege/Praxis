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
        resolve: '按 Praxis 取用', consume: '在 Praxis 登记', units: '单元', materials: '素材', artifacts: '产物', sources: '来源', open: '控制面', running: '进行中' },
      en: { title: 'Praxis', description: 'Kit bundle: units, sources, presets and log', frame: 'Praxis control plane', command: 'Open the Praxis control plane',
        resolve: 'Praxis resolve', consume: 'Praxis record', units: 'units', materials: 'materials', artifacts: 'artifacts', sources: 'sources', open: 'Control plane', running: 'running' },
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
      const S = {
        card: { border: '1px solid var(--color-border, rgba(127,127,127,.25))', borderRadius: 8, padding: '6px 10px', margin: '4px 0', fontSize: 13 },
        head: { display: 'flex', gap: 8, alignItems: 'baseline', cursor: 'pointer', background: 'none', border: 0, padding: 0, color: 'inherit', font: 'inherit', width: '100%', textAlign: 'left' },
        dim: { opacity: 0.65 },
        list: { margin: '6px 0 2px', paddingLeft: 18 },
        link: { background: 'none', border: 0, padding: 0, color: 'var(--color-accent, inherit)', textDecoration: 'underline', cursor: 'pointer', font: 'inherit' },
      }
      function Card({ title, summary, running, children }) {
        const [open, setOpen] = React.useState(false)
        return h('div', { style: S.card, 'data-tool': 'praxis' },
          h('button', { type: 'button', style: S.head, 'aria-expanded': open, onClick: () => setOpen(!open) },
            h('strong', null, title), h('span', { style: S.dim }, running ? t('running') : summary),
            h('span', { style: { marginLeft: 'auto' } }, h('span', { role: 'link', style: S.link, onClick: (e) => { e.stopPropagation(); openPanel() } }, t('open')))),
          open && !running ? children : null)
      }
      function ResolveRow({ block, phase }) {
        const v = valueOf(block)
        const running = phase !== 'result' || !('kind' in (block ?? {}))
        const units = v?.units ?? []
        const mats = v?.materials ?? []
        return h(Card, { title: t('resolve'), running, summary: v ? `${v.task_type?.title ?? ''} ${v.pipeline ?? ''} · ${units.length} ${t('units')} · ${mats.length} ${t('materials')}` : '' },
          h('ul', { style: S.list }, units.map((u) => h('li', { key: u.id }, u.title, ' ', h('span', { style: S.dim }, u.reasons?.join('；'))))),
          mats.length ? h('ul', { style: S.list }, mats.map((m) => h('li', { key: m.binding }, m.url ? h('a', { href: m.url, target: '_blank', rel: 'noreferrer' }, m.title) : m.title, ' ', h('span', { style: S.dim }, m.description)))) : null)
      }
      function ConsumeRow({ block, phase, openFile }) {
        const v = valueOf(block)
        const running = phase !== 'result' || !('kind' in (block ?? {}))
        const files = v?.artifacts ?? []
        return h(Card, { title: t('consume'), running, summary: v ? `${v.title} · ${(v.units ?? []).length} ${t('units')} · ${(v.sources ?? []).length} ${t('sources')} · ${files.length} ${t('artifacts')}` : '' },
          h('ul', { style: S.list }, files.map((a) => h('li', { key: a.artifact },
            h('button', { type: 'button', style: S.link, onClick: () => openFile?.(a.absolute) }, a.path), ' ', h('span', { style: S.dim }, `v${a.version}`)))))
      }
      for (const [key, Row] of [['praxis_resolve', ResolveRow], ['praxis_consume', ConsumeRow]]) {
        ctx.effect(() => ctx.slots.inject('tool.call.toolview', () => ctx.slots.register({ name: 'tool.call.toolview', key }, Row)), `dsh-praxis: ${key} card`)
      }
    }

    module.exports.apply = apply
    module.exports.inject = ['slots', 'sidebarRightTabs', 'sidebarRight', 'locale', 'remote', 'remote.session', 'commandUi']
    return module.exports
  },
})
