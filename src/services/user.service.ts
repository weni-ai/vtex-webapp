/* eslint-disable @typescript-eslint/no-explicit-any */
import { setFeatureList, setLoadingSetup, setProjectUuid } from "../store/projectSlice";
import store from "../store/provider.store";
import { VTEXFetch } from "../utils/VTEXFetch";
import { getFeatureList } from "./features.service";

export function getUserFromLocalStorage() {
  const user = localStorage.getItem('userData');
  return user ? JSON.parse(user) : null;
}

export async function fetchUserData() {
  try {
    const response = await VTEXFetch('/api/vtexid/pub/authenticated/user');

    if (!response || response.error) {
      throw new Error(response?.message || 'error fetching user data.');
    }

    return { success: true, data: response };
  } catch (error) {
    console.error('error fetching user data:', error);
    return { success: false, error: error || 'unknown error' };
  }
}

export async function fetchAccountData() {
  try {
    const response = await VTEXFetch('/api/license-manager/account');

    if (!response || response.error) {
      throw new Error(response?.message || 'error fetching account data.');
    }

    return { success: true, data: response };
  } catch (error) {
    console.error('error fetching account data:', error);
    return { success: false, error: error || 'unknown error' };
  }
}

export async function checkProject(vtex_account: string, user_email: string, token: string) {
  const apiUrl = `https://api.stg.cloud.weni.ai/v2/commerce/check-project?vtex_account=${vtex_account}&user_email=${user_email}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error()
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('error when checking project:', error);
    return { success: false, error: error || 'unknown error' };
  }
}

export async function createUserAndProject(userData: any, token: string) {
  store.dispatch(setLoadingSetup(true));

  try {
    const payload = {
      user_email: userData.user,
      organization_name: userData.account,
      project_name: `${userData.account} 01`,
      vtex_account: userData.account,
    };

    const response = await VTEXFetch(`/_v/create-user-and-project?token=${token}`, {
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

    const featureList = await getFeatureList(response.project_uuid, token);
    if (featureList?.error) {
      throw new Error(JSON.stringify(featureList.error))
    }
    store.dispatch(setFeatureList(featureList.data.features))
    return { success: true, data: response };
  } catch (error) {
    console.error('error in project and user creation:', error);
    store.dispatch(setLoadingSetup(false));
    return { success: false, error: error || 'unknown error' };
  }
}
