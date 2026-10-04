// Opens one version of a file at the place a check or record points to.
// The reference lives in the URL, so it can be shared and Back closes it.
import { Alert, Drawer, Flex, Typography } from 'antd';
import { useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Loaded } from '../workbench/Loaded.tsx';
import { useFileVersion } from './api.ts';
import type { S } from './api.ts';
import { FILE_KIND } from './labels.ts';
import { casePath, evidenceSearch } from './routes.ts';

export function EvidenceLink({ evidence }: { evidence: S['EvidenceRef'] }) {
  return (
    <Link to={{ search: evidenceSearch(evidence) }}>
      {evidence.title} 第 {evidence.version} 版 · {evidence.locator}
    </Link>
  );
}

export function EvidenceDrawer({ caseId }: { caseId: string }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const fileId = params.get('file');
  const version = Number(params.get('fv'));
  const at = params.get('at');
  const open = Boolean(fileId) && Number.isInteger(version) && version > 0;
  return (
    <Drawer open={open} onClose={() => navigate({ search: '' }, { replace: true })} title="材料" size="large" destroyOnHidden>
      {open && <FileView caseId={caseId} fileId={fileId!} version={version} at={at} />}
    </Drawer>
  );
}

function FileView({ caseId, fileId, version, at }: { caseId: string; fileId: string; version: number; at: string | null }) {
  const file = useFileVersion(fileId, version);
  const target = useRef<HTMLLIElement>(null);
  useEffect(() => target.current?.scrollIntoView({ block: 'center' }), [file.data, at]);
  return (
    <Loaded query={file} what={`材料 ${fileId} 第 ${version} 版`}>
      {(f) => (
        <Flex vertical gap={16}>
          <div>
            <Typography.Text type="secondary">
              {FILE_KIND[f.kind]} <Typography.Text code>{f.id}</Typography.Text> · 第 {f.version} 版
            </Typography.Text>
            <Typography.Title level={4} className="object-title">
              {f.title}
            </Typography.Title>
            <Typography.Text type="secondary">
              {f.receivedAt} 收到 · {f.source}
            </Typography.Text>
          </div>
          {f.caseId !== caseId && (
            <Alert type="warning" showIcon title={`这份材料不属于 ${caseId}`} description={<Link to={casePath(f.caseId)}>它属于 {f.caseId}</Link>} />
          )}
          {f.version !== f.currentVersion && (
            <Alert
              type="warning"
              showIcon
              title={`这是第 ${f.version} 版，这份材料现在是第 ${f.currentVersion} 版`}
              description={<Link to={{ search: evidenceSearch({ fileId: f.id, version: f.currentVersion, key: at ?? undefined }) }}>看第 {f.currentVersion} 版</Link>}
            />
          )}
          {at && !f.fragments.some((fragment) => fragment.key === at) && (
            <Alert type="warning" showIcon title="定位失效" description="这一版里没有引用所指的位置。下面是这一版的全部内容。" />
          )}
          <ul className="plain-list rows">
            {f.fragments.map((fragment) => {
              const here = fragment.key === at;
              return (
                <li key={fragment.key} ref={here ? target : undefined} aria-current={here ? 'true' : undefined} className={here ? 'fragment fragment-current' : 'fragment'}>
                  <Typography.Text type="secondary">
                    {fragment.locator}
                    {here && ' · 引用所指的位置'}
                  </Typography.Text>
                  <span>{fragment.text}</span>
                </li>
              );
            })}
          </ul>
        </Flex>
      )}
    </Loaded>
  );
}
