/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const requestsAwaitingResponses: Record<
  string,
  { resolve: (value: any) => void; reject: (reason: any) => void }
> = {};

window.addEventListener('message', (event) => {
  if (event?.data?.name !== "VTEXFetch") {
    return;
  }

  if (event.data.status === 'success') {
    requestsAwaitingResponses[event.data.id].resolve(event.data.response);
    delete requestsAwaitingResponses[event.data.id];
  } else if (event.data.status === 'error') {
    requestsAwaitingResponses[event.data.id].reject(event.data.reason);
    delete requestsAwaitingResponses[event.data.id];
  }
});

export function VTEXFetch<T = any>(...args: any[]): Promise<T> {
  const searchParams = new URLSearchParams(window.location.search);
  const useLocalVTEXFetch = searchParams.get('useLocalVTEXFetch')?.toLowerCase() === 'true';

  if (useLocalVTEXFetch) {
    const domain = window.location.origin; // Obtém o domínio atual
    const path = `${domain}/api/vtexid/pub/authenticated/user`;

    console.log('VTEXFetch Log: GET', path);
    return axios
      .get<T>(path)
      .then((response) => response.data)
      .catch((error) => {
        console.error(`Error fetching data from ${path}:`, error);
        throw error;
      });
  }

  const id = generateId(10);
  window.parent.postMessage({ name: 'VTEXFetch', args, id }, '*');

  return new Promise<T>((resolve, reject) => {
    requestsAwaitingResponses[id] = { resolve, reject };
  });
}

function generateId(length: number): string {
  return Array.from({ length }, () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join('');
}

