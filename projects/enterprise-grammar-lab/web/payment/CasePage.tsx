// One payment review case. The review tab keeps three kinds of statement apart:
// what the rules found, what a machine suggested, and what people decided.
import { Alert, Breadcrumb, Flex, Table, Tabs, Tag, Typography } from 'antd';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router';
import { AuditTimeline } from '../workbench/AuditTimeline.tsx';
import { formatDateTime, relativeDays } from '../workbench/format.ts';
import { EmptyNote, Loaded } from '../workbench/Loaded.tsx';
import { ObjectHeader } from '../workbench/ObjectHeader.tsx';
import { useCase, useChecks, useEvents, useProposal, useRefreshCase } from './api.ts';
import type { S } from './api.ts';
import { CaseActions } from './CaseActions.tsx';
import { EvidenceDrawer, EvidenceLink } from './EvidenceDrawer.tsx';
import { AUDIT, CASE_STATUS, CONCLUSION, FILE_KIND, NEXT_STEP, OUTCOME, PROPOSAL_USE, RECORD_KIND, SUGGESTION } from './labels.ts';
import { formatMoney } from './money.ts';
import { casePath, evidenceSearch } from './routes.ts';
import type { Tab } from './routes.ts';

const TAB_LABEL: Record<Tab, string> = { review: '复核', files: '材料', activity: '记录' };
const OUTCOME_COLOR: Record<S['CheckResult']['outcome'], string | undefined> = { pass: 'success', fail: 'error', unknown: 'warning', conflict: 'warning' };

const basisText = (basis: S['BasisVersion'][]) =>
  basis.map((b) => `${b.title} 第 ${b.version} 版${b.current ? '' : '（已有新版本）'}`).join('、');

export function CasePage() {
  const { caseId = '', tab = 'review' } = useParams() as { caseId: string; tab?: Tab };
  const query = useCase(caseId);
  const refresh = useRefreshCase(caseId);
  const navigate = useNavigate();
  if (!Object.hasOwn(TAB_LABEL, tab)) return <Navigate to={casePath(caseId)} replace />;
  return (
    <Flex vertical gap={16}>
      <Breadcrumb
        items={[
          { title: <Link to="/reviews">复核事项</Link> },
          { title: tab === 'review' ? caseId : <Link to={casePath(caseId)}>{caseId}</Link> },
          ...(tab === 'review' ? [] : [{ title: TAB_LABEL[tab] }]),
        ]}
      />
      <Loaded query={query} what={`复核事项 ${caseId}`}>
        {(item) => (
          <>
            <ObjectHeader
              kind="复核事项"
              id={item.id}
              title={item.title}
              version={item.version}
              fetchedAt={query.dataUpdatedAt}
              refreshing={query.isFetching}
              onRefresh={refresh}
              tags={
                <>
                  <Tag>{CASE_STATUS[item.status]}</Tag>
                  <Tag>发票金额 {item.amount ? formatMoney(item.amount) : '未知，尚无发票'}</Tag>
                  {item.dueDate && (
                    <Tag>
                      申请期限 {item.dueDate}，{relativeDays(item.dueDate)}
                    </Tag>
                  )}
                </>
              }
            />
            <Typography.Text>
              <Typography.Text type="secondary">下一步　</Typography.Text>
              {item.next.owner && `${item.next.owner.name}：`}
              {item.next.step === 'submit' && !item.next.owner && '复核员（尚未指定）：'}
              {NEXT_STEP[item.next.step]}
            </Typography.Text>
            {item.needsRecheck && (
              <Alert
                type="warning"
                showIcon
                title="提交之后材料有了新版本"
                description={`上一次提交依据的是：${basisText(item.records.findLast((r) => r.kind === 'submission')?.basis ?? [])}。原记录没有改动；新版本要由复核员重新提交之后才能接受。`}
              />
            )}
            <Tabs
              activeKey={tab}
              onChange={(key) => navigate(casePath(item.id, key as Tab))}
              items={[
                { key: 'review', label: TAB_LABEL.review, children: <ReviewPanel key={item.id} item={item} /> },
                { key: 'files', label: `${TAB_LABEL.files} ${item.files.length}`, children: <FilesPanel item={item} /> },
                { key: 'activity', label: TAB_LABEL.activity, children: <ActivityPanel caseId={item.id} /> },
              ]}
            />
            <EvidenceDrawer caseId={item.id} />
          </>
        )}
      </Loaded>
    </Flex>
  );
}

