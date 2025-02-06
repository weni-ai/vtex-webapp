import { useNavigate } from 'react-router-dom';
import { setAgentIntegrated, setFeatureIntegrated, setUser, setWhatsAppIntegrated } from '../../store/userSlice';
import { checkProject, createUserAndProject, fetchUserData } from '../../services/user.service';
import { setToken } from '../../store/authSlice';
import store from '../../store/provider.store';
import { getToken } from '../../services/auth.service';
import { setAgent, setFeatureList, setFlowsChannelUuid, setProjectUuid, setWppCloudAppUuid } from '../../store/projectSlice';
import { checkWppIntegration } from '../../services/channel.service';
import { checkAgentIntegration } from '../../services/agent.service';
import { getFeatureList } from '../../services/features.service';
import { useCallback } from 'react';
import { toast } from '@vtex/shoreline';

export function useUserSetup() {
  const navigate = useNavigate();

  const initializeProject = useCallback(async () => {
    try {
      const { token, error } = await getToken();
      if (error) {
        console.error("Token não encontrado");
        navigate('/setup-error');
        return;
      }
      store.dispatch(setToken(token));

      const { data: userData, error: errorData } = await fetchUserData();
      if (!userData || errorData) {
        console.error("Dados do usuário não encontrados");
        navigate('/setup-error');
        return;
      }

      store.dispatch(setUser(userData));

      const result = await checkProject(userData.account, userData.user, token);
      if (result?.error) {
        throw new Error(JSON.stringify(result.error))
      }
      const { has_project, project_uuid } = result.data.data;

      if (has_project) {
        store.dispatch(setProjectUuid(project_uuid));

        const response = await checkWppIntegration(project_uuid, token);
        const { has_whatsapp = false, flows_channel_uuid = null, wpp_cloud_app_uuid = null } = response.data.data || {};
        if (response?.error) {
          throw new Error(response.error)
        }

        const featureList = await getFeatureList(project_uuid, token);
        if (featureList?.error) {
          throw new Error(JSON.stringify(featureList.error))
        }
        store.dispatch(setFeatureList(featureList.data.features))

        const agentIntegration = await checkAgentIntegration(project_uuid, token);
        if (agentIntegration.error) {
          throw new Error(agentIntegration.error)
        }

        const { name = '', links = '', objective = '', occupation = '', has_agent = false } = agentIntegration.data.data;

        if (name) {
          store.dispatch(
            setAgent({
              name,
              links,
              objective,
              occupation,
            })
          );
        }

        if (has_agent && has_whatsapp) {
          store.dispatch(setWhatsAppIntegrated(true));
          store.dispatch(setAgentIntegrated(true))
          store.dispatch(setWppCloudAppUuid(wpp_cloud_app_uuid));
          store.dispatch(setFlowsChannelUuid(flows_channel_uuid));

          navigate('/dash');

        } else {
          navigate('/agent-builder');
        }
      } else {
        navigate('/agent-details');
      }
    } catch (err) {
      console.error(err);
      toast.critical(t('integration.error'));
      navigate('/setup-error');
    }
  }, [navigate]);

  const initializeUser = useCallback(async () => {
    const userData = store.getState().user.userData;
    const token = store.getState().auth.token;
    const project_uuid = store.getState().project.project_uuid
    if (!project_uuid) {
      const response = await createUserAndProject(userData, token);
      if (response.error) {
        console.error("Erro durante a inicialização do usuário:", response.error);
        navigate('/setup-error');
      }
    }
  }, [navigate]);

  return { initializeProject, initializeUser };
}
