// What happened to an action attempt, in the terms a person needs to decide the next step.
import { Alert, Button, Flex, Typography } from 'antd';
import type { ReactNode } from 'react';
import type { Attempt } from '../api/attempt.ts';
import { formatDateTime } from './format.ts';
import { RuleViolations } from './RuleViolations.tsx';

export function AttemptNotice<I, R>({
  attempt,
  applied,
}: {
  attempt: Attempt<I, R>;
  applied: (result: R, attemptId: string) => ReactNode;
}) {
  const { state } = attempt;
  if (state.phase === 'idle') return null;
  const attemptLine = (
    <Typography.Text type="secondary">
      尝试编号 <Typography.Text code>{state.attemptId}</Typography.Text>
    </Typography.Text>
  );

  if (state.phase === 'submitting') {
    return <Alert role="status" type="info" showIcon title="已提交，等待后端确认。" description={attemptLine} />;
  }
  if (state.phase === 'applied') {
    return <Alert role="status" type="success" showIcon title="动作已生效" description={applied(state.result, state.attemptId)} />;
  }
  if (state.phase === 'refused') {
    const { problem } = state;
    const conflict = problem.code === 'conflict';
    return (
      <Alert
        role="alert"
        type={conflict ? 'warning' : 'error'}
        showIcon
        title={conflict ? '没有提交：对象已被更新' : '没有提交'}
        description={
          <Flex vertical gap={4}>
            <span>
              {problem.message}
              {conflict && problem.changedBy && problem.changedAt
                ? `更新人是${problem.changedBy.name}，时间 ${formatDateTime(problem.changedAt)}。页面已换成当前版本，你填写的内容还在，核对后可以再提交。`
                : ''}
            </span>
            <RuleViolations violations={problem.violations ?? []} />
            {attemptLine}
          </Flex>
        }
      />
    );
  }

  return (
    <Alert
      role="alert"
      type="warning"
      showIcon
      title="结果未知"
      description={
        <Flex vertical gap={8}>
          <span>提交后没有收到答复。动作可能已经生效，也可能没有到达后端。先核对，再决定是否重新提交。</span>
          {state.lastCheck === 'not-received' && <span>核对结果：后端没有收到这次尝试，可以用同一个尝试编号重新提交，不会重复生效。</span>}
          {state.lastCheck === 'unreachable' && <span>核对结果：暂时联系不上后端，结果仍然未知。稍后再核对。</span>}
          {attemptLine}
          <Flex gap={8}>
            <Button size="small" onClick={attempt.check} loading={state.checking}>
              核对这次尝试
            </Button>
            {state.lastCheck === 'not-received' && (
              <Button size="small" type="primary" onClick={attempt.retry}>
                用同一编号重新提交
              </Button>
            )}
          </Flex>
        </Flex>
      }
    />
  );
}
