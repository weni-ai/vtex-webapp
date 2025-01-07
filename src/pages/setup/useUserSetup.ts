import { useNavigate } from 'react-router-dom';
import { setUser } from '../../store/userSlice';
import { fetchUserData } from '../../services/user.service';
import { VTEXFetch } from '../../utils/VTEXFetch';
import { setProjectUuid } from '../../store/projectSlice';
import store from '../../store/provider.store';
import getEnv from '../../utils/env';

export function useUserSetup() {
  const navigate = useNavigate();

  const getToken = async () => {
    const client_id = getEnv('CLIENT_ID');
    const client_secret = getEnv('CLIENT_SECRET');

    const headersList = {
      "Accept": "*/*",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      "Content-Type": "application/x-www-form-urlencoded"
    }

    const bodyContent = `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`;

    const response = await fetch("https://accounts.weni.ai/auth/realms/weni-staging/protocol/openid-connect/token", {
      method: "POST",
      body: bodyContent,
      headers: headersList
    });

    const data = await response.text();
    console.log(data);
    return data

  }

  const initializeUser = async () => {
    let errorMessage = false;
    try{
      const token = await getToken();
      if(token){
        console.log('setando token na store...', token)
      }
    }catch(err){
      console.log(err)
    }
    try {
      const userData = await fetchUserData();
      if (userData) {
        store.dispatch(setUser(userData));
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
          console.log(response)
          store.dispatch(setProjectUuid(response.project_uuid));
        }).catch((error) => {
          console.error('Erro na criação do projeto e usuário:', error);
          errorMessage = error
        });
        navigate('/dash?useLocalVTEXFetch=true');
      }
    } catch (error) {
      console.error('Error:', error);
    }

    if (!errorMessage) {
      navigate('/agent-builder')
    }
  };

  return { initializeUser };
}
