import { VTEXFetch } from "../utils/VTEXFetch";
import store from "../store/provider.store";

export function proxy<T = unknown>(
  method: string,
  url: string,
  {
    headers = {},
    data = undefined,
    params = {},
  }: {
    headers?: Record<string, string>,
    data?: Record<string, any>,
    params?: Record<string, string | boolean | undefined>,
  },
) {
  const embeddedWithin = store.getState().app.embeddedWithin;

  if (embeddedWithin === 'Weni Platform') {
    const urlEncoded = new URL(url);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          urlEncoded.searchParams.set(key, value.toString());
        }
      });
    }

    return new Promise<T>((resolve, reject) => {
      fetch(urlEncoded.toString(), {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('access_token') as string,
          ...headers,
        },
        body: JSON.stringify(data),
      })
        .then(response => response.text())
        .then(responseText => {
          let response: unknown;

          try {
            response = JSON.parse(responseText);
          } catch {
            response = { text: responseText };
          }

          resolve(response as T);
        })
        .catch(reject);
    });
  }

  return VTEXFetch<T>('/_v/proxy-request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      method,
      url,
      data: data || {},
      params,
      headers,
    }),
  });
}
