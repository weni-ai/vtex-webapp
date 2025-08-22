/// <reference types="vite/client" />

declare module 'veaury/vite/index.js' {
  interface VeauryVitePluginOptions {
    type: 'react' | 'vue';
    [key: string]: any;
  }

  function veauryVitePlugins(options?: VeauryVitePluginOptions): any;
  
  export default veauryVitePlugins;
}

declare module '@weni/unnnic-system' {
  const unnnic: {
    unnnicTag: any;
    [key: string]: any;
  };
  export default unnnic;
}
