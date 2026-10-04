// Side navigation: the case list and a few fixed queries over it.
import { Typography } from 'antd';
import { NavLink, useLocation } from 'react-router';
import { listPath, paramsFromQuery, queryFromParams } from './routes.ts';
import type { CaseQuery } from './routes.ts';

export const VIEWS: { key: string; name: string; query: CaseQuery }[] = [
  { key: 'mine', name: '我负责的', query: { owner: 'me' } },
  { key: 'needs-material', name: '待补件', query: { status: 'needs-material' } },
  { key: 'ready', name: '可提交', query: { status: 'ready' } },
  { key: 'in-review', name: '待复核', query: { status: 'in-review' } },
];

export function PaymentNav() {
  const location = useLocation();
  const here = location.pathname === '/reviews' ? paramsFromQuery(queryFromParams(new URLSearchParams(location.search))).toString() : null;
  const link = (name: string, query: CaseQuery) => (
    <NavLink to={listPath(query)} end className={here === paramsFromQuery(query).toString() ? 'nav-link nav-link-current' : 'nav-link'}>
      {name}
    </NavLink>
  );
  return (
    <nav aria-label="复核事项与视图" className="nav">
      {link('全部复核事项', {})}
      <Typography.Text type="secondary" className="nav-heading">
        视图
      </Typography.Text>
      <ul className="plain-list">
        {VIEWS.map((view) => (
          <li key={view.key} className="nav-row">
            {link(view.name, view.query)}
          </li>
        ))}
      </ul>
    </nav>
  );
}
