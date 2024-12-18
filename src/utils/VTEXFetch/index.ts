/* eslint-disable @typescript-eslint/no-explicit-any */
const requestsAwaitingResponses: Record<string, { resolve: (value: any) => void; reject: (reason: any) => void }> = {};

window.addEventListener('message', (event: MessageEvent) => {
  if (event?.data?.name !== 'VTEXFetch') {
    return;
  }

  const { status, id, response, reason } = event.data;

  if (status === 'success') {
    if (requestsAwaitingResponses[id]) {
      requestsAwaitingResponses[id].resolve(response);
      delete requestsAwaitingResponses[id];
    }
  } else if (status === 'error') {
    if (requestsAwaitingResponses[id]) {
      requestsAwaitingResponses[id].reject(reason);
      delete requestsAwaitingResponses[id];
    }
  }
});

export function VTEXFetch<T = any>(...args: any[]): Promise<T> {
  const searchParams = new URLSearchParams(window.location.search);
  const useLocalVTEXFetch = searchParams.get('useLocalVTEXFetch')?.toLowerCase() === 'true';

  if (useLocalVTEXFetch) {
    const responseId = generateId(10);

    window.parent.postMessage({ name: 'VTEXFetch', id: responseId, args }, '*');

    return new Promise<T>((resolve, reject) => {
      requestsAwaitingResponses[responseId] = { resolve, reject };

      const handleMessage = (event: MessageEvent) => {
        const { name, id, data, error } = event.data;

        if (name === 'VTEXFetch' && id === responseId) {
          console.log('Resposta recebida:', event);
          window.removeEventListener('message', handleMessage);

          if (error) {
            reject(new Error(error));
          } else {
            resolve(data); 
          }
        }
      };

      window.addEventListener('message', handleMessage);
    });
  }

  throw new Error('useLocalVTEXFetch is disabled.');
}

// Função para gerar ID único
function generateId(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 36).toString(36)).join('');
}
