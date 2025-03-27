import { Routes as ReactRouterRoutes, Route } from 'react-router-dom';
import { NavigationMenu } from '@shopify/app-bridge-react';
import { HomePage } from './pages/HomePage';
import { OrdersPage } from './pages/OrdersPage';

export default function Routes() {
  const pages = [
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '/orders',
      element: <OrdersPage />,
    },
  ];

  const fallbackPage = (
    <Route
      path="*"
      element={
        <div style={{ padding: '1rem' }}>
          <h1>404: Page Not Found</h1>
          <p>The requested page could not be found.</p>
        </div>
      }
    />
  );

  return (
    <>
      <NavigationMenu
        navigationLinks={[
          {
            label: 'Home',
            destination: '/',
          },
          {
            label: 'Orders',
            destination: '/orders',
          },
        ]}
      />
      <ReactRouterRoutes>
        {pages.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        {fallbackPage}
      </ReactRouterRoutes>
    </>
  );
}