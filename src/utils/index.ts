export function cleanURL(url: string) {
  return url.trim().replace(/^https?:\/\//, '');
}
