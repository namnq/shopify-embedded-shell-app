import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';
import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';
import { useEffect, useState } from 'react';
import Routes from './Routes';

function App() {
  const [config, setConfig] = useState({
    apiKey: '',
    host: '',
    forceRedirect: true
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const host = searchParams.get('host') || '';
    const apiKey = process.env.SHOPIFY_API_KEY || '';

    setConfig({
      apiKey,
      host,
      forceRedirect: true
    });
  }, []);

  return (
    <BrowserRouter>
      <AppBridgeProvider config={config}>
        <AppProvider i18n={enTranslations}>
          <Routes />
        </AppProvider>
      </AppBridgeProvider>
    </BrowserRouter>
  )
}

export default App
