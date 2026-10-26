// Frame shared by every page: which environment this is, who you are acting as, and where you are.
import { Alert, Flex, Layout, Select, Typography } from 'antd';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router';
import type { W } from '../api/core.ts';
import { usePersona } from '../api/persona.ts';

export function AppShell({
  brand,
  title,
  notice,
  personas,
  roleLabels,
  navigation,
  palette,
}: {
  brand: ReactNode;
  // Name of the workbench, for the browser tab.
  title: string;
  // Shown across the top when the backend says this is not production.
  notice?: string;
  personas: W['User'][];
  roleLabels: Record<string, string>;
  navigation: ReactNode;
  palette: ReactNode;
}) {
  const { personaId, switchPersona } = usePersona();
  useEffect(() => {
    document.title = title;
  }, [title]);
  return (
    <Layout className="shell">
      {notice && <Alert banner type="info" showIcon={false} title={`演示环境 · ${notice}`} />}
      <Layout.Header className="shell-header">
        <div className="shell-brand">{brand}</div>
        <Flex align="center" gap={12} wrap>
          {palette}
          <label className="persona">
            <Typography.Text type="secondary">演示身份</Typography.Text>
            <Select
              aria-label="演示身份"
              value={personaId}
              onChange={switchPersona}
              popupMatchSelectWidth={false}
              options={personas.map((u) => ({ value: u.id, label: `${u.name} · ${roleLabels[u.role] ?? u.role}` }))}
            />
          </label>
        </Flex>
      </Layout.Header>
      {/* Plain CSS grid: beside the content on wide screens, a strip above it on narrow ones. */}
      <div className="shell-body">
        <aside className="shell-sider">{navigation}</aside>
        {/* Switching identity remounts the page, so no form or selection carries over. */}
        <Layout.Content key={personaId} className="shell-content">
          <Outlet />
        </Layout.Content>
      </div>
    </Layout>
  );
}
