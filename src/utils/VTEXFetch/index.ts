/* eslint-disable @typescript-eslint/no-explicit-any */
const requestsAwaitingResponses: Record<string, { resolve: (value: any) => void; reject: (reason: any) => void }> = {};

window.addEventListener('message', (event: MessageEvent) => {
  const { name, id, status, response, reason } = event.data || {};

  if (name !== 'VTEXFetch') {
    return;
  }
  if (status === 'success' && requestsAwaitingResponses[id]) {
    console.log('Resolvendo promise para ID:', id, response);
    requestsAwaitingResponses[id].resolve(response);
    delete requestsAwaitingResponses[id];
  } else if (status === 'error' && requestsAwaitingResponses[id]) {
    console.log('Rejeitando promise para ID:', id, reason);
    requestsAwaitingResponses[id].reject(reason);
    delete requestsAwaitingResponses[id];
  } else {
    console.warn('Mensagem não corresponde a nenhuma requisição aguardando:', event.data);
  }
});

export function VTEXFetch<T = any>(...args: any[]): Promise<T> {
  const searchParams = new URLSearchParams(window.location.search);
  const useLocalVTEXFetch = searchParams.get('useLocalVTEXFetch')?.toLowerCase() === 'true';

  if (useLocalVTEXFetch) {
    const responseId = generateId(10);

    return new Promise<T>((resolve, reject) => {
      requestsAwaitingResponses[responseId] = { resolve, reject };

      setTimeout(() => {
        console.log('Mensagem enviada para o parent:', { name: 'VTEXFetch', id: responseId, args });
        window.parent.postMessage(
          { name: 'VTEXFetch', id: responseId, args },
          '*'
        );
      }, 0);
    });
  }

  throw new Error('useLocalVTEXFetch is disabled.');
}

function generateId(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 36).toString(36)).join('');
}
