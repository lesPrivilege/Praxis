// Who did what to which object and version, under which rules, as part of which attempt.
import { Timeline, Typography } from 'antd';
import type { ReactNode } from 'react';
import type { W } from '../api/core.ts';
import { formatDateTime } from './format.ts';

export interface AuditLabels {
  type: Record<string, string>;
  field: Record<string, string>;
  value: Record<string, string>;
}

export function AuditTimeline({
  events,
  labels,
  renderTarget,
  highlightAttempt,
}: {
  events: W['AuditEvent'][];
  labels: AuditLabels;
  renderTarget: (target: W['ObjectRef']) => ReactNode;
  highlightAttempt?: string | null;
}) {
  const value = (v: string | null) => (v === null ? '无' : (labels.value[v] ?? v));
  return (
    <Timeline
      items={events.map((event) => {
        const highlighted = Boolean(highlightAttempt) && event.attemptId === highlightAttempt;
        return {
          key: event.id,
          color: highlighted ? 'blue' : 'gray',
          content: (
            <div className={highlighted ? 'audit-event audit-event-current' : 'audit-event'}>
              <div>
                <Typography.Text type="secondary">{formatDateTime(event.at)}</Typography.Text>{' '}
                <Typography.Text strong>{event.actor.name}</Typography.Text> {labels.type[event.type] ?? event.type}：{renderTarget(event.target)}
                {event.targetVersion !== null && <Typography.Text type="secondary">（第 {event.targetVersion} 版）</Typography.Text>}
              </div>
              {event.changes.map((change) => (
                <div key={change.field}>
                  {labels.field[change.field] ?? change.field}：{value(change.from)} → {value(change.to)}
                </div>
              ))}
              {event.note && <div>{event.note}</div>}
              {(event.rules.length > 0 || event.attemptId) && (
                <Typography.Text type="secondary">
                  {event.rules.length > 0 && `已检查规则 ${event.rules.join('、')}`}
                  {event.rules.length > 0 && event.attemptId && ' · '}
                  {event.attemptId && (
                    <>
                      尝试编号 <Typography.Text code>{event.attemptId}</Typography.Text>
                    </>
                  )}
                </Typography.Text>
              )}
            </div>
          ),
        };
      })}
    />
  );
}
