// Risks of a matter: the list on one side, the selected risk with its evidence, records and actions on the other.
import { Alert, Flex, Tag, Typography } from 'antd';
import { Link, NavLink } from 'react-router';
import type { S } from './api.ts';
import { useRisk, useRisks } from './api.ts';
import { formatDateTime } from '../workbench/format.ts';
import { EmptyNote, Loaded } from '../workbench/Loaded.tsx';
import { ObjectHeader } from '../workbench/ObjectHeader.tsx';
import { CATEGORY, DISPOSITION, NEXT_STEP, RECORD_KIND, RISK_STATUS, SEVERITY, STANCE } from './labels.ts';
import { EvidenceBasis } from './EvidenceBasis.tsx';
import { RiskActions } from './RiskActions.tsx';
import { matterPath, riskPath } from './routes.ts';

export function RiskStatusLine({ risk }: { risk: S['RiskSummary'] }) {
  return (
    <Typography.Text type="secondary">
      严重程度 {risk.severity === 'high' ? <Tag color="error">高</Tag> : SEVERITY[risk.severity]}
      {' · '}
      {RISK_STATUS[risk.status]}
      {risk.disposition && `：${DISPOSITION[risk.disposition]}`}
      {risk.needsRecheck && <Tag color="warning" className="tag-after">需重新核对</Tag>}
    </Typography.Text>
  );
}

export function RisksPanel({ matterId, riskId }: { matterId: string; riskId?: string }) {
  const risks = useRisks(matterId);
  return (
    <div className="split" data-detail={riskId ? 'open' : 'closed'}>
      <nav aria-label="风险列表" className="split-list">
        <Loaded query={risks} what="风险列表" isEmpty={(list) => list.length === 0} empty={<EmptyNote>这个事项还没有登记风险。</EmptyNote>}>
          {(list) => (
            <ul className="plain-list rows">
              {list.map((r) => (
                <li key={r.id}>
                  <NavLink to={riskPath(matterId, r.id)} className={({ isActive }) => (isActive ? 'row-link row-link-current' : 'row-link')}>
                    <span>{r.title}</span>
                    <RiskStatusLine risk={r} />
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </Loaded>
      </nav>
      <div className="split-detail">
        {riskId ? (
          <>
            <Link to={matterPath(matterId, 'risks')} className="split-back">
              返回风险列表
            </Link>
            <RiskDetail key={riskId} matterId={matterId} riskId={riskId} />
          </>
        ) : (
          <Typography.Text type="secondary">从列表里选一项风险，查看它的依据、处置记录和可做的动作。</Typography.Text>
        )}
      </div>
    </div>
  );
}

function RiskDetail({ matterId, riskId }: { matterId: string; riskId: string }) {
  const query = useRisk(riskId);
  return (
    <Loaded query={query} what={`风险 ${riskId}`}>
      {(risk) => {
        if (risk.matterId !== matterId) {
          return (
            <Alert
              type="warning"
              showIcon
              title={`${risk.id} 不属于事项 ${matterId}`}
              description={
                <>
                  它属于 <Link to={riskPath(risk.matterId, risk.id)}>{risk.matterId} {risk.matterTitle}</Link>。
                </>
              }
            />
          );
        }
        const standing = risk.records.findLast((r) => r.kind === (risk.status === 'decided' ? 'decision' : 'proposal'));
        const outdated = (standing?.cited ?? []).filter((c) => !c.basisCurrent);
        return (
          <Flex vertical gap={20}>
            <ObjectHeader
              level={2}
              kind="风险"
              id={risk.id}
              title={risk.title}
              version={risk.version}
              fetchedAt={query.dataUpdatedAt}
              refreshing={query.isFetching}
              onRefresh={() => void query.refetch()}
              tags={
                <>
                  <Tag color={risk.severity === 'high' ? 'error' : undefined}>严重程度 {SEVERITY[risk.severity]}</Tag>
                  <Tag>{CATEGORY[risk.category]}</Tag>
                  <Tag>
                    {RISK_STATUS[risk.status]}
                    {risk.disposition && `：${DISPOSITION[risk.disposition]}`}
                  </Tag>
                </>
              }
            />
            {risk.needsRecheck && standing && (
              <Alert
                type="warning"
                showIcon
                title="需重新核对"
                description={`现有的${RECORD_KIND[standing.kind]}引用了 ${outdated.map((c) => `${c.evidenceId}（文书第 ${c.documentVersion} 版）`).join('、')}，文书之后有了新版本。原记录没有改动；新版本是否改变结论，需要有人重新看一遍。`}
              />
            )}
            <Typography.Paragraph className="statement">{risk.statement}</Typography.Paragraph>
            <Typography.Text>
              <Typography.Text type="secondary">下一步　</Typography.Text>
              {risk.next
                ? `${risk.next.owner ? risk.next.owner.name : '复核人（尚未指派）'}${NEXT_STEP[risk.next.step]}`
                : '没有待办，这项风险已经决定'}
            </Typography.Text>

            <section>
              <Typography.Title level={5}>依据 {risk.evidence.length}</Typography.Title>
              {risk.evidence.length === 0 ? (
                <EmptyNote>这项风险还没有关联依据。没有依据就不能提出建议或作出决定。</EmptyNote>
              ) : (
                <ul className="plain-list rows">
                  {risk.evidence.map(({ stance, item }) => (
                    <li key={item.id}>
                      <div>
                        <Tag>{STANCE[stance]}</Tag>
                        <Typography.Text code>{item.id}</Typography.Text> <EvidenceBasis evidence={item} />
                        {item.locator && ` · ${item.locator}`}
                      </div>
                      {item.restricted ? (
                        <Typography.Text type="secondary">特权文书。你可以知道有这项依据，但无权阅读内容。</Typography.Text>
                      ) : (
                        <blockquote className="excerpt">{item.excerpt}</blockquote>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <Typography.Title level={5}>处置记录 {risk.records.length}</Typography.Title>
              {risk.records.length === 0 ? (
                <Typography.Text type="secondary">还没有人提出建议或作出决定。</Typography.Text>
              ) : (
                <ol className="plain-list rows">
                  {risk.records.map((record) => (
                    <li key={record.attemptId}>
                      <div>
                        <Typography.Text strong>
                          {RECORD_KIND[record.kind]}
                          {record.disposition && `：${DISPOSITION[record.disposition]}`}
                        </Typography.Text>{' '}
                        <Typography.Text type="secondary">
                          {record.by.name} · {formatDateTime(record.at)}
                        </Typography.Text>
                      </div>
                      {record.rationale && <div>{record.rationale}</div>}
                      {record.cited && (
                        <Typography.Text type="secondary">
                          引用{' '}
                          {record.cited.map((c) => `${c.evidenceId}（第 ${c.documentVersion} 版${c.basisCurrent ? '' : '，已落后'}）`).join('、')}
                        </Typography.Text>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </section>

            <section>
              <Typography.Title level={5}>动作</Typography.Title>
              <RiskActions matterId={matterId} risk={risk} />
            </section>
          </Flex>
        );
      }}
    </Loaded>
  );
}
