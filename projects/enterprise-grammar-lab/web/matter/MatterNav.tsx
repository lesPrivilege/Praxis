// Side navigation: the matter list and the saved views that are named queries over it.
import { DeleteOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { App, Button, Popconfirm, Typography } from 'antd';
import { NavLink, useLocation } from 'react-router';
import { deleteSavedView } from './api.ts';
import { useSavedViews } from './api.ts';
import { Loaded } from '../workbench/Loaded.tsx';
import { listPath, paramsFromQuery, queryFromParams } from './routes.ts';

export function MatterNav() {
  const views = useSavedViews();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  // A view is current when the list shows exactly its query, whatever the page number.
  const here = location.pathname === '/matters' ? paramsFromQuery(queryFromParams(new URLSearchParams(location.search))).toString() : null;

  const remove = async (viewId: string, name: string) => {
    try {
      await deleteSavedView(viewId);
      await queryClient.invalidateQueries();
    } catch (error) {
      message.error(`视图“${name}”没有删除：${(error as Error).message}`);
    }
  };

  return (
    <nav aria-label="事项与视图" className="nav">
      <NavLink to="/matters" end className={here === '' ? 'nav-link nav-link-current' : 'nav-link'}>
        全部事项
      </NavLink>
      <Typography.Text type="secondary" className="nav-heading">
        视图
      </Typography.Text>
      <Loaded query={views} what="视图">
        {(list) => (
          <ul className="plain-list">
            {list.map((view) => (
              <li key={view.id} className="nav-row">
                <NavLink
                  to={listPath(view.query)}
                  className={here === paramsFromQuery(view.query).toString() ? 'nav-link nav-link-current' : 'nav-link'}
                >
                  {view.name}
                </NavLink>
                {!view.shared && (
                  <Popconfirm title={`删除视图“${view.name}”？`} okText="删除" okButtonProps={{ danger: true }} cancelText="取消" onConfirm={() => remove(view.id, view.name)}>
                    <Button type="text" size="small" icon={<DeleteOutlined />} aria-label={`删除视图“${view.name}”`} />
                  </Popconfirm>
                )}
              </li>
            ))}
          </ul>
        )}
      </Loaded>
    </nav>
  );
}
