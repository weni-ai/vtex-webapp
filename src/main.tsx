import { createRoot } from 'react-dom/client';
import './main.css';
import '@vtex/shoreline/css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import store from './store/provider.store.ts';
import i18n from 'i18next';
import './i18n';
import { ToastStack } from '@vtex/shoreline'
import { GrowthBookProvider } from '@growthbook/growthbook-react';
import { growthbook } from './plugins/growthbook.ts';

Object.assign(globalThis, {
  t: (key: string, options?: Record<string, unknown>) => {
    return i18n.t(key, options);
  }
});

/* disable language change and use only English
const query = decodeURIComponent(window.location.search);
const params = new URLSearchParams(query);
const locale = params.get('locale');


if (locale) {
  i18n.changeLanguage(locale).catch(err => console.error('language change error:', err));
}
*/

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <GrowthBookProvider growthbook={growthbook}>
      <App />
      <ToastStack />
    </GrowthBookProvider>
  </Provider>
);
