// The payment review workbench as a route tree: its shell, its identities, its two pages.
import type { RouteObject } from 'react-router';
import type { W } from '../api/core.ts';
import { AppShell } from '../workbench/AppShell.tsx';
import { CommandPalette } from '../workbench/CommandPalette.tsx';
import { PersonaProvider } from '../workbench/PersonaProvider.tsx';
import { WorkbenchSwitch } from '../Workbenches.tsx';
import { persona, useMeta, useSearch, useUsers } from './api.ts';
import { CaseListPage } from './CaseListPage.tsx';
import { CasePage } from './CasePage.tsx';
import { ROLE } from './labels.ts';
import { PaymentNav, VIEWS } from './PaymentNav.tsx';
import { casePath, listPath } from './routes.ts';

function useResults(text: string) {
  const search = useSearch(text);
  return {
    results: (search.data ?? []).map((hit) => ({ key: hit.id, label: `${hit.id} ${hit.title}`, hint: `复核事项 · ${hit.context}`, to: casePath(hit.id) })),
    searching: search.isFetching,
    failed: search.isError,
  };
}

function Shell({ personas }: { personas: W['User'][] }) {
  const meta = useMeta();
  return (
    <AppShell
      brand={<WorkbenchSwitch current="/reviews" />}
      title="付款复核台"
      notice={meta.data && meta.data.environment !== 'production' ? meta.data.dataNotice : undefined}
      personas={personas}
      roleLabels={ROLE}
      navigation={<PaymentNav />}
      palette={
        <CommandPalette
          placeholder="复核事项的编号、供应方或合同号，或视图名"
          useResults={useResults}
          commands={[
            { key: 'all', label: '全部复核事项', hint: '列表', to: '/reviews' },
            ...VIEWS.map((v) => ({ key: v.key, label: v.name, hint: '视图', to: listPath(v.query) })),
          ]}
        />
      }
    />
  );
}

function PaymentApp() {
  const users = useUsers();
  return (
    <PersonaProvider store={persona} users={users}>
      {(personas) => <Shell personas={personas} />}
    </PersonaProvider>
  );
}

export const paymentRoutes: RouteObject = {
  path: 'reviews',
  element: <PaymentApp />,
  children: [
    { index: true, element: <CaseListPage /> },
    { path: ':caseId/:tab?', element: <CasePage /> },
  ],
};
