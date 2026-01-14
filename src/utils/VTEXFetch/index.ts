const requestsAwaitingResponses: Record<string, { resolve: (value: unknown) => void; reject: (reason: unknown) => void }> = {};

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

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface FetchOptions {
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: BodyInit | null;
  credentials?: RequestCredentials;
  cache?: RequestCache;
  mode?: RequestMode;
}

export function VTEXFetch<T = unknown>(url: string, options?: FetchOptions): Promise<T> {
    const responseId = generateId(10);

    return new Promise<T>((resolve, reject) => {
      const handleMessage = (event: MessageEvent) => {

        const { name, id, status, response, reason } = event.data || {};
        
        if (name === 'VTEXFetch' && id === responseId) {
          window.removeEventListener('message', handleMessage);


          if (status === 'error' || response?.error) {
            reject(new Error(reason || response?.error || 'Unknown error'));
          } else if (status === 'success') {
            resolve(response);
          }
        }
      };

      window.addEventListener('message', handleMessage);

      setTimeout(() => {
        window.parent.postMessage(
          { name: 'VTEXFetch', id: responseId, args: [url, options] },
          '*'
        );
      }, 0);
    });
}

function generateId(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 36).toString(36)).join('');
}
