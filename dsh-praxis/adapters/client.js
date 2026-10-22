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
      return React.createElement('svg', { viewBox: '0 0 48 48', width: 48, height: 48, fill: 'none', stroke: 'currentColor', strokeWidth: 2, 'aria-hidden': true },
        React.createElement('rect', { x: 8, y: 10, width: 32, height: 28, rx: 3 }),
        React.createElement('path', { d: 'M8 18h32M18 18v20' }))
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
