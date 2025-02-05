/* eslint-disable @typescript-eslint/no-explicit-any */
import { setLoadingSetup, setProjectUuid } from "../store/projectSlice";
import store from "../store/provider.store";
import { VTEXFetch } from "../utils/VTEXFetch";

export function getUserFromLocalStorage() {
  const user = localStorage.getItem('userData');
  return user ? JSON.parse(user) : null;
}

export async function fetchUserData() {
  try {
    const response = await VTEXFetch('/api/vtexid/pub/authenticated/user');

    if (!response || response.error) {
      throw new Error(response?.message || 'Erro ao buscar dados do usuário.');
    }

    return { success: true, data: response };
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    return { success: false, error: error || 'Erro desconhecido' };
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
    console.error('Erro ao verificar projeto:', error);
    return { success: false, error: error || 'Erro desconhecido' };
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
      throw new Error(response?.message || 'Erro ao criar usuário e projeto.');
    }

    store.dispatch(setProjectUuid(response.project_uuid));
    store.dispatch(setLoadingSetup(false));
    return { success: true, data: response };
  } catch (error) {
    console.error('Erro na criação do projeto e usuário:', error);
    store.dispatch(setLoadingSetup(false));
    return { success: false, error: error || 'Erro desconhecido' };
  }
}
