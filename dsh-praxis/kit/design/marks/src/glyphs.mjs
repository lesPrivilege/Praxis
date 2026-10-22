// 记号的唯一来源。每项：id（g- 加英文语义名）、zh（它重复的那个词）、body（24 × 24 网格里的原生图形）。
// 统一：描边 1.5，圆头圆角，颜色取 currentColor，不依赖外部样式。
// 虚线只用来回答“生效了吗”，所以对象和流程的记号都不用虚线。

const dot = (x, y, r = 1.1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor" stroke="none"/>`;
const ring = '<circle cx="12" cy="12" r="8.5"/>';
const pill = '<rect x="2.5" y="7" width="19" height="10" rx="5"/>';
const sheet = '<path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M14 3v5h5"/>';

export const GROUPS = [
  { key: 'object', zh: '对象', note: '图里的一个东西' },
  { key: 'state', zh: '状态', note: '一个东西此刻成立到哪一步' },
  { key: 'flow', zh: '流程', note: '几个步骤之间怎样走' },
  { key: 'value', zh: '取值', note: '这一格有没有值；四种“没有”各不相同' },
  { key: 'place', zh: '位置', note: '走到了哪一站，说的是哪一处' },
];

export const GLYPHS = [
  // —— 对象 ——
  { id: 'g-person', zh: '人', group: 'object', body: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7"/>' },
  { id: 'g-browser', zh: '浏览器', group: 'object', body: `<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M3 9.5h18"/>${dot(6.2, 7)}${dot(9, 7)}` },
  { id: 'g-terminal', zh: '终端', group: 'object', body: '<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M7 9.5l3 2.5-3 2.5M12.5 15h4.5"/>' },
  { id: 'g-chat', zh: '聊天渠道', group: 'object', body: '<path d="M6 4.5h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-6.5L8 20v-3.5H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z"/><path d="M8 9h8M8 12.5h5"/>' },
  { id: 'g-timer', zh: '定时器', group: 'object', body: '<circle cx="12" cy="13.5" r="7"/><path d="M12 13.5V9.5M10 3h4M12 3v3.5"/>' },
  { id: 'g-webhook', zh: 'webhook', group: 'object', body: '<circle cx="15.5" cy="4.75" r="1.75"/><path d="M15.5 6.5V14a4.75 4.75 0 0 1-9.5 0v-2.5M3.5 14L6 11.5 8.5 14"/>' },
  { id: 'g-gateway', zh: '网关', group: 'object', body: '<path d="M5 20V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14M9 13h6M12.5 10.5L15 13l-2.5 2.5"/>' },
  { id: 'g-service', zh: '服务', group: 'object', body: `<rect x="4" y="4.5" width="16" height="6.5" rx="1.5"/><rect x="4" y="13" width="16" height="6.5" rx="1.5"/>${dot(7.5, 7.75)}${dot(7.5, 16.25)}<path d="M12 7.75h4.5M12 16.25h4.5"/>` },
  { id: 'g-external', zh: '外部服务', group: 'object', body: '<path d="M7.5 18.5a4 4 0 0 1-.7-7.94 5.5 5.5 0 0 1 10.66-.9A4.5 4.5 0 0 1 16.75 18.5z"/>' },
  { id: 'g-agent', zh: 'agent', group: 'object', body: '<rect x="5" y="8" width="14" height="11.5" rx="3"/><path d="M12 8V5.5M9.5 12.75v1.75M14.5 12.75v1.75"/><circle cx="12" cy="4.25" r="1.25"/>' },
  { id: 'g-subagent', zh: 'subagent', group: 'object', body: '<path d="M4.5 3.5V11a2 2 0 0 0 2 2H9"/><rect x="9" y="8.5" width="11.5" height="9.5" rx="2.5"/><path d="M13 12.5V14M16.5 12.5V14"/>' },
  { id: 'g-model', zh: '模型', group: 'object', body: '<circle cx="6" cy="7" r="2"/><circle cx="6" cy="17" r="2"/><circle cx="18" cy="7" r="2"/><circle cx="18" cy="17" r="2"/><path d="M8 7h8M8 17h8M7.6 8.3l8.8 7.4M7.6 15.7l8.8-7.4"/>' },
  { id: 'g-tool', zh: '工具', group: 'object', body: '<path transform="rotate(45 12 12)" d="M10.5 10.74V20a1.5 1.5 0 0 0 3 0v-9.26a4.5 4.5 0 0 0 0-8.48V6.5h-3V2.26a4.5 4.5 0 0 0 0 8.48"/>' },
  { id: 'g-skill', zh: 'skill', sub: '说明文件', group: 'object', body: '<path d="M12 6.5c-2-1.4-4.5-2-8-2v13c3.5 0 6 .6 8 2 2-1.4 4.5-2 8-2v-13c-3.5 0-6 .6-8 2zM12 6.5v13"/>' },
  { id: 'g-middleware', zh: '中间件', sub: '层', group: 'object', body: '<path d="M12 3.5l8 4-8 4-8-4zM4 12l8 4 8-4M4 16.5l8 4 8-4"/>' },
  { id: 'g-queue', zh: '队列', group: 'object', body: '<path d="M2.5 7h19M2.5 17h19"/><rect x="5" y="9.75" width="3" height="4.5" rx=".75"/><rect x="10.5" y="9.75" width="3" height="4.5" rx=".75"/><rect x="16" y="9.75" width="3" height="4.5" rx=".75"/>' },
  { id: 'g-database', zh: '数据库', group: 'object', body: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.66 3.13 3 7 3s7-1.34 7-3V6M5 12c0 1.66 3.13 3 7 3s7-1.34 7-3"/>' },
  { id: 'g-file', zh: '文件', group: 'object', body: `${sheet}<path d="M8.5 13h7M8.5 16.5h4.5"/>` },
  { id: 'g-folder', zh: '目录', group: 'object', body: '<path d="M3.5 7a2 2 0 0 1 2-2h3.7l2 2.5h7.3a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>' },
  { id: 'g-memory', zh: '记忆', group: 'object', body: '<rect x="6" y="4" width="13.5" height="16" rx="2"/><path d="M4 8h4M4 12h4M4 16h4M11.5 9h5M11.5 12.5h3"/>' },
  { id: 'g-checkpoint', zh: 'checkpoint', sub: '快照', group: 'object', body: '<path d="M3 18.5h18M9 18.5V4.5l8.5 3.25L9 11"/>' },
  { id: 'g-artifact', zh: 'artifact', sub: '交付文件', group: 'object', body: `${sheet}<path d="M8.5 15h6.5M12.5 12.5L15 15l-2.5 2.5"/>` },
  { id: 'g-sandbox', zh: '沙箱', sub: '隔离环境', group: 'object', body: '<rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><rect x="8.5" y="8.5" width="7" height="7" rx="1"/>' },
  { id: 'g-container', zh: '容器', group: 'object', body: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9"/>' },
  { id: 'g-secret', zh: '密钥', group: 'object', body: '<circle cx="8" cy="15.5" r="4"/><path d="M10.9 12.6L19.5 4M16 7.5l2.5 2.5M13.5 10l1.75 1.75"/>' },
  { id: 'g-lock', zh: '锁', group: 'object', body: '<rect x="5" y="11" width="14" height="9.5" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3M12 15v1.75"/>' },

  // —— 状态 ——
  { id: 'g-on', zh: '默认开', group: 'state', body: `${pill}<circle cx="16.5" cy="12" r="2.75" fill="currentColor" stroke="none"/>` },
  { id: 'g-off', zh: '默认关', group: 'state', body: `${pill}<circle cx="7.5" cy="12" r="2.5"/>` },
  { id: 'g-optional', zh: '可选', group: 'state', body: '<rect x="2.5" y="7" width="19" height="10" rx="5" stroke-dasharray="2.6 2.6"/><circle cx="12" cy="12" r="2.5"/>' },
  { id: 'g-done', zh: '已完成', group: 'state', body: `${ring}<path d="M8 12.3l2.8 2.8L16 9.5"/>` },
  { id: 'g-running', zh: '进行中', group: 'state', body: `${ring}${dot(8, 12)}${dot(12, 12)}${dot(16, 12)}` },
  { id: 'g-awaiting', zh: '等人决定', group: 'state', body: '<path d="M12 2.8l9.2 9.2-9.2 9.2L2.8 12z"/><path d="M10.2 9.5v5M13.8 9.5v5"/>' },
  { id: 'g-rejected', zh: '已拒绝', group: 'state', body: `${ring}<path d="M9 9l6 6M15 9l-6 6"/>` },
  { id: 'g-expired', zh: '已过期', group: 'state', body: '<circle cx="12" cy="12" r="8.5" stroke-dasharray="2.6 2.6"/><path d="M12 7.5V12l3 2"/>' },
  { id: 'g-error', zh: '出错', group: 'state', body: `<path d="M8.3 3.5h7.4l4.8 4.8v7.4l-4.8 4.8H8.3l-4.8-4.8V8.3z"/><path d="M12 8v5"/>${dot(12, 16.2)}` },
  { id: 'g-warning', zh: '警告', group: 'state', body: `<path d="M12 3.5l9.3 16H2.7z"/><path d="M12 10v4.5"/>${dot(12, 17)}` },
  { id: 'g-unknown', zh: '结果未知', group: 'state', body: `${ring}<path d="M9.6 9.7a2.5 2.5 0 1 1 3.7 2.2c-.8.45-1.3 1-1.3 1.9"/>${dot(12, 16.4)}` },
  { id: 'g-unverified', zh: '未核实', group: 'state', body: '<path d="M2.5 12h8"/><circle cx="15.5" cy="12" r="5"/>' },

  // —— 流程 ——
  { id: 'g-branch', zh: '分支', group: 'flow', body: '<path d="M3.5 12H8c4 0 3.5-6 7.5-6H20M8 12c4 0 3.5 6 7.5 6H20M17.5 3.5L20 6l-2.5 2.5M17.5 15.5L20 18l-2.5 2.5"/>' },
  { id: 'g-merge', zh: '合并', group: 'flow', body: '<path d="M3.5 6H6c4 0 3.5 6 7.5 6H20M3.5 18H6c4 0 3.5-6 7.5-6M17.5 9.5L20 12l-2.5 2.5"/>' },
  { id: 'g-loop', zh: '循环', group: 'flow', body: '<path d="M4 11.5v-1a4 4 0 0 1 4-4h12M17 3.5l3 3-3 3M20 12.5v1a4 4 0 0 1-4 4H4M7 20.5l-3-3 3-3"/>' },
  { id: 'g-retry', zh: '重试', group: 'flow', body: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M17.6 2.9v4h-4"/>' },
  { id: 'g-limit', zh: '上限', group: 'flow', body: '<path d="M4.5 4.5h15M12 20V9.5M8.5 13L12 9.5l3.5 3.5"/>' },
  { id: 'g-compress', zh: '压缩', group: 'flow', body: '<path d="M4.5 12h15M12 3v5.5M9.25 6L12 8.75 14.75 6M12 21v-5.5M9.25 18L12 15.25 14.75 18"/>' },
  { id: 'g-offload', zh: '外置', group: 'flow', body: '<path d="M11 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h5M9 12h11.5M17 8.5l3.5 3.5-3.5 3.5"/>' },
  { id: 'g-inject', zh: '注入', group: 'flow', body: '<path d="M13 5h5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5M3 12h11.5M11 8.5l3.5 3.5-3.5 3.5"/>' },
  { id: 'g-stream', zh: '流式', group: 'flow', body: '<path d="M3 9c3-3 6 3 9 0s6-3 9 0M3 15.5c3-3 6 3 9 0s6-3 9 0"/>' },
  { id: 'g-broadcast', zh: '广播', group: 'flow', body: `${dot(12, 12, 1.4)}<path d="M8.6 8.6a4.8 4.8 0 0 0 0 6.8M15.4 8.6a4.8 4.8 0 0 1 0 6.8M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8"/>` },
  { id: 'g-rollback', zh: '回滚', group: 'flow', body: '<path d="M4.5 5.5v13M20 12H8.5M12.5 8l-4 4 4 4"/>' },

  // —— 取值：工单清单之外补的一组，回答“有没有这个值” ——
  { id: 'g-zero', zh: '零', group: 'value', body: '<ellipse cx="12" cy="12" rx="4.75" ry="7.25"/>' },
  { id: 'g-missing', zh: '缺失', group: 'value', body: '<path d="M9 6H6v12h3M15 6h3v12h-3"/>' },
  { id: 'g-na', zh: '不适用', group: 'value', body: '<rect x="4.5" y="4.5" width="15" height="15" rx="2"/><path d="M8 16l8-8"/>' },
  { id: 'g-outside', zh: '范围外', group: 'value', body: '<path d="M5 4.5h5v15H5"/><circle cx="16.5" cy="12" r="2.5"/>' },

  // —— 位置：次序里的三种站点，加一个指向某一处的编号位 ——
  { id: 'g-passed', zh: '已过', group: 'place', body: `<path d="M2.5 12h19"/>${dot(12, 12, 3.5)}` },
  { id: 'g-current', zh: '当前', group: 'place', body: `<path d="M2.5 12h3.5M18 12h3.5"/><circle cx="12" cy="12" r="6"/>${dot(12, 12, 2.75)}` },
  { id: 'g-upcoming', zh: '未到', group: 'place', body: '<path d="M2.5 12h6M15.5 12h6"/><circle cx="12" cy="12" r="3.5"/>' },
  { id: 'g-anchor', zh: '指向', sub: '编号位', group: 'place', body: `<rect x="9.5" y="3" width="11.5" height="11.5" rx="2"/><path d="M9.5 14.5l-3.7 3.7"/>${dot(4.75, 19.25, 1.75)}` },
];

// 关系画法：端点和箭头是以原点为中心的 12 × 12 小件，线型是两个 class。
export const ENDS = [
  { id: 'g-end-solid', zh: '已确认', key: 'solid', body: '<circle r="3.25" fill="currentColor" stroke="none"/>' },
  { id: 'g-end-hollow', zh: '未确认', key: 'hollow', body: '<circle r="3.25" style="fill:var(--paper,#fff)"/>' },
  { id: 'g-end-cross', zh: '已拒绝', key: 'cross', body: '<path d="M-3-3l6 6M3-3l-6 6"/>' },
  { id: 'g-arrow', zh: '方向', key: 'arrow', body: '<path d="M-4.5-3.5L0 0l-4.5 3.5"/>' },
];

export const SYMBOL_ATTRS = 'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';

export const symbol = g => `<symbol id="${g.id}" viewBox="0 0 24 24" ${SYMBOL_ATTRS}><title>${g.zh}</title>${g.body}</symbol>`;
export const endSymbol = g => `<symbol id="${g.id}" viewBox="-6 -6 12 12" overflow="visible" ${SYMBOL_ATTRS}><title>${g.zh}</title>${g.body}</symbol>`;

// 线型的两条规则；tokens.css 里有同样的一份。
export const GLYPH_CSS = `.g-line{fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round}
.g-line--pending{stroke-dasharray:5 4}`;

export const defs = (ids) => {
  const pick = ids ? GLYPHS.filter(g => ids.includes(g.id)) : GLYPHS;
  return pick.map(symbol).join('\n') + '\n' + ENDS.map(endSymbol).join('\n');
};
