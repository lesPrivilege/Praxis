// 成立程度与归属：四个件共用的一套词和画法。
// 一个通道只回答一个问题，归属写成字、不占通道。
//   线型 —— 生效了吗：实线是已经成立，虚线是尚未成立或没有生效
//   端点 —— 确认了吗：实心是已确认，空心是未确认，叉是已拒绝，没有端点是还不存在
//   蓝色 —— 只标还等人决定的那一处

import { need } from './kernel.mjs';

export const WHO = { human: '人', machine: '机器', rule: '规则', record: '记录', context: '上下文' };

export const STANDING = {
  established: { word: '已成立', line: 'solid', end: 'filled' },
  recorded: { word: '已记录', line: 'solid', end: 'filled' },
  decided: { word: '已作出', line: 'solid', end: 'filled' },
  verified: { word: '已核对', line: 'solid', end: 'filled' },
  inferred: { word: '推断，未核对', line: 'solid', end: 'hollow' },
  pending: { word: '尚未成立', line: 'dashed', end: 'hollow' },
  proposed: { word: '未生效', line: 'dashed', end: 'hollow' },
  rejected: { word: '已拒绝', line: 'dashed', end: 'cross' },
  open: { word: '待定', line: 'dashed', end: 'hollow', accent: true },
  none: { word: '尚无', line: 'dashed', end: 'none' },
};

// 没写的不猜，写错的不当成“已成立”。
export function standing(value, allowed, what) {
  need(allowed.includes(value), 'state', `${what}的状态只能是 ${allowed.join('、')}：${JSON.stringify(value)}`);
  return STANDING[value];
}

export function who(value, what) {
  need(value == null || Object.hasOwn(WHO, value), 'origin', `${what}的归属只能是 ${Object.keys(WHO).join('、')}：${JSON.stringify(value)}`);
  return value == null ? null : WHO[value];
}

// 图例只列这张图里实际出现的画法；一个通道只出现一种画法时不必解释。
export const LEGEND = [
  { channel: 'line', mark: 'solid', word: '已经成立' },
  { channel: 'line', mark: 'dashed', word: '尚未成立或没有生效' },
  { channel: 'end', mark: 'filled', word: '已确认' },
  { channel: 'end', mark: 'hollow', word: '未确认' },
  { channel: 'end', mark: 'cross', word: '已拒绝' },
  { channel: 'accent', mark: 'accent', word: '等人决定' },
];
