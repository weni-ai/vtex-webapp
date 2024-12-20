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
      const handleMessage = (event: MessageEvent) => {
        console.log('Mensagem recebida no VTEXFetch:', event.data);

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
        console.log('Enviando mensagem para o iframe...');
        window.parent.postMessage(
          { name: 'VTEXFetch', id: responseId, args },
          '*'
        );
      }, 0);
    });
  }

  console.log('useLocalVTEXFetch is disabled.')
}


function generateId(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 36).toString(36)).join('');
}
