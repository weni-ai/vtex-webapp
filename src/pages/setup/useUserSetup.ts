import { useNavigate } from 'react-router-dom';
import { setUser } from '../../store/userSlice';
import { checkProject, createUserAndProject, fetchUserData } from '../../services/user.service';
import { setToken } from '../../store/authSlice';
import store from '../../store/provider.store';
import { getToken } from '../../services/auth.service';
import { toast } from '@vtex/shoreline';

export function useUserSetup() {
  const navigate = useNavigate();

  const initializeProject = async () => {
    try {
      console.log('pegando o token...')
      const token = await getToken();
      console.log('o token', token)
      if (!token) {
        console.error("Token não encontrado");
        return;
      }
      store.dispatch(setToken(token));


      console.log('pegando os dados do user...')
      const userData = await fetchUserData();
      console.log('os dados do user: ', userData)
      if (!userData) {
        console.error("Dados do usuário não encontrados");
        return;
      }
      store.dispatch(setUser(userData));

      console.log('checkando o projeto...')
      const result = await checkProject(userData.account, userData.user, token)
      console.log('os dados do projeto', result)
      if (result.data.has_project) {
        console.log('entrando na dash')
        navigate('/dash')
      } else {
        console.log('entrando no agent')
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
