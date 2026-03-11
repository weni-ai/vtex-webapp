import store from '../store/provider.store';
import getEnv from './env';

export function buildPlatformUrl(path: string): string {
  const projectUuid = store.getState().project.project_uuid;
  const userEmail = store.getState().user.userData?.user;

  const url = new URL(`/projects/${projectUuid}${path}`, getEnv('VITE_APP_DASH_URL'));

  const vtexAppParams = new URLSearchParams();
  if (userEmail) {
    vtexAppParams.append('email', userEmail);
  }
  url.searchParams.append('vtex_app', vtexAppParams.toString());

  return url.toString();
}

export function openPlatformUrl(path: string): void {
  window.open(buildPlatformUrl(path), '_blank');
}
