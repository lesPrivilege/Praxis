// The matter list: a query over matters, held in the URL so it can be shared or saved as a view.
import { useQueryClient } from '@tanstack/react-query';
import { App, Breadcrumb, Button, Checkbox, Flex, Input, Modal, Select, Table, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { createSavedView } from './api.ts';
import type { S } from './api.ts';
import { useMatters, useUsers } from './api.ts';
import { EmptyNote, LoadFailure, RefreshFailure } from '../workbench/Loaded.tsx';
import { formatDateTime, relativeDays } from '../workbench/format.ts';
import { RuleViolations } from '../workbench/RuleViolations.tsx';
import { AssignReviewerDialog } from './AssignReviewerDialog.tsx';
import { ACTION, MATTER_STATUS, SORT, STAGE } from './labels.ts';
import { matterPath, paramsFromQuery, queryFromParams } from './routes.ts';

const PAGE_SIZE = 10;
const options = <K extends string>(labels: Record<K, string>) => Object.entries<string>(labels).map(([value, label]) => ({ value, label }));

export function MatterListPage() {
  const [params, setParams] = useSearchParams();
  const query = queryFromParams(params);
  const page = Number(params.get('page')) || 1;
  const matters = useMatters({ ...query, page, pageSize: PAGE_SIZE });
  const users = useUsers();
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const [text, setText] = useState(query.q ?? '');
  useEffect(() => setText(query.q ?? ''), [query.q]);
  // A page number past the end (an old link, or rows that have since left the query) falls back to the last page.
  const lastPage = matters.data ? Math.max(Math.ceil(matters.data.total / PAGE_SIZE), 1) : null;
  useEffect(() => {
    // The total has to be for this query; while the previous query's page is still shown it is not.
    if (lastPage !== null && !matters.isPlaceholderData && page > lastPage) {
      const next = paramsFromQuery(query);
      if (lastPage > 1) next.set('page', String(lastPage));
      setParams(next, { replace: true });
    }
  });

  const [selected, setSelected] = useState<string[]>([]);
  const [assigning, setAssigning] = useState(false);
  const [naming, setNaming] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Changing the query goes back to page one; the selection belongs to the old result.
  const update = (patch: Partial<S['MatterQuery']>) => {
    setParams(paramsFromQuery({ ...query, ...patch }));
    setSelected([]);
  };
  const filtered = paramsFromQuery(query).toString() !== '';
  const assign = matters.data?.actions.find((a) => a.type === 'assign-reviewer');

  const saveView = async () => {
    if (saving || !naming?.trim()) return;
    setSaving(true);
    try {
      await createSavedView({ name: naming.trim(), query });
      setNaming(null);
      void queryClient.invalidateQueries();
    } catch (error) {
      message.error(`视图没有保存：${(error as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Flex vertical gap={16}>
      <Breadcrumb items={[{ title: '事项' }]} />
      <Typography.Title level={3} className="object-title">
        事项
      </Typography.Title>

      <Flex gap={8} wrap align="center" role="search" aria-label="筛选事项">
        <Input.Search
          className="filter-search"
          allowClear
          placeholder="编号、名称或当事方"
          aria-label="按编号、名称或当事方搜索"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onSearch={(value) => update({ q: value.trim() || undefined })}
        />
        <Select allowClear placeholder="状态" aria-label="状态" value={query.status} onChange={(status) => update({ status })} options={options(MATTER_STATUS)} className="filter" />
        <Select allowClear placeholder="阶段" aria-label="阶段" value={query.stage} onChange={(stage) => update({ stage })} options={options(STAGE)} className="filter" />
        <Select
          allowClear
          placeholder="复核人"
          aria-label="复核人"
          value={query.reviewer}
          onChange={(reviewer) => update({ reviewer })}
          className="filter"
          options={[
            { value: 'me', label: '我' },
            { value: 'none', label: '未指派' },
            ...(users.data ?? []).filter((u) => u.role !== 'paralegal').map((u) => ({ value: u.id, label: u.name })),
          ]}
        />
        <Checkbox checked={query.openRisk ?? false} onChange={(event) => update({ openRisk: event.target.checked || undefined })}>
          有待处置风险
        </Checkbox>
        <Select aria-label="排序" value={query.sort ?? 'deadline'} onChange={(sort) => update({ sort })} options={options(SORT)} className="filter-wide" />
        <Button disabled={!filtered} onClick={() => update({ q: undefined, status: undefined, stage: undefined, reviewer: undefined, openRisk: undefined, sort: undefined })}>
          清除筛选
        </Button>
        <Button disabled={!filtered} onClick={() => setNaming('')}>
          保存为视图
        </Button>
      </Flex>

      {assign && (
        <Flex vertical gap={4}>
          <Flex gap={12} align="center">
            <Typography.Text>已选 {selected.length} 个事项</Typography.Text>
            <Button disabled={!assign.allowed || selected.length === 0} onClick={() => setAssigning(true)}>
              {ACTION['assign-reviewer']}
            </Button>
          </Flex>
          {!assign.allowed && <RuleViolations violations={assign.violations} />}
        </Flex>
      )}

      {matters.isError && matters.data && (
        <RefreshFailure error={matters.error} fetchedAt={matters.dataUpdatedAt} onRetry={() => void matters.refetch()} retrying={matters.isFetching} />
      )}
      {matters.isError && !matters.data ? (
        <LoadFailure error={matters.error} what="事项列表" onRetry={() => void matters.refetch()} retrying={matters.isFetching} />
      ) : (
        <Table<S['MatterSummary']>
          size="small"
          rowKey="id"
          loading={matters.isFetching}
          dataSource={matters.data?.items ?? []}
          scroll={{ x: 'max-content' }}
          locale={{
            emptyText: matters.isPending ? ' ' : <EmptyNote>{filtered ? '没有符合这组条件的事项。' : '还没有你可以查看的事项。'}</EmptyNote>,
          }}
          rowSelection={
            assign?.allowed
              ? {
                  selectedRowKeys: selected,
                  preserveSelectedRowKeys: true,
                  onChange: (keys) => setSelected(keys as string[]),
                  getCheckboxProps: (m) => ({ 'aria-label': `选择 ${m.id} ${m.title}` }),
                }
              : undefined
          }
          pagination={{
            current: matters.data?.page ?? page,
            pageSize: PAGE_SIZE,
            total: matters.data?.total ?? 0,
            showSizeChanger: false,
            showTotal: (total) => `共 ${total} 个事项`,
            onChange: (next) => {
              const nextParams = paramsFromQuery(query);
              if (next > 1) nextParams.set('page', String(next));
              setParams(nextParams);
            },
          }}
          columns={[
            {
              title: '事项',
              render: (_, m) => (
                <>
                  <Link to={matterPath(m.id)}>{m.title}</Link>
                  <br />
                  <Typography.Text type="secondary">
                    {m.id} · {m.cause}
                  </Typography.Text>
                </>
              ),
            },
            { title: '委托人', dataIndex: 'client' },
            { title: '阶段', render: (_, m) => STAGE[m.stage] },
            { title: '状态', render: (_, m) => MATTER_STATUS[m.status] },
            { title: '复核人', render: (_, m) => m.reviewer?.name ?? <Typography.Text type="secondary">未指派</Typography.Text> },
            {
              title: '待处置风险',
              render: (_, m) =>
                m.openRisks === 0 && m.recheckRisks === 0 ? (
                  <Typography.Text type="secondary">无</Typography.Text>
                ) : (
                  <>
                    {m.openRisks} 项
                    {m.highOpenRisks > 0 && <Tag color="error" className="tag-after">高 {m.highOpenRisks}</Tag>}
                    {m.recheckRisks > 0 && <Tag color="warning" className="tag-after">需重新核对 {m.recheckRisks}</Tag>}
                  </>
                ),
            },
            {
              title: '最近期限',
              render: (_, m) =>
                m.nextDeadline ? (
                  <>
                    {m.nextDeadline.label}
                    <br />
                    <Typography.Text type="secondary">
                      {m.nextDeadline.date} · {relativeDays(m.nextDeadline.date)}
                    </Typography.Text>
                  </>
                ) : (
                  <Typography.Text type="secondary">未设期限</Typography.Text>
                ),
            },
            { title: '更新时间', render: (_, m) => formatDateTime(m.updatedAt) },
          ]}
        />
      )}

      {assigning && (
        <AssignReviewerDialog
          matterIds={selected}
          onClose={(changed) => {
            setAssigning(false);
            if (changed) setSelected([]);
          }}
        />
      )}
      <Modal
        open={naming !== null}
        title="保存为视图"
        okText="保存"
        cancelText="取消"
        okButtonProps={{ disabled: !naming?.trim() }}
        confirmLoading={saving}
        onOk={saveView}
        onCancel={() => setNaming(null)}
        destroyOnHidden
      >
        <label className="field">
          <Typography.Text>视图名称</Typography.Text>
          <Input aria-label="视图名称" autoFocus maxLength={30} value={naming ?? ''} onChange={(event) => setNaming(event.target.value)} onPressEnter={() => void saveView()} />
          <Typography.Text type="secondary">视图保存当前这组筛选条件和排序，只有你自己能看到。</Typography.Text>
        </label>
      </Modal>
    </Flex>
  );
}
