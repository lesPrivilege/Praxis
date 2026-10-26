// One matter and the objects linked to it. Each tab is a projection of the same object,
// loads on its own and fails on its own.
import { Breadcrumb, Descriptions, Flex, Table, Tabs, Tag, Typography } from 'antd';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router';
import type { S } from './api.ts';
import { useDocuments, useEvents, useEvidence, useMatter, useParties, useRefreshMatter, useRisks, useTasks } from './api.ts';
import { AuditTimeline } from '../workbench/AuditTimeline.tsx';
import { relativeDays } from '../workbench/format.ts';
import { EmptyNote, Loaded } from '../workbench/Loaded.tsx';
import { ObjectHeader } from '../workbench/ObjectHeader.tsx';
import { EvidenceBasis } from './EvidenceBasis.tsx';
import { AUDIT, DOCUMENT_KIND, MATTER_STATUS, PARTY_ROLE, STAGE, STANCE, TASK_KIND, TASK_STATUS } from './labels.ts';
import { RisksPanel, RiskStatusLine } from './RisksPanel.tsx';
import { attemptPath, matterPath, refPath, riskPath } from './routes.ts';
import type { Tab } from './routes.ts';

const TAB_LABEL: Record<Tab, string> = { overview: '概览', risks: '风险', evidence: '依据', documents: '文书', tasks: '任务', activity: '记录' };

export function MatterPage() {
  const { matterId = '', tab = 'overview', itemId } = useParams() as { matterId: string; tab?: Tab; itemId?: string };
  const matter = useMatter(matterId);
  const refresh = useRefreshMatter(matterId);
  const navigate = useNavigate();

  if (!Object.hasOwn(TAB_LABEL, tab)) return <Navigate to={matterPath(matterId)} replace />;
  const count = (n: number | undefined) => (n === undefined ? '' : ` ${n}`);
  const links = matter.data?.links;
  return (
    <Flex vertical gap={16}>
      <Breadcrumb
        items={[
          { title: <Link to="/matters">事项</Link> },
          { title: tab === 'overview' ? matterId : <Link to={matterPath(matterId)}>{matterId}</Link> },
          ...(tab === 'overview' ? [] : [{ title: itemId ? <Link to={matterPath(matterId, tab)}>{TAB_LABEL[tab]}</Link> : TAB_LABEL[tab] }]),
          ...(itemId ? [{ title: itemId }] : []),
        ]}
      />
      <Loaded query={matter} what={`事项 ${matterId}`}>
        {(m) => (
          <>
            <ObjectHeader
              kind="事项"
              id={m.id}
              title={m.title}
              version={m.version}
              fetchedAt={matter.dataUpdatedAt}
              refreshing={matter.isFetching}
              onRefresh={refresh}
              tags={
                <>
                  <Tag>{MATTER_STATUS[m.status]}</Tag>
                  <Tag>{STAGE[m.stage]}阶段</Tag>
                  {m.nextDeadline && (
                    <Tag>
                      {m.nextDeadline.label} {m.nextDeadline.date}，{relativeDays(m.nextDeadline.date)}
                    </Tag>
                  )}
                </>
              }
            />
            <Tabs
              activeKey={tab}
              onChange={(key) => navigate(matterPath(m.id, key as Tab))}
              items={[
                { key: 'overview', label: TAB_LABEL.overview, children: <OverviewPanel matter={m} /> },
                { key: 'risks', label: `${TAB_LABEL.risks}${count(links?.risks)}`, children: <RisksPanel matterId={m.id} riskId={itemId} /> },
                { key: 'evidence', label: `${TAB_LABEL.evidence}${count(links?.evidence)}`, children: <EvidencePanel matterId={m.id} /> },
                { key: 'documents', label: `${TAB_LABEL.documents}${count(links?.documents)}`, children: <DocumentsPanel matterId={m.id} /> },
                { key: 'tasks', label: `${TAB_LABEL.tasks}${count(links?.tasks)}`, children: <TasksPanel matterId={m.id} /> },
                { key: 'activity', label: TAB_LABEL.activity, children: <ActivityPanel matterId={m.id} /> },
              ]}
            />
          </>
        )}
      </Loaded>
    </Flex>
  );
}

