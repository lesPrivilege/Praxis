// Bulk action over selected matters. The backend checks and applies each matter on its own,
// so the dialog reports per-matter results instead of one success or failure.
import { useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Flex, Modal, Select, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import type { S } from './api.ts';
import { useAssignReviewer, useJob, useUsers } from './api.ts';
import { AttemptNotice } from '../workbench/AttemptNotice.tsx';
import { RefreshFailure } from '../workbench/Loaded.tsx';
import { RuleViolations } from '../workbench/RuleViolations.tsx';
import { ROLE } from './labels.ts';

const ITEM_STATUS: Record<S['JobItem']['status'], string> = { pending: '等待处理', applied: '已指派', rejected: '未通过' };

export function AssignReviewerDialog({ matterIds, onClose }: { matterIds: string[]; onClose: (changed: boolean) => void }) {
  const users = useUsers();
  const [reviewerId, setReviewerId] = useState<string>();
  const attempt = useAssignReviewer();
  const accepted = attempt.state.phase === 'applied' ? attempt.state.result : undefined;
  const progress = useJob(accepted?.id);
  const job = progress.data ?? accepted;
  const queryClient = useQueryClient();
  const completed = job?.status === 'completed';

  // The job changes matters after the request returned, so lists refresh when it finishes.
  useEffect(() => {
    if (completed) void queryClient.invalidateQueries();
  }, [completed, queryClient]);

  // Closing is held back only while something is known to be in flight. With an unknown outcome or
  // a lost progress feed the dialog can be left; the list shows what actually took effect.
  const busy = attempt.state.phase === 'submitting' || (job !== undefined && !completed && !progress.isError);
  const reviewers = (users.data ?? []).filter((u) => u.role !== 'paralegal');
  const appliedCount = job?.items.filter((i) => i.status === 'applied').length ?? 0;
  const rejectedCount = job?.items.filter((i) => i.status === 'rejected').length ?? 0;

  return (
    <Modal
      open
      title={`指派复核人 · 已选 ${matterIds.length} 个事项`}
      onCancel={() => onClose(job !== undefined)}
      closable={!busy}
      mask={{ closable: !busy }}
      keyboard={!busy}
      width={640}
      footer={
        job ? (
          <Button type="primary" disabled={busy} onClick={() => onClose(true)}>
            {completed ? '完成' : busy ? '处理中' : '关闭'}
          </Button>
        ) : (
          <Flex justify="flex-end" gap={8}>
            <Button onClick={() => onClose(attempt.state.phase === 'unknown')} disabled={busy}>
              {attempt.state.phase === 'unknown' ? '关闭' : '取消'}
            </Button>
            <Button
              type="primary"
              disabled={!reviewerId || attempt.state.phase === 'unknown'}
              loading={attempt.state.phase === 'submitting'}
              onClick={() => attempt.submit({ matterIds, reviewerId: reviewerId! })}
            >
              指派
            </Button>
          </Flex>
        )
      }
    >
      <Flex vertical gap={12}>
        {!job && (
          <label className="field">
            <Typography.Text>复核人</Typography.Text>
            <Select
              aria-label="复核人"
              placeholder="选择一位律师"
              value={reviewerId}
              onChange={setReviewerId}
              loading={users.isPending}
              disabled={busy || attempt.state.phase === 'unknown'}
              options={reviewers.map((u) => ({ value: u.id, label: `${u.name} · ${ROLE[u.role]}` }))}
            />
            <Typography.Text type="secondary">每个事项单独检查：已结案的事项、与当事方有利益冲突的复核人不会被指派。</Typography.Text>
          </label>
        )}
        {attempt.state.phase !== 'applied' && <AttemptNotice attempt={attempt} applied={() => null} />}
        {job && progress.isError && (
          <RefreshFailure error={progress.error} fetchedAt={progress.dataUpdatedAt || Date.now()} onRetry={() => void progress.refetch()} retrying={progress.isFetching} />
        )}
        {job && (
          <>
            <Alert
              role="status"
              type={completed ? (rejectedCount ? 'warning' : 'success') : 'info'}
              showIcon
              title={
                completed
                  ? `处理完毕：${appliedCount} 个已指派，${rejectedCount} 个未通过。`
                  : `正在逐个处理：已处理 ${job.done} 个，共 ${job.total} 个。`
              }
              description={completed && rejectedCount > 0 ? '未通过的事项保持原样，原因见下表。' : undefined}
            />
            <Table
              size="small"
              pagination={false}
              rowKey={(item) => item.ref.id}
              dataSource={job.items}
              columns={[
                { title: '事项', width: '38%', render: (_, item) => `${item.ref.id} ${item.ref.title === item.ref.id ? '' : item.ref.title}` },
                { title: '结果', width: 96, render: (_, item) => ITEM_STATUS[item.status] },
                { title: '原因', render: (_, item) => <RuleViolations violations={item.violations} /> },
              ]}
            />
          </>
        )}
      </Flex>
    </Modal>
  );
}
