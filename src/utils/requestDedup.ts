const inflightRequests = new Map<string, Promise<unknown>>();

export function dedupRequest<T>(
  key: string,
  fn: () => Promise<T>,
): Promise<T> {
  const existing = inflightRequests.get(key);
  if (existing) return existing as Promise<T>;

  const promise = fn().finally(() => {
    inflightRequests.delete(key);
  });

  inflightRequests.set(key, promise);
  return promise;
}
