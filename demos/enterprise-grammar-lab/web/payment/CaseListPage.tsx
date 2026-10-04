// The case list: a query over payment review cases, held in the URL.
import { Breadcrumb, Button, Flex, Input, Select, Table, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { formatDateTime, relativeDays } from '../workbench/format.ts';
import { EmptyNote, LoadFailure, RefreshFailure } from '../workbench/Loaded.tsx';
import { useCases, useUsers } from './api.ts';
import type { S } from './api.ts';
import { CASE_STATUS, SORT } from './labels.ts';
import { formatMoney, fromMinor, toMinor } from './money.ts';
import { casePath, paramsFromQuery, queryFromParams } from './routes.ts';
import type { CaseQuery } from './routes.ts';

const PAGE_SIZE = 10;
const CURRENCIES = ['CNY', 'USD'];
const options = <K extends string>(labels: Record<K, string>) => Object.entries<string>(labels).map(([value, label]) => ({ value, label }));

export function CheckSummary({ item }: { item: Pick<S['CaseSummary'], 'failed' | 'blocking' | 'needsRecheck'> }) {
  return (
    <>
      {item.failed === 0 && item.blocking === 0 && '全部通过'}
      {item.blocking > 0 && `${item.blocking} 项无法判断`}
      {item.blocking > 0 && item.failed > 0 && '，'}
      {item.failed > 0 && `${item.failed} 项未通过`}
      {item.needsRecheck && <Tag color="warning" className="tag-after">材料已更新</Tag>}
    </>
  );
}

export function CaseListPage() {
  const [params, setParams] = useSearchParams();
  const query = queryFromParams(params);
  const page = Number(params.get('page')) || 1;
  const cases = useCases({ ...query, page, pageSize: PAGE_SIZE });
  const users = useUsers();

  const update = (patch: Partial<CaseQuery>) => setParams(paramsFromQuery({ ...query, ...patch }));
  const filtered = paramsFromQuery(query).toString() !== '';

  const [text, setText] = useState(query.q ?? '');
  useEffect(() => setText(query.q ?? ''), [query.q]);

  // Amounts are typed in the currency's ordinary units and sent in its smallest unit.
  const shown = (minor: number | undefined) => (minor === undefined || !query.currency ? '' : fromMinor(minor, query.currency));
  const [range, setRange] = useState({ min: shown(query.amountMin), max: shown(query.amountMax) });
  useEffect(() => setRange({ min: shown(query.amountMin), max: shown(query.amountMax) }), [query.amountMin, query.amountMax, query.currency]);
  // Without a currency there is no smallest unit to parse against; the fields are disabled and nothing is judged.
  const parsed = (value: string) => (value.trim() === '' || !query.currency ? undefined : toMinor(value, query.currency));
  const judged = (value: string) => Boolean(query.currency) && value.trim() !== '' && parsed(value) === undefined;
  const bad = { min: judged(range.min), max: judged(range.max) };
  const applyRange = () => {
    if (query.currency && !bad.min && !bad.max) update({ amountMin: parsed(range.min), amountMax: parsed(range.max) });
  };

  const lastPage = cases.data ? Math.max(Math.ceil(cases.data.total / PAGE_SIZE), 1) : null;
  useEffect(() => {
    // The total has to be for this query; while the previous query's page is still shown it is not.
    if (lastPage !== null && !cases.isPlaceholderData && page > lastPage) {
      const next = paramsFromQuery(query);
      if (lastPage > 1) next.set('page', String(lastPage));
      setParams(next, { replace: true });
    }
  });

  return (
    <Flex vertical gap={16}>
      <Breadcrumb items={[{ title: '复核事项' }]} />
      <Typography.Title level={3} className="object-title">
        复核事项
      </Typography.Title>

      <Flex vertical gap={8} role="search" aria-label="筛选复核事项">
        <Flex gap={8} wrap align="center">
          <Input.Search
            className="filter-search"
            allowClear
            placeholder="编号、供应方或合同号"
            aria-label="按编号、供应方或合同号搜索"
            value={text}
            onChange={(event) => setText(event.target.value)}
            onSearch={(value) => update({ q: value.trim() || undefined })}
          />
          <Select allowClear placeholder="状态" aria-label="状态" value={query.status} onChange={(status) => update({ status })} options={options(CASE_STATUS)} className="filter" />
          <Select
            allowClear
            placeholder="复核员"
            aria-label="复核员"
            value={query.owner}
            onChange={(owner) => update({ owner })}
            className="filter"
            options={[
              { value: 'me', label: '我' },
              { value: 'none', label: '未指定' },
              ...(users.data ?? []).filter((u) => u.role === 'reviewer').map((u) => ({ value: u.id, label: u.name })),
            ]}
          />
          <Select aria-label="排序" value={query.sort ?? 'dueDate'} onChange={(sort) => update({ sort })} options={options(SORT)} className="filter-wide" />
          <Button disabled={!filtered} onClick={() => setParams(new URLSearchParams())}>
            清除筛选
          </Button>
        </Flex>
        <Flex gap={8} wrap align="center">
          <label className="inline-field">
            <Typography.Text type="secondary">期限从</Typography.Text>
            <Input type="date" className="filter-date" value={query.dueFrom ?? ''} max={query.dueTo} onChange={(event) => update({ dueFrom: event.target.value || undefined })} />
          </label>
          <label className="inline-field">
            <Typography.Text type="secondary">到</Typography.Text>
            <Input type="date" className="filter-date" value={query.dueTo ?? ''} min={query.dueFrom} onChange={(event) => update({ dueTo: event.target.value || undefined })} />
          </label>
          <Select
            allowClear
            placeholder="币种"
            aria-label="币种"
            className="filter"
            value={query.currency}
            // The range was typed for the old currency; it does not carry over to another one.
            onChange={(currency) => update({ currency, amountMin: undefined, amountMax: undefined })}
            options={CURRENCIES.map((c) => ({ value: c, label: c }))}
          />
          <label className="inline-field">
            <Typography.Text type="secondary">金额从</Typography.Text>
            <Input
              className="filter-amount"
              inputMode="decimal"
              aria-label="金额下限"
              disabled={!query.currency}
              status={bad.min ? 'error' : undefined}
              aria-invalid={bad.min}
              aria-describedby="amount-hint"
              value={range.min}
              onChange={(event) => setRange({ ...range, min: event.target.value })}
              onBlur={applyRange}
              onPressEnter={applyRange}
            />
          </label>
          <label className="inline-field">
            <Typography.Text type="secondary">到</Typography.Text>
            <Input
              className="filter-amount"
              inputMode="decimal"
              aria-label="金额上限"
              disabled={!query.currency}
              status={bad.max ? 'error' : undefined}
              aria-invalid={bad.max}
              aria-describedby="amount-hint"
              value={range.max}
              onChange={(event) => setRange({ ...range, max: event.target.value })}
              onBlur={applyRange}
              onPressEnter={applyRange}
            />
          </label>
          <Typography.Text id="amount-hint" type={bad.min || bad.max ? 'danger' : 'secondary'}>
            {bad.min || bad.max
              ? '金额只能是数字，小数位不超过这个币种的最小单位。'
              : query.currency
                ? '不同币种的金额不放在一起比较；没有发票金额的事项不在任何金额范围内。'
                : '按金额筛选先选币种。'}
          </Typography.Text>
        </Flex>
      </Flex>

      {cases.isError && cases.data && (
        <RefreshFailure error={cases.error} fetchedAt={cases.dataUpdatedAt} onRetry={() => void cases.refetch()} retrying={cases.isFetching} />
      )}
      {cases.isError && !cases.data ? (
        <LoadFailure error={cases.error} what="复核事项列表" onRetry={() => void cases.refetch()} retrying={cases.isFetching} />
      ) : (
        <Table<S['CaseSummary']>
          size="small"
          rowKey="id"
          loading={cases.isFetching}
          dataSource={cases.data?.items ?? []}
          scroll={{ x: 'max-content' }}
          locale={{ emptyText: cases.isPending ? ' ' : <EmptyNote>{filtered ? '没有符合这组条件的复核事项。' : '还没有你可以查看的复核事项。'}</EmptyNote> }}
          pagination={{
            current: cases.data?.page ?? page,
            pageSize: PAGE_SIZE,
            total: cases.data?.total ?? 0,
            showSizeChanger: false,
            showTotal: (total) => `${cases.data?.totalExact === false ? '约 ' : '共 '}${total} 个事项`,
            onChange: (next) => {
              const nextParams = paramsFromQuery(query);
              if (next > 1) nextParams.set('page', String(next));
              setParams(nextParams);
            },
          }}
          columns={[
            {
              title: '事项',
              render: (_, c) => (
                <>
                  <Link to={casePath(c.id)}>{c.title}</Link>
                  <br />
                  <Typography.Text type="secondary">
                    {c.id} · {c.contractNo}
                  </Typography.Text>
                </>
              ),
            },
            { title: '供应方', dataIndex: 'vendor' },
            {
              title: '发票金额',
              align: 'right',
              render: (_, c) => (c.amount ? formatMoney(c.amount) : <Typography.Text type="secondary">未知，尚无发票</Typography.Text>),
            },
            { title: '状态', render: (_, c) => CASE_STATUS[c.status] },
            { title: '检查', render: (_, c) => <CheckSummary item={c} /> },
            { title: '复核员', render: (_, c) => c.owner?.name ?? <Typography.Text type="secondary">未指定</Typography.Text> },
            {
              title: '申请期限',
              render: (_, c) =>
                c.dueDate ? (
                  <>
                    {c.dueDate}
                    <br />
                    <Typography.Text type="secondary">{relativeDays(c.dueDate)}</Typography.Text>
                  </>
                ) : (
                  <Typography.Text type="secondary">未设期限</Typography.Text>
                ),
            },
            { title: '更新时间', render: (_, c) => formatDateTime(c.updatedAt) },
          ]}
        />
      )}
    </Flex>
  );
}
