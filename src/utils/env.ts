declare global {
    interface Window {
      configs?: Record<string, string>;

      hj?: (event: 'identify', id: string, attributes: Record<string, string>) => void;
    }
  }
  
  function getEnv(name: string): string | undefined {
    return (
      window?.configs?.[name] ?? import.meta.env[name]
    );
  }
  
  export default getEnv;
  