// Words this scenario uses for the contract's values. A second domain brings its own file.
import type { S } from './api.ts';
import type { AuditLabels } from '../workbench/AuditTimeline.tsx';

export const ROLE: Record<S['Role'], string> = { partner: '合伙人', associate: '主办律师', paralegal: '律师助理' };
export const STAGE: Record<S['MatterStage'], string> = { intake: '接案', pleading: '立案答辩', evidence: '举证', hearing: '庭审', enforcement: '执行' };
export const MATTER_STATUS: Record<S['MatterStatus'], string> = { active: '进行中', 'on-hold': '中止', closed: '已结案' };
export const SORT: Record<S['MatterSort'], string> = {
  deadline: '期限由近到远',
  '-deadline': '期限由远到近',
  '-updatedAt': '最近更新在前',
  updatedAt: '最早更新在前',
};
export const SEVERITY: Record<S['Severity'], string> = { high: '高', medium: '中', low: '低' };
export const RISK_STATUS: Record<S['RiskStatus'], string> = { open: '待处置', proposed: '已有建议，待决定', decided: '已决定' };
export const DISPOSITION: Record<S['Disposition'], string> = { accept: '接受风险', mitigate: '采取措施', escalate: '上报委托人' };
export const STANCE: Record<S['Stance'], string> = { supports: '支持', refutes: '反驳', limits: '限制' };
export const CATEGORY: Record<S['RiskFields']['category'], string> = { limitation: '时效', evidence: '证据', performance: '履约', procedure: '程序' };
export const DOCUMENT_KIND: Record<S['Document']['kind'], string> = { contract: '合同', correspondence: '函件', exhibit: '证据材料', pleading: '诉讼文书', memo: '内部备忘' };
export const PARTY_ROLE: Record<S['Party']['role'], string> = { client: '委托人', counterparty: '对方当事人', 'opposing-counsel': '对方代理人', court: '法院' };
export const TASK_KIND: Record<S['Task']['kind'], string> = { review: '复核', 'follow-up': '后续', filing: '提交' };
export const TASK_STATUS: Record<S['Task']['status'], string> = { open: '未完成', done: '已完成' };
export const ACTION: Record<S['ActionType'], string> = {
  'propose-risk-disposition': '提出处置建议',
  'decide-risk': '作出决定',
  'return-risk-proposal': '退回建议',
  'assign-reviewer': '指派复核人',
};
export const RECORD_KIND: Record<S['DispositionRecord']['kind'], string> = { proposal: '建议', decision: '决定', return: '退回' };
export const NEXT_STEP: Record<NonNullable<S['Risk']['next']>['step'], string> = {
  propose: '提出处置建议',
  decide: '作出决定',
  redecide: '重新核对并决定',
};
export const SEARCH_KIND: Record<S['SearchHit']['kind'], string> = { matter: '事项', risk: '风险' };

const AUDIT_TYPE: Record<S['AuditEventType'], string> = {
    'matter-opened': '建立事项',
    'document-received': '收到文书',
    'document-version-added': '登记文书新版本',
    'evidence-registered': '登记依据',
    'risk-registered': '登记风险',
    'disposition-proposed': '提出处置建议',
    'proposal-returned': '退回建议',
    'risk-decided': '决定处置',
    'reviewer-assigned': '指派复核人',
    'task-created': '产生任务',
  };
export const AUDIT: AuditLabels = {
  type: AUDIT_TYPE,
  field: { status: '状态', disposition: '处置', reviewer: '复核人', version: '版本' },
  value: { ...RISK_STATUS, ...DISPOSITION },
};
