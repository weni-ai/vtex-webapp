/* eslint-disable @typescript-eslint/no-explicit-any */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@vtex/shoreline/css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import store from './store/provider.store.ts';
import i18n from 'i18next';
import './i18n';
import { setBaseAddress } from './store/authSlice.ts';

(globalThis as any).t = (key: string, options?: Record<string, unknown>) => {
  return i18n.t(key, options);
};

const params = new URLSearchParams(window.location.search);
const baseAddress = params.get('base_address');
const locale = params.get('locale');

if (baseAddress) {
  console.log('alooo', baseAddress)
  store.dispatch(setBaseAddress(baseAddress));
}

if (locale) {
  i18n.changeLanguage(locale).catch(err => console.error('Erro ao mudar o idioma:', err));
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
