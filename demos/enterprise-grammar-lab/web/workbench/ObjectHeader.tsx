// Identity of the object a page is about: what it is, which version, and how fresh the page's copy is.
import { ReloadOutlined } from '@ant-design/icons';
import { Button, Flex, Typography } from 'antd';
import type { ReactNode } from 'react';
import { formatClock } from './format.ts';

export function ObjectHeader({
  kind,
  id,
  title,
  version,
  tags,
  fetchedAt,
  refreshing,
  onRefresh,
  level = 1,
}: {
  kind: string;
  id: string;
  title: string;
  version: number;
  tags?: ReactNode;
  fetchedAt: number;
  refreshing: boolean;
  onRefresh: () => void;
  level?: 1 | 2;
}) {
  return (
    <Flex justify="space-between" align="flex-start" gap={16} wrap>
      <div>
        <Typography.Text type="secondary">
          {kind} <Typography.Text code>{id}</Typography.Text> · 第 {version} 版
        </Typography.Text>
        <Typography.Title level={level === 1 ? 3 : 4} className="object-title">
          {title}
        </Typography.Title>
        {tags && (
          <Flex gap={4} wrap>
            {tags}
          </Flex>
        )}
      </div>
      <Flex align="center" gap={8}>
        <Typography.Text type="secondary">取得于 {formatClock(fetchedAt)}</Typography.Text>
        <Button size="small" icon={<ReloadOutlined />} onClick={onRefresh} loading={refreshing}>
          刷新
        </Button>
      </Flex>
    </Flex>
  );
}
