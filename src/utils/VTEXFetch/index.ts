import { fetcher } from "@vtex/raccoon-next";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface FetchOptions {
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: BodyInit | null;
  credentials?: RequestCredentials;
  cache?: RequestCache;
  mode?: RequestMode;
}

export async function VTEXFetch<T = unknown>(url: string, options?: FetchOptions): Promise<T> {
  const response = await fetcher(`/api/proxy/myvtex/${url}`, options);

  return response as T;
}
