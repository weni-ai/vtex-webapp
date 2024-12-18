/* eslint-disable @typescript-eslint/no-explicit-any */
// const requestsAwaitingResponses: Record<
//   string,
//   { resolve: (value: any) => void; reject: (reason: any) => void }
// > = {};

// window.addEventListener('message', (event) => {
//   if (event?.data?.name !== "VTEXFetch") {
//     return;
//   }

//   if (event.data.status === 'success') {
//     requestsAwaitingResponses[event.data.id].resolve(event.data.response);
//     delete requestsAwaitingResponses[event.data.id];
//   } else if (event.data.status === 'error') {
//     requestsAwaitingResponses[event.data.id].reject(event.data.reason);
//     delete requestsAwaitingResponses[event.data.id];
//   }
// });

export function VTEXFetch<T = any>(...args: any[]): Promise<T> {
  const searchParams = new URLSearchParams(window.location.search);
  const useLocalVTEXFetch = searchParams.get('useLocalVTEXFetch')?.toLowerCase() === 'true';

  if (useLocalVTEXFetch) {
    const responseId = generateId(10);

    window.parent.postMessage(
      { name: 'VTEXFetch', id: responseId, args }, 
      '*'
    );

    return new Promise<T>((resolve, reject) => {
      const handleMessage = (event: MessageEvent) => {
        const { name, id, data, error } = event.data;
        
        if (name === 'VTEXFetch' && id === responseId) {
          console.log('alo', event)
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

function generateId(length: number): string {
  return Array.from({ length }, () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join('');
}


