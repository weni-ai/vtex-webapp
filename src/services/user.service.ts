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
    const data = await VTEXFetch('/api/vtexid/pub/authenticated/user');
    if(data.error){
      throw new Error(data.message)
    }
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
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
    if (!response.ok) {
      throw new Error(`Erro ao verificar projeto: ${response.statusText}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error checking project:', error);
    throw new Error(JSON.stringify(error))
  }
}

export async function createUserAndProject(userData: any, token: string) {
  store.dispatch(setLoadingSetup(true))
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
    store.dispatch(setProjectUuid(response.project_uuid));
    store.dispatch(setLoadingSetup(false))
    if(response.error){
      throw new Error(response.message)
    }
    return response;
  } catch (error) {
    console.error('Erro na criação do projeto e usuário:', error);
    throw error;
  }
}
