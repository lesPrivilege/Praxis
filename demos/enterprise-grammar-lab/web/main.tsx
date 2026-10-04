import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, Outlet, RouterProvider, ScrollRestoration } from 'react-router';
import './app.css';
import { matterRoutes } from './matter/MatterApp.tsx';
import { paymentRoutes } from './payment/PaymentApp.tsx';
import { theme } from './theme.ts';

// Reads fail visibly instead of retrying in the background, so a person decides when to retry.
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <ScrollRestoration />
        <Outlet />
      </>
    ),
    children: [{ index: true, element: <Navigate to="/matters" replace /> }, matterRoutes, paymentRoutes],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={zhCN} theme={theme} button={{ autoInsertSpace: false }}>
      <AntApp>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AntApp>
    </ConfigProvider>
  </StrictMode>,
);
