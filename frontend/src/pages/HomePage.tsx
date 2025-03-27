import { Page, Layout, Card, Text } from '@shopify/polaris';

export function HomePage() {
  return (
    <Page title="Welcome">
      <Layout>
        <Layout.Section>
          <Card>
            <Text as="h2" variant="headingMd">
              Welcome to your Shopify app
            </Text>
            <Text as="p" variant="bodyMd">
              This is a sample Shopify app built with React and TypeScript.
              Navigate to the Orders page to view your latest orders.
            </Text>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}