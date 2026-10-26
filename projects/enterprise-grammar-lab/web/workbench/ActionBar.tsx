// Renders what the backend says can be done with an object. Unavailable actions stay
// visible with their reasons in the page, not in a tooltip.
import { Button, Flex, Typography } from 'antd';
import type { W } from '../api/core.ts';
import { RuleViolations } from './RuleViolations.tsx';

export function ActionBar({
  actions,
  labels,
  primary,
  active,
  onPick,
}: {
  actions: W['Affordance'][];
  // The scenario's words for its action types.
  labels: Record<string, string>;
  primary?: string;
  active: string | null;
  onPick: (type: string) => void;
}) {
  if (actions.length === 0) return <Typography.Text type="secondary">当前状态下没有可做的动作。</Typography.Text>;
  const blocked = actions.filter((a) => !a.allowed);
  return (
    <Flex vertical gap={12}>
      <Flex gap={8} wrap>
        {actions.map((a) => (
          <Button
            key={a.type}
            type={a.allowed && a.type === primary && active === null ? 'primary' : 'default'}
            disabled={!a.allowed}
            aria-pressed={active === a.type}
            onClick={() => onPick(a.type)}
          >
            {labels[a.type] ?? a.type}
          </Button>
        ))}
      </Flex>
      {blocked.map((a) => (
        <div key={a.type}>
          <Typography.Text strong>不能{labels[a.type] ?? a.type}：</Typography.Text>
          <RuleViolations violations={a.violations} />
        </div>
      ))}
    </Flex>
  );
}
