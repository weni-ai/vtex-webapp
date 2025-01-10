/// <reference types="vite/client" />

declare module '@vtex/shoreline/css';

declare global {
    interface GlobalThis {
      t: (key: string, options?: Record<string, unknown>) => string;
    }
  }
  
  export {};
  
