import store from "../../store/provider.store";
import { setLoadingSetup, setProjectUuid } from "../../store/projectSlice";
import { updateFeatureList } from "../../services/features.service";
import { userRequests } from "./requests";

export const userAdapters = {
  getUserFromLocalStorage: () => {
    const user = localStorage.getItem('userData');
    return user ? JSON.parse(user) : null;
  },

  fetchUserData: async () => {
    try {
      const response = await userRequests.fetchAuthenticatedUser();

      if (!response || response.error) {
        throw new Error(response?.message || 'error fetching user data.');
      }

      return { success: true, data: response };
    } catch (error) {
      console.error('error fetching user data:', error);
      return { success: false, error: error || 'unknown error' };
    }
  },

  fetchAccountData: async () => {
    try {
      const response = await userRequests.fetchAccountData();

      if (!response || response.error) {
        throw new Error(response?.message || 'error fetching account data.');
      }

      return { success: true, data: response };
    } catch (error) {
      console.error('error fetching account data:', error);
      return { success: false, error: error || 'unknown error' };
    }
  },

  checkProject: async (vtex_account: string, user_email: string) => {
    try {
      const response = await userRequests.checkProject(vtex_account, user_email);

      if (!response || response.error) {
        throw new Error(response?.message || 'error creating user and project.');
      }

      return { success: true, data: response };
    } catch (error) {
      console.error('error when checking project:', error);
      return { success: false, error: error || 'unknown error' };
    }
  },

  createUserAndProject: async (userData: { user: string; account: string }) => {
    store.dispatch(setLoadingSetup(true));

    try {
      const payload = {
        user_email: userData.user,
        organization_name: userData.account,
        project_name: `${userData.account} 01`,
        vtex_account: userData.account,
      };

      const response = await userRequests.createUserAndProject(payload);

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
  },
}; 