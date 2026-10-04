// The three things that can be done with a case. The shared ActionPanel owns the mechanics;
// this file owns the fields, and shows what a submission will carry before it is made.
import { Button, Descriptions, Form, Input, Radio, Typography } from 'antd';
import { Link } from 'react-router';
import { ActionPanel } from '../workbench/ActionPanel.tsx';
import { useAcceptReview, useProposal, useReturnReview, useSubmitForReview } from './api.ts';
import type { S } from './api.ts';
import { ACTION, CONCLUSION, PROPOSAL_USE } from './labels.ts';
import { attemptPath } from './routes.ts';

export function CaseActions({ item }: { item: S['Case'] }) {
  const submit = useSubmitForReview();
  const accept = useAcceptReview();
  const giveBack = useReturnReview();
  const { submission } = item;
  // The backend says what may be said about the machine proposal; ["none"] means there is none.
  const uses = submission.proposalUses.filter((use) => use !== 'none');
  const proposal = useProposal(item.id, uses.length > 0);

  return (
    <ActionPanel
      target={item.id}
      version={item.version}
      actions={item.actions}
      labels={ACTION}
      primary={item.actions.some((a) => a.type === 'accept-review' && a.allowed) ? 'accept-review' : 'submit-for-review'}
      specs={{
        'submit-for-review': {
          attempt: submit,
          fields: (fill) => (
            <>
              <Descriptions
                size="small"
                column={1}
                className="submission-summary"
                items={[
                  { key: 'conclusion', label: '检查结论', children: `${CONCLUSION[submission.conclusion]}。由规则得出，随提交一并记录` },
                  { key: 'basis', label: '所依据的材料', children: submission.basis.map((b) => `${b.title} 第 ${b.version} 版`).join('、') },
                  { key: 'receiver', label: '接收人', children: submission.receiver.name },
                ]}
              />
              {uses.length > 0 && (
                <Form.Item
                  name="proposalUse"
                  label="对机器提议的处置"
                  rules={[{ required: true, message: '说明你对机器提议的处置。' }]}
                  extra={uses.includes('adopted') ? undefined : '这份提议基于旧版本的材料，或与检查结果不一致，不能原样采纳。'}
                >
                  <Radio.Group vertical options={uses.map((value) => ({ value, label: PROPOSAL_USE[value] }))} />
                </Form.Item>
              )}
              {proposal.data?.current && (
                <Form.Item extra="带入之后这段文字就是你的说明，记录里会注明你对机器提议的处置。">
                  <Button onClick={() => fill({ explanation: proposal.data.text })}>把机器提议的文字带入说明</Button>
                </Form.Item>
              )}
              <Form.Item
                name="explanation"
                label="说明"
                rules={submission.explanationRequired ? [{ required: true, whitespace: true, message: '有未通过的检查，写明作为例外提交的理由。' }] : []}
              >
                <Input.TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
              </Form.Item>
            </>
          ),
          submit: (values: { explanation?: string; proposalUse?: S['ProposalUse'] }, version) =>
            submit.submit({
              caseId: item.id,
              expectedVersion: version,
              explanation: values.explanation?.trim() ?? '',
              proposalUse: values.proposalUse ?? 'none',
            }),
        },
        'accept-review': {
          attempt: accept,
          fields: () => (
            <>
              <Typography.Paragraph>接受的是这份复核材料。付款由财务另行发起，这里不会发起付款。</Typography.Paragraph>
              <Form.Item name="note" label="备注（可不填）">
                <Input.TextArea autoSize={{ minRows: 2, maxRows: 8 }} />
              </Form.Item>
            </>
          ),
          submit: (values: { note?: string }, version) => accept.submit({ caseId: item.id, expectedVersion: version, note: values.note?.trim() || undefined }),
        },
        'return-review': {
          attempt: giveBack,
          fields: () => (
            <Form.Item name="reason" label="退回理由" rules={[{ required: true, whitespace: true, message: '写明退回理由。' }]}>
              <Input.TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
            </Form.Item>
          ),
          submit: (values: { reason: string }, version) => giveBack.submit({ caseId: item.id, expectedVersion: version, reason: values.reason.trim() }),
        },
      }}
      applied={(result, attemptId) => (
        <div>
          {item.id} 现在是第 {result.targetVersion} 版。<Link to={attemptPath(item.id, attemptId)}>查看这次动作留下的记录</Link>
        </div>
      )}
    />
  );
}