function ReviewPanel({ item }: { item: S['Case'] }) {
  return (
    <div className="columns columns-even">
      <section>
        <Typography.Title level={5}>规则检查</Typography.Title>
        <Typography.Paragraph type="secondary">由固定规则对材料的当前版本逐项核对。规则是为演练写的，不是法律或财务结论。</Typography.Paragraph>
        <ChecksPanel caseId={item.id} />
      </section>
      <Flex vertical gap={24}>
        <section>
          <Typography.Title level={5}>机器提议</Typography.Title>
          <ProposalPanel item={item} />
        </section>
        <section>
          <Typography.Title level={5}>人的判断 {item.records.length}</Typography.Title>
          <Records records={item.records} />
        </section>
        <section>
          <Typography.Title level={5}>动作</Typography.Title>
          <CaseActions item={item} />
        </section>
      </Flex>
    </div>
  );
}

function ChecksPanel({ caseId }: { caseId: string }) {
  const checks = useChecks(caseId);
  return (
    <Loaded query={checks} what="检查结果">
      {(list) => (
        <ul className="plain-list rows">
          {list.map((check) => (
            <li key={check.rule}>
              <div>
                <Tag color={OUTCOME_COLOR[check.outcome]}>{OUTCOME[check.outcome]}</Tag>
                <Typography.Text strong>{check.title}</Typography.Text>{' '}
                <Typography.Text type="secondary">
                  规则 {check.rule} 第 {check.ruleVersion} 版
                </Typography.Text>
              </div>
              <div>{check.detail}</div>
              {check.conflict && (
                <Table
                  size="small"
                  pagination={false}
                  rowKey={(value) => value.ref.fileId}
                  dataSource={check.conflict.values}
                  title={() => `两处对“${check.conflict!.field}”的写法不同`}
                  columns={[
                    { title: '写法', dataIndex: 'display' },
                    { title: '出处', render: (_, value) => <EvidenceLink evidence={value.ref} /> },
                  ]}
                />
              )}
              {check.missing.map((gap) => (
                <div key={gap.what}>
                  <Typography.Text strong>缺：</Typography.Text>
                  {gap.what}。由{gap.supplier}补。
                </div>
              ))}
              {check.basis.length > 0 && (
                <div>
                  <Typography.Text type="secondary">依据　</Typography.Text>
                  {check.basis.map((evidence, index) => (
                    <span key={`${evidence.fileId}:${evidence.key}`}>
                      {index > 0 && '；'}
                      <EvidenceLink evidence={evidence} />
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </Loaded>
  );
}

function ProposalPanel({ item }: { item: S['Case'] }) {
  const exists = !item.submission.proposalUses.includes('none');
  const proposal = useProposal(item.id, exists);
  if (!exists) return <Typography.Text type="secondary">这个事项没有机器提议。</Typography.Text>;
  return (
    <Loaded query={proposal} what="机器提议">
      {(p) => (
        <div className="machine">
          <div>
            <Tag>机器生成，未经人确认</Tag>
            <Typography.Text strong>{SUGGESTION[p.suggestion]}</Typography.Text>
          </div>
          <div>{p.text}</div>
          <Typography.Text type="secondary">
            {formatDateTime(p.generatedAt)} 生成 · 基于 {basisText(p.basis)}
          </Typography.Text>
          {!p.current && <Alert type="warning" showIcon title="这份提议基于旧版本的材料" description="材料更新之后它没有重新生成，内容可能已经不成立。" />}
          <Typography.Text type="secondary">它不改变事项的状态，也不替代规则检查。采纳、修正还是不采纳，在提交时由复核员写明。</Typography.Text>
        </div>
      )}
    </Loaded>
  );
}

function Records({ records }: { records: S['ReviewRecord'][] }) {
  if (records.length === 0) return <Typography.Text type="secondary">还没有人提交或决定。</Typography.Text>;
  return (
    <ol className="plain-list rows">
      {records.map((record) => (
        <li key={record.attemptId}>
          <div>
            <Typography.Text strong>{RECORD_KIND[record.kind]}</Typography.Text>{' '}
            <Typography.Text type="secondary">
              {record.by.name} · {formatDateTime(record.at)} · 事项第 {record.caseVersion} 版
            </Typography.Text>
          </div>
          {record.explanation ? <div>{record.explanation}</div> : record.kind === 'submission' && <Typography.Text type="secondary">提交人没有另写说明。</Typography.Text>}
          {/* The conclusion is the rules' result at that moment, carried with the submission; it is not the person's own statement. */}
          {record.conclusion && <Typography.Text type="secondary">提交时的检查结论（规则得出）：{CONCLUSION[record.conclusion]}</Typography.Text>}
          {record.proposalUse && record.proposalUse !== 'none' && (
            <Typography.Text type="secondary">
              {PROPOSAL_USE[record.proposalUse]}
              {record.proposalId && ` ${record.proposalId}`}
            </Typography.Text>
          )}
          {record.basis && <Typography.Text type="secondary">依据 {basisText(record.basis)}</Typography.Text>}
        </li>
      ))}
    </ol>
  );
}

function FilesPanel({ item }: { item: S['Case'] }) {
  return (
    <Table<S['CaseFile']>
      size="small"
      rowKey="id"
      pagination={false}
      dataSource={item.files}
      scroll={{ x: 'max-content' }}
      locale={{ emptyText: <EmptyNote>这个事项还没有收到材料。</EmptyNote> }}
      columns={[
        { title: '编号', dataIndex: 'id', width: 88 },
        { title: '材料', render: (_, f) => <Link to={{ search: evidenceSearch({ fileId: f.id, version: f.version }) }}>{f.title}</Link> },
        { title: '类型', render: (_, f) => FILE_KIND[f.kind] },
        { title: '当前版本', render: (_, f) => `第 ${f.version} 版` },
        { title: '收到日期', dataIndex: 'receivedAt' },
        { title: '来源', dataIndex: 'source' },
      ]}
    />
  );
}

function ActivityPanel({ caseId }: { caseId: string }) {
  const events = useEvents(caseId);
  const [params] = useSearchParams();
  const attempt = params.get('attempt');
  return (
    <Flex vertical gap={12}>
      {attempt && (
        <Typography.Text>
          标出的是尝试 <Typography.Text code>{attempt}</Typography.Text> 留下的记录。<Link to={casePath(caseId, 'activity')}>取消标出</Link>
        </Typography.Text>
      )}
      <Loaded query={events} what="记录" isEmpty={(list) => list.length === 0} empty={<EmptyNote>这个事项还没有记录。</EmptyNote>}>
        {(list) => (
          <AuditTimeline
            events={list}
            labels={AUDIT}
            highlightAttempt={attempt}
            renderTarget={(target) =>
              target.kind === 'file' ? (
                <>
                  <Link to={casePath(caseId, 'files')}>{target.title}</Link> <Typography.Text type="secondary">{target.id}</Typography.Text>
                </>
              ) : (
                <>
                  {target.title} <Typography.Text type="secondary">{target.id}</Typography.Text>
                </>
              )
            }
          />
        )}
      </Loaded>
    </Flex>
  );
}
