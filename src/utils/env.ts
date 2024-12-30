declare global {
    interface Window {
      configs?: Record<string, string>;
    }
  }
  
  function getEnv(name: string): string | undefined {
    console.log('envs:', window.configs)
    return window?.configs?.[name] || import.meta.env[name];
  }
  
  export default getEnv;
  