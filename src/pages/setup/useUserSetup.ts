import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../store/userSlice';
import { fetchUserData } from '../../services/user.service';
import { VTEXFetch } from '../../utils/VTEXFetch';
import { setProjectUuid } from '../../store/projectSlice';

export function useUserSetup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initializeUser = async () => {
    try {
      const userData = await fetchUserData();
      console.log('userData: ', userData)
      if (userData) {
        dispatch(setUser(userData));
        const payload = {
          user_email: userData.user,
          organization_name: userData.account,
          project_name: `${userData.account} 01`,
          vtex_account: userData.account
        }

        await VTEXFetch('/_v/create-user-and-project', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }).then((response) => {
          console.log('Projeto criado com sucesso', response)
          dispatch(setProjectUuid(response.data.project_uuid));
          navigate('/agent-builder');
        }).catch((error) => {
          console.error('Erro na criação do projeto e usuário:', error);
          navigate('/error')
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return { initializeUser };
}
