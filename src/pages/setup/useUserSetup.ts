import { useNavigate } from 'react-router-dom';
import { setUser } from '../../store/userSlice';
import { checkProject, createUserAndProject, fetchUserData } from '../../services/user.service';
import { setToken } from '../../store/authSlice';
import store from '../../store/provider.store';
import { getToken } from '../../services/auth.service';
import { toast } from '@vtex/shoreline';
import { setProjectUuid } from '../../store/projectSlice';
import { checkWppIntegration } from '../../services/channel.service';

export function useUserSetup() {
  const navigate = useNavigate();

  const initializeProject = async () => {
    console.log('aqui')
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
      const result = await checkProject(userData.account, userData.user, token)
      if (result.data.has_project) {
        store.dispatch(setProjectUuid(result.data.project_uuid));
        console.log('checando o zapzap...')
        const hasWpp = await checkWppIntegration(result.data.project_uuid, token)
        console.log('resultado: ',hasWpp)
        navigate('/dash')
      } else {
        navigate('/agent-details')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const initializeUser = async () => {
    const userData = store.getState().user.userData
    const token = store.getState().auth.token
    try {
      await createUserAndProject(userData, token);
    } catch (error) {
      console.error("Erro durante a inicialização do usuário:", error);
      toast.critical('Erro durante a inicialização do usuário. Tente novamente mais tarde.')
      navigate('/setup-error');
    }
  };

  return { initializeProject, initializeUser };
}
