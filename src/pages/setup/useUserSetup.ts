import { useNavigate } from 'react-router-dom';
import { setUser, setWhatsAppIntegrated } from '../../store/userSlice';
import { checkProject, createUserAndProject, fetchUserData } from '../../services/user.service';
import { setToken } from '../../store/authSlice';
import store from '../../store/provider.store';
import { getToken } from '../../services/auth.service';
import { setAgent, setFlowsChannelUuid, setProjectUuid, setWppCloudAppUuid } from '../../store/projectSlice';
import { checkWppIntegration } from '../../services/channel.service';
import { checkAgentIntegration } from '../../services/agent.service';

export function useUserSetup() {
  const navigate = useNavigate();

  const initializeProject = async () => {
    try {
      const token = await getToken();
      if (!token) {
        console.error("Token não encontrado");
        navigate('/setup-error')
        return;
      }
      store.dispatch(setToken(token));

      const userData = await fetchUserData();
      if (!userData) {
        console.error("Dados do usuário não encontrados");
        navigate('/setup-error')
        return;
      }

      store.dispatch(setUser(userData));

      const result = await checkProject(userData.account, userData.user, token)
      const {has_project, project_uuid} = result.data

      if (has_project) {
        store.dispatch(setProjectUuid(project_uuid));

        const response = await checkWppIntegration(project_uuid, token)
        const {has_whatsapp, flows_channel_uuid, wpp_cloud_app_uuid} = response.data

        const agentIntegration  = await checkAgentIntegration(project_uuid, token)
        const {name, links, objective, occupation} = agentIntegration.data
        if(name){
          store.dispatch(setAgent({
            name,
            links,
            objective,
            occupation
          }))
        }

        if (has_whatsapp && name) {
          store.dispatch(setWhatsAppIntegrated(true))
          store.dispatch(setWppCloudAppUuid(wpp_cloud_app_uuid))
          store.dispatch(setFlowsChannelUuid(flows_channel_uuid))

          navigate('/dash')
        } else {
          navigate('/agent-builder')
        }
      } else {
        navigate('/agent-details')
      }
    } catch (err) {
      console.log(err)
      navigate('/setup-error');
    }
  }

  const initializeUser = async () => {
    const userData = store.getState().user.userData
    const token = store.getState().auth.token
    try {
      await createUserAndProject(userData, token);
    } catch (error) {
      console.error("Erro durante a inicialização do usuário:", error);
      navigate('/setup-error');
    }
  };

  return { initializeProject, initializeUser };
}
