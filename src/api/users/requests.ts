import { UserData } from "../../interfaces/Store";
import { VTEXFetch } from "../../utils/VTEXFetch";

interface CreateUserAndProjectPayload {
  user_email: string;
  organization_name: string;
  project_name: string;
  vtex_account: string;
}

export const userRequests = {
  fetchAuthenticatedUser: async () => {
    return VTEXFetch<UserData & { error?: boolean, message?: string }>('/api/vtexid/pub/authenticated/user');
  },

  fetchAccountData: async () => {
    return VTEXFetch<{ error?: boolean, message?: string }>('/api/license-manager/account');
  },

  createUserAndProject: async (payload: CreateUserAndProjectPayload) => {
    return VTEXFetch<{ project_uuid: string, error?: boolean, message?: string }>(`/_v/create-user-and-project?user_email=${payload.user_email}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  },
}; 