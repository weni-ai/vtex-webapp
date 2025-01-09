import { useNavigate } from 'react-router-dom';
import { setUser } from '../../store/userSlice';
import { createUserAndProject, fetchUserData } from '../../services/user.service';
import { setToken } from '../../store/authSlice';
import store from '../../store/provider.store';
import { getToken } from '../../services/auth.service';

export function useUserSetup() {
  const navigate = useNavigate();

  const initializeUser = async () => {
    try {
      const token = await getToken();
      if (!token) {
        console.error("Token não encontrado");
        return;
      }
      store.dispatch(setToken(token));

      const userData = await fetchUserData();
      if (!userData) {
        console.error("Dados do usuário não encontrados");
        return;
      }
      store.dispatch(setUser(userData));

      const response = await createUserAndProject(userData, token);

      if (response?.data?.has_project) {
        navigate('/dash');
      } else {
        navigate('/agent-builder');
      }
    } catch (error) {
      console.error("Erro durante a inicialização do usuário:", error);
    }
  };

  return { initializeUser };
}
