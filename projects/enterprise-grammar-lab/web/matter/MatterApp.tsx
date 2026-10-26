// The matter workbench as a route tree: its shell, its identities, its two pages.
import type { RouteObject } from 'react-router';
import type { W } from '../api/core.ts';
import { AppShell } from '../workbench/AppShell.tsx';
import { CommandPalette } from '../workbench/CommandPalette.tsx';
import { PersonaProvider } from '../workbench/PersonaProvider.tsx';
import { WorkbenchSwitch } from '../Workbenches.tsx';
import { persona, useMeta, useSavedViews, useSearch, useUsers } from './api.ts';
import { ROLE, SEARCH_KIND } from './labels.ts';
import { MatterListPage } from './MatterListPage.tsx';
import { MatterNav } from './MatterNav.tsx';
import { MatterPage } from './MatterPage.tsx';
import { listPath, matterPath, riskPath } from './routes.ts';

function useResults(text: string) {
  const search = useSearch(text);
  return {
    results: (search.data ?? []).map((hit) => ({
      key: `${hit.kind}:${hit.id}`,
      label: `${hit.id} ${hit.title}`,
      hint: `${SEARCH_KIND[hit.kind]} · ${hit.context}`,
      to: hit.kind === 'risk' ? riskPath(hit.matterId, hit.id) : matterPath(hit.id),
    })),
    searching: search.isFetching,
    failed: search.isError,
  };
}

function Shell({ personas }: { personas: W['User'][] }) {
  const meta = useMeta();
  const views = useSavedViews();
  return (
    <AppShell
      brand={<WorkbenchSwitch current="/matters" />}
      title="事项工作台"
      notice={meta.data && meta.data.environment !== 'production' ? meta.data.dataNotice : undefined}
      personas={personas}
      roleLabels={ROLE}
      navigation={<MatterNav />}
      palette={
        <CommandPalette
          placeholder="事项或风险的编号、名称，或视图名"
          useResults={useResults}
          commands={[
            { key: 'all', label: '全部事项', hint: '列表', to: '/matters' },
            ...(views.data ?? []).map((v) => ({ key: v.id, label: v.name, hint: '视图', to: listPath(v.query) })),
          ]}
        />
      }
    />
  );
}

function MatterApp() {
  const users = useUsers();
  return (
    <PersonaProvider store={persona} users={users}>
      {(personas) => <Shell personas={personas} />}
    </PersonaProvider>
  );
}

export const matterRoutes: RouteObject = {
  path: 'matters',
  element: <MatterApp />,
  children: [
    { index: true, element: <MatterListPage /> },
    { path: ':matterId/:tab?/:itemId?', element: <MatterPage /> },
  ],
};
