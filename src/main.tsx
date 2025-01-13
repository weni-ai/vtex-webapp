/* eslint-disable @typescript-eslint/no-explicit-any */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@vtex/shoreline/css'
import App from './App.tsx'
import { Provider, useDispatch } from 'react-redux'
import store from './store/provider.store.ts'
import i18n from 'i18next';
import './i18n'; 
import { setBaseAddress } from './store/authSlice.ts'

(globalThis as any).t = (key: string, options?: Record<string, unknown>) => {
  return i18n.t(key, options);
};

window.addEventListener('message', (event) => {
  const dispatch = useDispatch()
  if (event.data.name === 'SetLocalStorage' && event.data.data?.base_address) {
    dispatch(setBaseAddress(event.data.data?.base_address))
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </StrictMode>,
)
