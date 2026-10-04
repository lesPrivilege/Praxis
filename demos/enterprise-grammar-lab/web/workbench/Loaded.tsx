// The states every panel has before it has data: loading, failed, refused, empty.
import type { UseQueryResult } from '@tanstack/react-query';
import { Alert, Button, Empty, Skeleton } from 'antd';
import type { ReactNode } from 'react';
import { ApiError } from '../api/core.ts';
import { formatClock } from './format.ts';

export function LoadFailure({ error, what, onRetry, retrying }: { error: Error; what: string; onRetry: () => void; retrying: boolean }) {
  if (error instanceof ApiError && error.status === 403) {
    return (
      <Alert
        type="warning"
        showIcon
        title={`无权查看${what}`}
        description={error.problem.contact ? `${error.problem.message}需要查看的话，联系${error.problem.contact}。` : error.problem.message}
      />
    );
  }
  if (error instanceof ApiError && error.status === 404) {
    return <Alert type="warning" showIcon title={`没有找到${what}`} description={error.problem.message} />;
  }
  return (
    <Alert
      type="error"
      showIcon
      title={`${what}没有取到`}
      description={error.message}
      action={
        <Button size="small" onClick={onRetry} loading={retrying}>
          重试
        </Button>
      }
    />
  );
}

// A refresh failed but an earlier copy is still on the page: keep it, and say how old it is.
export function RefreshFailure({ error, fetchedAt, onRetry, retrying }: { error: Error; fetchedAt: number; onRetry: () => void; retrying: boolean }) {
  return (
    <Alert
      className="refresh-failure"
      type="warning"
      showIcon
      title={`刷新失败，下面是 ${formatClock(fetchedAt)} 取得的内容`}
      description={error.message}
      action={
        <Button size="small" onClick={onRetry} loading={retrying}>
          重试
        </Button>
      }
    />
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={children} />;
}

export function Loaded<T>({
  query,
  what,
  isEmpty,
  empty,
  children,
}: {
  query: UseQueryResult<T, Error>;
  what: string;
  isEmpty?: (data: T) => boolean;
  empty?: ReactNode;
  children: (data: T) => ReactNode;
}) {
  if (query.isPending) {
    return (
      <div aria-busy="true" aria-label={`正在读取${what}`}>
        <Skeleton active title={false} paragraph={{ rows: 3 }} />
      </div>
    );
  }
  const retry = () => void query.refetch();
  if (query.data === undefined) {
    return <LoadFailure error={query.error!} what={what} onRetry={retry} retrying={query.isFetching} />;
  }
  return (
    <>
      {query.isError && <RefreshFailure error={query.error} fetchedAt={query.dataUpdatedAt} onRetry={retry} retrying={query.isFetching} />}
      {isEmpty?.(query.data) ? empty : children(query.data)}
    </>
  );
}
