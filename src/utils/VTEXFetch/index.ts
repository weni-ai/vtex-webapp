/* eslint-disable @typescript-eslint/no-explicit-any */
const requestsAwaitingResponses: Record<string, { resolve: (value: any) => void; reject: (reason: any) => void }> = {};

window.addEventListener('message', (event: MessageEvent) => {
  const { name, id, status, response, reason } = event.data || {};

  if (name !== 'VTEXFetch') {
    return;
  }
  if (status === 'success' && requestsAwaitingResponses[id]) {
    requestsAwaitingResponses[id].resolve(response);
    delete requestsAwaitingResponses[id];
  } else if (status === 'error' && requestsAwaitingResponses[id]) {
    requestsAwaitingResponses[id].reject(reason);
    delete requestsAwaitingResponses[id];
  } else {
    console.warn('message does not correspond to any request waiting:', event.data);
  }
});

export function VTEXFetch<T = any>(...args: any[]): Promise<T> {
    const responseId = generateId(10);

    return new Promise<T>((resolve, reject) => {
      const handleMessage = (event: MessageEvent) => {

        const { name, id, status, response, reason } = event.data || {};
        
        if (name === 'VTEXFetch' && id === responseId) {
          window.removeEventListener('message', handleMessage);

          if (status === 'success') {
            resolve(response);
          } else if (status === 'error') {
            reject(new Error(reason || 'Erro desconhecido'));
          }
        }
      };

      window.addEventListener('message', handleMessage);

      setTimeout(() => {
        window.parent.postMessage(
          { name: 'VTEXFetch', id: responseId, args },
          '*'
        );
      }, 0);
    });
}

function generateId(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 36).toString(36)).join('');
}
