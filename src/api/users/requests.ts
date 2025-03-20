import { VTEXFetch } from "../../utils/VTEXFetch";

interface CreateUserAndProjectPayload {
  user_email: string;
  organization_name: string;
  project_name: string;
  vtex_account: string;
}

export const userRequests = {
  fetchAuthenticatedUser: async () => {
    return VTEXFetch('/api/vtexid/pub/authenticated/user');
  },

  fetchAccountData: async () => {
    return VTEXFetch('/api/license-manager/account');
  },

  checkProject: async (vtex_account: string, user_email: string) => {
    return VTEXFetch(`/_v/check-project-by-user?vtex_account=${vtex_account}&user_email=${user_email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  createUserAndProject: async (payload: CreateUserAndProjectPayload) => {
    return VTEXFetch('/_v/create-user-and-project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  },
}; 