import { useState, useEffect } from 'react';
import {
  Page,
  Layout,
  Card,
  ResourceList,
  ResourceItem,
  TextStyle,
  Button,
  Banner,
  Loading,
} from '@shopify/polaris';
import axios from 'axios';

interface Order {
  id: string;
  name: string;
  customer: {
    firstName: string;
    lastName: string;
  };
  totalPrice: string;
  createdAt: string;
}

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/orders');
      setOrders(response.data.orders);
    } catch (err) {
      setError('Failed to fetch orders. Please try again later.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Page title="Orders">
        <Loading />
      </Page>
    );
  }

  return (
    <Page
      title="Orders"
      primaryAction={
        <Button primary onClick={fetchOrders}>
          Refresh Orders
        </Button>
      }
    >
      <Layout>
        {error && (
          <Layout.Section>
            <Banner status="critical">{error}</Banner>
          </Layout.Section>
        )}
        <Layout.Section>
          <Card>
            <ResourceList
              resourceName={{ singular: 'order', plural: 'orders' }}
              items={orders}
              renderItem={(order) => (
                <ResourceItem
                  id={order.id}
                  accessibilityLabel={`Order ${order.name}`}
                >
                  <h3>
                    <TextStyle variation="strong">{order.name}</TextStyle>
                  </h3>
                  <div>
                    Customer: {order.customer.firstName} {order.customer.lastName}
                  </div>
                  <div>Total: {order.totalPrice}</div>
                  <div>Date: {new Date(order.createdAt).toLocaleDateString()}</div>
                </ResourceItem>
              )}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}