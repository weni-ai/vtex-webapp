import { VTEXFetch } from "../utils/VTEXFetch";

export function getUserFromLocalStorage() {
    const user = localStorage.getItem('userData');
    return user ? JSON.parse(user) : null;
}

export async function fetchUserData() {
  try {
    console.log('Chamando VTEXFetch...');
    const data  = await VTEXFetch('/api/vtexid/pub/authenticated/user');
    console.log('entrou na service: ', data)
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

