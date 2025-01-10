/// <reference types="vite/client" />

import '@vtex/shoreline/css'; // Importação direta resolve problemas de resolução

declare global {
  const t: typeof import('./i18n').t; // Ajuste o caminho conforme necessário
}

export {};
