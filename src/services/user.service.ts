import { userSetupProps } from "../pages/setup/useUserSetup";
import axios from 'axios';

export function getUserFromLocalStorage() {
    const user = localStorage.getItem('userData');
    return user ? JSON.parse(user) : null;
}

export async function fetchUserData(payload: userSetupProps): Promise<any> {
    try {
      const response = await axios.post(
        'http://vtex-io.apip.stg.cloud.weni.ai/create_user',
        payload,
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      const status = error.response?.status;
      throw new Error(`Erro na requisição: ${status || 'desconhecido'}`);
    }
  }
