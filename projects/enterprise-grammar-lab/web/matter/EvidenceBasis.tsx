import { Tag } from 'antd';
import type { S } from './api.ts';

// Which document version a piece of evidence was taken from, and whether that is still the current one.
export function EvidenceBasis({ evidence }: { evidence: Pick<S['Evidence'], 'document' | 'documentVersion' | 'basisCurrent'> }) {
  return (
    <>
      {evidence.document.title} 第 {evidence.documentVersion} 版
      {!evidence.basisCurrent && <Tag color="warning" className="tag-after">版本落后，文书已到第 {evidence.document.version} 版</Tag>}
    </>
  );
}
