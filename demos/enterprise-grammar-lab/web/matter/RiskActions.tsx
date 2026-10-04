// The three things that can be done with a risk. The shared ActionPanel owns the mechanics
// (version binding, attempt outcome, leaving with unsent input); this file owns the fields.
import { Button, Checkbox, Form, Input, Radio, Typography } from 'antd';
import { Link } from 'react-router';
import { ActionPanel } from '../workbench/ActionPanel.tsx';
import { useDecideRisk, useProposeRiskDisposition, useReturnRiskProposal } from './api.ts';
import type { S } from './api.ts';
import { ACTION, DISPOSITION } from './labels.ts';
import { attemptPath, matterPath } from './routes.ts';

interface FormValues {
  disposition: S['Disposition'];
  citedEvidenceIds: string[];
  rationale: string;
}

const DISPOSITION_HELP: Record<S['Disposition'], string> = {
  accept: '不另作安排',
  mitigate: '决定后产生一项落实措施的任务',
  escalate: '决定后产生一项向委托人报告的任务',
};

export function RiskActions({ matterId, risk }: { matterId: string; risk: S['Risk'] }) {
  const propose = useProposeRiskDisposition();
  const decide = useDecideRisk();
  const giveBack = useReturnRiskProposal();
  // Only a proposal still awaiting decision can be taken over; a returned one is history.
  const proposal = risk.status === 'proposed' ? risk.records.findLast((r) => r.kind === 'proposal') : undefined;

  const dispositionFields = (
    <>
      <Form.Item name="disposition" label="处置方式" rules={[{ required: true, message: '选择一种处置方式。' }]}>
        <Radio.Group
          vertical
          options={(Object.keys(DISPOSITION) as S['Disposition'][]).map((value) => ({
            value,
            label: (
              <>
                {DISPOSITION[value]}
                <Typography.Text type="secondary">　{DISPOSITION_HELP[value]}</Typography.Text>
              </>
            ),
          }))}
        />
      </Form.Item>
      <Form.Item name="citedEvidenceIds" label="引用的依据" rules={[{ required: true, message: '至少引用一项依据。' }]}>
        <Checkbox.Group className="stack">
          {risk.evidence.map(({ item }) => {
            const usable = item.basisCurrent && !item.restricted;
            return (
              <Checkbox key={item.id} value={item.id} disabled={!usable}>
                {item.id} {item.document.title} 第 {item.documentVersion} 版
                {item.locator && ` · ${item.locator}`}
                {!item.basisCurrent && <Typography.Text type="secondary">　不能引用：文书已到第 {item.document.version} 版</Typography.Text>}
                {item.restricted && <Typography.Text type="secondary">　不能引用：你无权阅读</Typography.Text>}
              </Checkbox>
            );
          })}
        </Checkbox.Group>
      </Form.Item>
    </>
  );
  const rationaleField = (label: string) => (
    <Form.Item name="rationale" label={label} rules={[{ required: true, whitespace: true, message: '写明理由。' }]}>
      <Input.TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
    </Form.Item>
  );
  const dispositionInput = (values: FormValues, expectedVersion: number): S['DispositionInput'] => ({
    riskId: risk.id,
    expectedVersion,
    disposition: values.disposition,
    rationale: values.rationale.trim(),
    citedEvidenceIds: values.citedEvidenceIds,
  });

  return (
    <ActionPanel
      target={risk.id}
      version={risk.version}
      actions={risk.actions}
      labels={ACTION}
      primary={risk.actions.some((a) => a.type === 'decide-risk' && a.allowed) ? 'decide-risk' : 'propose-risk-disposition'}
      specs={{
        'propose-risk-disposition': {
          attempt: propose,
          fields: () => (
            <>
              {dispositionFields}
              {rationaleField('理由')}
            </>
          ),
          submit: (values: FormValues, version) => propose.submit(dispositionInput(values, version)),
        },
        'decide-risk': {
          attempt: decide,
          fields: (fill) => (
            <>
              {proposal?.disposition && (
                <Form.Item>
                  <Button
                    onClick={() =>
                      fill({
                        disposition: proposal.disposition,
                        citedEvidenceIds: proposal.cited?.filter((c) => c.basisCurrent).map((c) => c.evidenceId),
                      })
                    }
                  >
                    带入{proposal.by.name}建议的处置方式和依据
                  </Button>
                </Form.Item>
              )}
              {dispositionFields}
              {rationaleField('理由')}
            </>
          ),
          submit: (values: FormValues, version) => decide.submit(dispositionInput(values, version)),
        },
        'return-risk-proposal': {
          attempt: giveBack,
          fields: () => rationaleField('退回理由'),
          submit: (values: FormValues, version) =>
            giveBack.submit({ riskId: risk.id, expectedVersion: version, rationale: values.rationale.trim() }),
        },
      }}
      applied={(result, attemptId) => (
        <>
          <div>
            {risk.id} 现在是第 {result.targetVersion} 版。<Link to={attemptPath(matterId, attemptId)}>查看这次动作留下的记录</Link>
          </div>
          {result.created.map((task) => (
            <div key={task.id}>
              产生了任务：<Link to={matterPath(matterId, 'tasks')}>{task.title}</Link>
            </div>
          ))}
        </>
      )}
    />
  );
}
