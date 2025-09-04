import { setLoadingSetup, setProjectUuid } from "../store/projectSlice";
import store from "../store/provider.store";
import { VTEXFetch } from "../utils/VTEXFetch";
import { updateAgentsList } from "./agent.service";
import { userAdapters } from "../api/users/adapters";
import { AccountData, UserData } from "../interfaces/Store";
import getEnv from "../utils/env";
import { proxy } from "../api/proxy";
import { useCache } from "../utils";
import { moduleStorage } from "../utils/storage";

export function getUserFromLocalStorage() {
  const user = moduleStorage.getItem('userData');
  return user ? JSON.parse(user) : null;
}

export async function fetchUserData() {
  return userAdapters.fetchUserData();
}

export async function fetchAccountData() {
  try {
    const response = await VTEXFetch<AccountData & { error?: boolean, message?: string }>('/api/license-manager/account');

    if (!response || response.error) {
      throw new Error(response?.message || 'error fetching account data.');
    }

    return { success: true, data: response };
  } catch (error) {
    console.error('error fetching account data:', error);
    return { success: false, error: error || 'unknown error' };
  }
}

export async function checkProject(vtex_account: string, user_email: string) {
  const cacheKey: [string, string] = ['GET', `${getEnv('VITE_APP_API_URL')}/v2/commerce/check-project`];
  const cacheKeyString = `cache_${vtex_account}_${user_email}_${cacheKey.join('_')}`;

  try {
    const { response, saveCache } = await useCache({
      cacheKey: cacheKeyString,
      getResponse: () =>
        proxy<{
          project_uuid: string,
          error?: boolean,
          message?: string,
          data: { project_uuid: string, has_project: boolean }
        }>(
          ...cacheKey,
          {
            headers: {},
            params: {
              user_email: user_email || '',
              vtex_account: vtex_account || '',
            },
          },
        )
    });

    if (!response || response.error) {
      throw new Error(response?.message || 'error creating user and project.');
    }

    return { success: true, data: response, saveCache };
  } catch (error) {
    console.error('error when checking project:', error);
    return { success: false, error: error || 'unknown error' };
  }
}

export async function createUserAndProject(userData: UserData) {
  store.dispatch(setLoadingSetup(true));

  try {
    const payload = {
      user_email: userData.user,
      organization_name: userData.account,
      project_name: `${userData.account} 01`,
      vtex_account: userData.account,
    };

    const response = await VTEXFetch<{ project_uuid: string, error?: boolean, message?: string }>(`/_v/create-user-and-project`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response || response.error) {
      throw new Error(response?.message || 'error creating user and project.');
    }

    store.dispatch(setProjectUuid(response.project_uuid));
    store.dispatch(setLoadingSetup(false));

    await updateAgentsList();
    return { success: true, data: response };
  } catch (error) {
    console.error('error in project and user creation:', error);
    store.dispatch(setLoadingSetup(false));
    return { success: false, error: error || 'unknown error' };
  }
}
