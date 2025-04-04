import { setLoadingSetup, setProjectUuid } from "../store/projectSlice";
import store from "../store/provider.store";
import { VTEXFetch } from "../utils/VTEXFetch";
import { updateAgentsList } from "./agent.service";
import { userAdapters } from "../api/users/adapters";
import { AccountData, UserData } from "../interfaces/Store";

export function getUserFromLocalStorage() {
  const user = localStorage.getItem('userData');
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

  try {
  const response = await VTEXFetch<{ project_uuid: string, error?: boolean, message?: string, data: { project_uuid: string, has_project: boolean } }>(`/_v/check-project-by-user?vtex_account=${vtex_account}&user_email=${user_email}`, {
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
