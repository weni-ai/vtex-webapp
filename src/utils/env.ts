declare global {
    interface Window {
      configs?: Record<string, string>;
    }
  }

  function getEnv(name: string): string | undefined {
    return window?.configs?.[name] || import.meta.env[name];
  }
  
  export default getEnv;
  