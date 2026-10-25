// DSH web client half: a right-sidebar tab type "Praxis" whose body embeds the
// control plane the server half serves at /praxis/ on the same origin.
window.__ModuleLoader__.load({
  id: 'dsh-praxis',
  factory: (require) => {
    var module = { exports: {} }
    Object.defineProperty(module.exports, Symbol.toStringTag, { value: 'Module' })
    const React = require('react')
    const TAB = 'dsh-praxis/control-plane'

    function Icon() {
      // Same mark as the control plane's header: three layers, shortening downward.
      return React.createElement('svg', { viewBox: '0 0 24 24', width: 48, height: 48, fill: 'currentColor', 'aria-hidden': true },
        React.createElement('rect', { x: 4, y: 4, width: 16, height: 3.2, rx: 1.6 }),
        React.createElement('rect', { x: 4, y: 9.6, width: 12, height: 3.2, rx: 1.6, opacity: 0.7 }),
        React.createElement('rect', { x: 4, y: 15.2, width: 8, height: 3.2, rx: 1.6, opacity: 0.45 }))
    }

    function Body() {
      return React.createElement('iframe', {
        src: '/praxis/',
        title: 'Praxis 控制面',
        style: { border: 0, width: '100%', height: '100%', display: 'block', background: 'transparent' },
      })
    }

    function apply(ctx) {
      ctx.effect(() => ctx.sidebarRightTabs.register({
        id: TAB,
        kind: 'praxis',
        title: () => 'Praxis',
        guide: [{ id: 'praxis', order: 60, title: () => 'Praxis 控制面', description: () => 'Kit 单元、来源挂载、预设与运行记录', icon: Icon }],
      }), 'dsh-praxis: tab type')
      ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register({ name: 'sidebar.right.pane.tab', key: TAB }, Body)), 'dsh-praxis: tab body')
    }

    module.exports.apply = apply
    module.exports.inject = ['slots', 'sidebarRightTabs']
    return module.exports
  },
})
