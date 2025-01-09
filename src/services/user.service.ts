import { setProjectUuid } from "../store/projectSlice";
import store from "../store/provider.store";
import { VTEXFetch } from "../utils/VTEXFetch";

export function getUserFromLocalStorage() {
  const user = localStorage.getItem('userData');
  return user ? JSON.parse(user) : null;
}

export async function fetchUserData() {
  try {
    const data = await VTEXFetch('/api/vtexid/pub/authenticated/user');
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

async function checkProject(vtex_account: string, user_email: string) {
  const apiUrl = `https://api.stg.cloud.weni.ai/v2/commerce/check-project?vtex_account=${vtex_account}&user_email=${user_email}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Erro ao verificar projeto: ${response.statusText}`);
    }
    const result = await response.json();
    console.log('Check project result:', result);
    return result;
  } catch (error) {
    console.error('Error checking project:', error);
    throw error;
  }
}

export async function createUserAndProject(userData: any, token: string) {
  try {
    const check = await checkProject(userData.account, userData.user);
    if (check.data.has_project) {
      console.log('Projeto já existe:', check);
      return check;
    }

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

    console.log('Projeto criado com sucesso:', response);
    store.dispatch(setProjectUuid(response.project_uuid));
    return response;
  } catch (error) {
    console.error('Erro na criação do projeto e usuário:', error);
    throw error;
  }
}
