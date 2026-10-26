import { Typography } from 'antd';
import type { W } from '../api/core.ts';

// Why something is not allowed: the message, the rule and version behind it, and who can grant an exception.
export function RuleViolations({ violations }: { violations: W['RuleViolation'][] }) {
  if (violations.length === 0) return null;
  return (
    <ul className="plain-list">
      {violations.map((v, index) => (
        <li key={index}>
          {v.message}
          <Typography.Text type="secondary">
            {' '}
            规则 {v.rule} 第 {v.ruleVersion} 版{v.exceptionOwner ? `，例外找${v.exceptionOwner}` : ''}
          </Typography.Text>
        </li>
      ))}
    </ul>
  );
}
