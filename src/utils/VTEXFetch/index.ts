import mocks from './mocks.json';

const requestsAwaitingResponses = {};

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

export function VTEXFetch(...args) {
  const searchParams = new URLSearchParams(window.location.search);
  const useLocalVTEXFetch = searchParams.get('useLocalVTEXFetch')?.toLowerCase() === 'true';

  if (useLocalVTEXFetch) {
    const method = args[1]?.method || 'GET';
    const foundResponse = mocks[args[0]]?.[method];

    if (!foundResponse) {
      console.error(`Mock response for ${method} ${args[0]} not found`);
      
      return new Promise(() => {});
    }

    console.log('VTEXFetch Log:', method, args[0], args[1]?.body);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(foundResponse);
      }, 300);
    });
  }

  const id = ((length) => {
    const id = [];

    for (let i = 0; i < length; i++) {
      id.push(Math.floor(Math.random() * 36).toString(36));
    }

    return id.join('');
  })(10);

  window.parent.postMessage({ name: 'VTEXFetch', args, id }, '*');
  
  return new Promise((resolve, reject) => {
    requestsAwaitingResponses[id] = {
      resolve,
      reject,
    }
  });
}