/* eslint-disable @typescript-eslint/no-explicit-any */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@vtex/shoreline/css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import store from './store/provider.store.ts';
import i18n from 'i18next';
import './i18n';
import { ToastStack } from '@vtex/shoreline'

Object.assign(globalThis, {
  t: (key: string, options?: Record<string, unknown>) => {
    return i18n.t(key, options);
  }
});

const query = decodeURIComponent(window.location.search);
const params = new URLSearchParams(query);
const locale = params.get('locale');

if (locale) {
  i18n.changeLanguage(locale).catch(err => console.error('language change error:', err));
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
        <App />
        <ToastStack />
    </Provider>
  </StrictMode>
);
