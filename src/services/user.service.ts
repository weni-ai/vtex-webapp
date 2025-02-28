/* eslint-disable @typescript-eslint/no-explicit-any */
import { setLoadingSetup, setProjectUuid } from "../store/projectSlice";
import store from "../store/provider.store";
import { VTEXFetch } from "../utils/VTEXFetch";
import { updateFeatureList } from "./features.service";
import { userAdapters } from "../users/adapters";

export function getUserFromLocalStorage() {
  const user = localStorage.getItem('userData');
  return user ? JSON.parse(user) : null;
}

export async function fetchUserData() {
  return userAdapters.fetchUserData();
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

export async function checkProject(vtex_account: string, user_email: string) {

  try {
  const response = await VTEXFetch(`/_v/check-project-by-user?vtex_account=${vtex_account}&user_email=${user_email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response || response.error) {
      throw new Error(response?.message || 'error creating user and project.');
    }

    return { success: true, data: response };
  } catch (error) {
    console.error('error when checking project:', error);
    return { success: false, error: error || 'unknown error' };
  }
}

export async function createUserAndProject(userData: any) {
  store.dispatch(setLoadingSetup(true));

  try {
    const payload = {
      user_email: userData.user,
      organization_name: userData.account,
      project_name: `${userData.account} 01`,
      vtex_account: userData.account,
    };

    const response = await VTEXFetch(`/_v/create-user-and-project`, {
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

    await updateFeatureList();
    return { success: true, data: response };
  } catch (error) {
    console.error('error in project and user creation:', error);
    store.dispatch(setLoadingSetup(false));
    return { success: false, error: error || 'unknown error' };
  }
}
