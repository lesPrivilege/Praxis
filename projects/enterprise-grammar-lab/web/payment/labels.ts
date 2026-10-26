// Words this scenario uses for its contract's values.
import type { AuditLabels } from '../workbench/AuditTimeline.tsx';
import type { S } from './api.ts';

export const ROLE: Record<S['Role'], string> = { reviewer: '复核员', lead: '复核负责人', observer: '观察员' };
// The last state means the review material was accepted. It never means the payment was made, and the label says so wherever it appears.
export const CASE_STATUS: Record<S['CaseStatus'], string> = { 'needs-material': '待补件', ready: '可提交', 'in-review': '待复核', decided: '材料已接受，未付款' };
export const SORT: Record<S['CaseSort'], string> = {
  dueDate: '期限由近到远',
  '-dueDate': '期限由远到近',
  '-updatedAt': '最近更新在前',
  updatedAt: '最早更新在前',
};
export const OUTCOME: Record<S['CheckResult']['outcome'], string> = { pass: '通过', fail: '未通过', unknown: '无法判断', conflict: '依据冲突' };
export const FILE_KIND: Record<S['FileKind'], string> = { contract: '合同', terms: '付款条件', supplement: '补充协议', invoice: '发票', acceptance: '验收' };
export const SUGGESTION: Record<S['Proposal']['suggestion'], string> = {
  submit: '建议提交复核',
  'submit-as-exception': '建议作为例外提交',
  'request-material': '建议先补材料',
};
// What the rules found at the moment of submission. It is the rules' result, not the person's opinion.
export const CONCLUSION: Record<S['Case']['submission']['conclusion'], string> = { sufficient: '三项检查全部通过', exception: '有检查未通过，作为例外提交' };
export const PROPOSAL_USE: Record<S['ProposalUse'], string> = { adopted: '采纳机器提议', amended: '修正后采纳', rejected: '不采纳机器提议', none: '没有机器提议' };
export const RECORD_KIND: Record<S['ReviewRecord']['kind'], string> = { submission: '提交复核', return: '退回', acceptance: '接受复核材料' };
export const ACTION: Record<S['ActionType'], string> = { 'submit-for-review': '提交复核', 'accept-review': '接受复核材料', 'return-review': '退回' };
export const NEXT_STEP: Record<S['Case']['next']['step'], string> = {
  'supply-material': '补齐材料，由谁补见各项检查',
  submit: '提交复核',
  decide: '接受或退回',
  recheck: '材料有了新版本，退回后重新提交',
  'pay-elsewhere': '付款由财务另行发起，不在本工作台',
};

const AUDIT_TYPE: Record<S['AuditEventType'], string> = {
  'case-opened': '建立复核事项',
  'file-received': '收到材料',
  'file-version-added': '登记材料新版本',
  'review-submitted': '提交复核',
  'review-returned': '退回',
  'review-accepted': '接受复核材料',
};
export const AUDIT: AuditLabels = { type: AUDIT_TYPE, field: { status: '状态', version: '版本' }, value: CASE_STATUS };