function OverviewPanel({ matter }: { matter: S['Matter'] }) {
  const parties = useParties(matter.id);
  const risks = useRisks(matter.id);
  const tasks = useTasks(matter.id);
  return (
    <div className="columns">
      <Flex vertical gap={24}>
        <section>
          <Typography.Title level={5}>基本信息</Typography.Title>
          <Descriptions
            size="small"
            column={1}
            items={[
              { key: 'cause', label: '案由', children: matter.cause },
              { key: 'court', label: '法院', children: matter.court ?? '尚未确定' },
              { key: 'case', label: '案号', children: matter.caseNumber ?? '尚未取得' },
              { key: 'opened', label: '建立日期', children: matter.openedAt },
              { key: 'owner', label: '主办合伙人', children: matter.owner.name },
              { key: 'reviewer', label: '复核人', children: matter.reviewer?.name ?? '未指派' },
            ]}
          />
        </section>
        <section>
          <Typography.Title level={5}>当事方</Typography.Title>
          <Loaded query={parties} what="当事方">
            {(list) => (
              <Descriptions size="small" column={1} items={list.map((p) => ({ key: p.id, label: PARTY_ROLE[p.role], children: p.name }))} />
            )}
          </Loaded>
        </section>
      </Flex>
      <Flex vertical gap={24}>
        <section>
          <Typography.Title level={5}>需要处理的风险</Typography.Title>
          <Loaded
            query={risks}
            what="风险"
            isEmpty={(list) => list.every((r) => r.status === 'decided' && !r.needsRecheck)}
            empty={<EmptyNote>{risks.data?.length ? '风险都已决定，所引依据也都是当前版本。' : '这个事项还没有登记风险。'}</EmptyNote>}
          >
            {(list) => (
              <ul className="plain-list rows">
                {list
                  .filter((r) => r.status !== 'decided' || r.needsRecheck)
                  .map((r) => (
                    <li key={r.id}>
                      <Link to={riskPath(matter.id, r.id)}>{r.title}</Link>
                      <RiskStatusLine risk={r} />
                    </li>
                  ))}
              </ul>
            )}
          </Loaded>
        </section>
        <section>
          <Typography.Title level={5}>未完成的任务</Typography.Title>
          <Loaded
            query={tasks}
            what="任务"
            isEmpty={(list) => list.every((t) => t.status === 'done')}
            empty={<EmptyNote>没有未完成的任务。</EmptyNote>}
          >
            {(list) => (
              <ul className="plain-list rows">
                {list
                  .filter((t) => t.status === 'open')
                  .map((t) => (
                    <li key={t.id}>
                      <Link to={matterPath(matter.id, 'tasks')}>{t.title}</Link>
                      <Typography.Text type="secondary">
                        {t.assignee.name} · {t.dueDate}，{relativeDays(t.dueDate)}
                      </Typography.Text>
                    </li>
                  ))}
              </ul>
            )}
          </Loaded>
        </section>
      </Flex>
    </div>
  );
}

function EvidencePanel({ matterId }: { matterId: string }) {
  const evidence = useEvidence(matterId);
  return (
    <Loaded query={evidence} what="依据" isEmpty={(list) => list.length === 0} empty={<EmptyNote>这个事项还没有登记依据。</EmptyNote>}>
      {(list) => (
        <Table<S['Evidence']>
          size="small"
          rowKey="id"
          pagination={false}
          dataSource={list}
          scroll={{ x: 'max-content' }}
          columns={[
            { title: '编号', dataIndex: 'id', width: 88 },
            { title: '出处', render: (_, e) => <EvidenceBasis evidence={e} /> },
            { title: '定位', render: (_, e) => (e.restricted ? <Typography.Text type="secondary">特权文书，你无权阅读</Typography.Text> : e.locator) },
            { title: '摘录', className: 'cell-wrap', render: (_, e) => (e.restricted ? null : e.excerpt) },
            {
              title: '关联风险',
              render: (_, e) =>
                e.risks.length === 0 ? (
                  <Typography.Text type="secondary">未关联</Typography.Text>
                ) : (
                  <ul className="plain-list">
                    {e.risks.map((r) => (
                      <li key={r.id}>
                        {STANCE[r.stance]} <Link to={riskPath(matterId, r.id)}>{r.title}</Link>
                      </li>
                    ))}
                  </ul>
                ),
            },
          ]}
        />
      )}
    </Loaded>
  );
}

