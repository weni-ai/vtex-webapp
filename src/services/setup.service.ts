import * as Sentry from '@sentry/react';
import { growthbook } from '../plugins/growthbook';
import { fetchAccountData, fetchUserData } from './user.service';
import store from '../store/provider.store';
import { setUser, setAccount } from '../store/userSlice';
import { setProjectUuid } from '../store/projectSlice';
import { setEmbeddedWithin } from '../store/appSlice';
import { moduleStorage } from '../utils/storage';
import { AccountData, UserData } from '../interfaces/Store';

/**
 * Initializes the user context for VTEX App mode.
 *
 * Fetches user and account data, dispatches them to the store,
 * and sets up tracking services (Growthbook, Sentry, Hotjar).
 *
 * Throws on any failure so the caller can handle navigation to the error page.
 */
export async function initializeUserContext(): Promise<{ userData: UserData; accountData: AccountData }> {
  const { data: userData, error: userError } = await fetchUserData();
  if (!userData || userError) {
    throw new Error(JSON.stringify(userError) || 'error fetching user data.');
  }

  store.dispatch(setUser(userData));

  growthbook.setAttributes({
    email: userData.user,
    VTEXAccountName: userData.account,
  });

  Sentry.setUser({
    email: userData.user,
    VTEXAccountName: userData.account,
  });

  window.hj?.('identify', userData.user, {
    'VTEX Account Name': userData.account,
  });

  const { data: accountData, error: accountError } = await fetchAccountData();
  if (!accountData || accountError) {
    throw new Error(JSON.stringify(accountError) || 'error fetching account data.');
  }

  if (!accountData.hosts?.length) {
    accountData.hosts = [];
  }
  // append vtexcommercestable.com.br and myvtex.com with the account name as the subdomain
  accountData.hosts.push(`${userData.account}.myvtex.com`);
  accountData.hosts.push(`${userData.account}.vtexcommercestable.com.br`);

  store.dispatch(setAccount(accountData));

  return { userData, accountData };
}

/**
 * Initializes the context for Weni Platform embedded mode.
 *
 * Reads access_token, user_email, and project_uuid from URL search params,
 * sets up auth state and Sentry tracking.
 *
 * The caller is responsible for navigating to the dashboard after this returns.
 */
export function initializeWeniPlatformContext(searchParams: URLSearchParams): void {
  const accessToken = searchParams.get('access_token') as string;
  const userEmail = searchParams.get('user_email') as string;
  const projectUuid = searchParams.get('project_uuid') as string;

  store.dispatch(setEmbeddedWithin('Weni Platform'));
  store.dispatch(setProjectUuid(projectUuid));

  moduleStorage.setItem('access_token', accessToken);

  Sentry.setUser({
    email: userEmail,
  });
}