function DocumentsPanel({ matterId }: { matterId: string }) {
  const documents = useDocuments(matterId);
  return (
    <Loaded query={documents} what="文书" isEmpty={(list) => list.length === 0} empty={<EmptyNote>这个事项还没有收到文书。</EmptyNote>}>
      {(list) => (
        <Table<S['Document']>
          size="small"
          rowKey="id"
          pagination={false}
          dataSource={list}
          scroll={{ x: 'max-content' }}
          columns={[
            { title: '编号', dataIndex: 'id', width: 88 },
            { title: '文书', render: (_, d) => <>{d.title}{d.privileged && <Tag className="tag-after">特权</Tag>}</> },
            { title: '类型', render: (_, d) => DOCUMENT_KIND[d.kind] },
            { title: '当前版本', render: (_, d) => `第 ${d.version} 版` },
            { title: '收到日期', dataIndex: 'receivedAt' },
            { title: '来源', dataIndex: 'source' },
            { title: '依据数', dataIndex: 'evidenceCount' },
          ]}
        />
      )}
    </Loaded>
  );
}

function TasksPanel({ matterId }: { matterId: string }) {
  const tasks = useTasks(matterId);
  return (
    <Loaded query={tasks} what="任务" isEmpty={(list) => list.length === 0} empty={<EmptyNote>这个事项还没有任务。</EmptyNote>}>
      {(list) => (
        <Table<S['Task']>
          size="small"
          rowKey="id"
          pagination={false}
          dataSource={list}
          scroll={{ x: 'max-content' }}
          columns={[
            { title: '编号', dataIndex: 'id', width: 88 },
            { title: '任务', dataIndex: 'title' },
            { title: '类型', render: (_, t) => TASK_KIND[t.kind] },
            { title: '责任人', render: (_, t) => t.assignee.name },
            { title: '期限', render: (_, t) => `${t.dueDate}，${relativeDays(t.dueDate)}` },
            { title: '状态', render: (_, t) => TASK_STATUS[t.status] },
            {
              title: '来由',
              render: (_, t) =>
                t.origin ? (
                  <Link to={attemptPath(matterId, t.origin.attemptId)}>对 {t.origin.ref} 的动作</Link>
                ) : (
                  <Typography.Text type="secondary">手工建立</Typography.Text>
                ),
            },
          ]}
        />
      )}
    </Loaded>
  );
}

function ActivityPanel({ matterId }: { matterId: string }) {
  const events = useEvents(matterId);
  const [params] = useSearchParams();
  const attempt = params.get('attempt');
  return (
    <Flex vertical gap={12}>
      {attempt && (
        <Typography.Text>
          标出的是尝试 <Typography.Text code>{attempt}</Typography.Text> 留下的记录。<Link to={matterPath(matterId, 'activity')}>取消标出</Link>
        </Typography.Text>
      )}
      <Loaded query={events} what="记录" isEmpty={(list) => list.length === 0} empty={<EmptyNote>这个事项还没有记录。</EmptyNote>}>
        {(list) => (
          <AuditTimeline
            events={list}
            labels={AUDIT}
            highlightAttempt={attempt}
            renderTarget={(target) => (
              <>
                <Link to={refPath(matterId, target)}>{target.title}</Link> <Typography.Text type="secondary">{target.id}</Typography.Text>
              </>
            )}
          />
        )}
      </Loaded>
    </Flex>
  );
}
