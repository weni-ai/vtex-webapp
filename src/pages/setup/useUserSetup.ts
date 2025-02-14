import { useNavigate } from 'react-router-dom';
import { setAccount, setAgentIntegrated, setUser, setWhatsAppIntegrated } from '../../store/userSlice';
import { checkProject, createUserAndProject, fetchAccountData, fetchUserData } from '../../services/user.service';
import { setBaseAddress, setToken } from '../../store/authSlice';
import store from '../../store/provider.store';
import { getToken } from '../../services/auth.service';
import { setAgent, setFlowsChannelUuid, setIntegratedFeatures, setProjectUuid, setWppCloudAppUuid } from '../../store/projectSlice';
import { checkWppIntegration } from '../../services/channel.service';
import { checkAgentIntegration } from '../../services/agent.service';
import { useCallback } from 'react';
import { toast } from '@vtex/shoreline';
import { getIntegratedFeatures } from '../../services/features.service';

export function useUserSetup() {
  const navigate = useNavigate();

  const initializeProject = useCallback(async () => {
    try {
      const { token, error } = await getToken();
      if (error) {
        console.error("token not found");
        navigate('/setup-error');
        return;
      }
      store.dispatch(setToken(token));

      const { data: userData, error: errorData } = await fetchUserData();
      if (!userData || errorData) {
        console.error("user data not found");
        navigate('/setup-error');
        return;
      }

      store.dispatch(setUser(userData));

      const { data: accountData, error: accountError } = await fetchAccountData();
      if (!accountData || accountError) {
        console.error("user data not found");
        navigate('/setup-error');
        return;
      }

      store.dispatch(setAccount(accountData));

      if(accountData.hosts){
        store.dispatch(setBaseAddress(accountData.hosts[0]))
      }

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

        // TODO: get the complete list of fetaures
        // const featureList = await getFeatureList(project_uuid, token);
        // if (featureList?.error) {
        //   throw new Error(JSON.stringify(featureList.error))
        // }
        // if (featureList.data.features.length > 0) {
        //   store.dispatch(setFeatureList(featureList.data.features))
        // }

        console.log('aqui')
        const integratedFeatures = await getIntegratedFeatures(project_uuid, token);
        console.log('aqui de novo', integratedFeatures)
        if (integratedFeatures?.error) {
          throw new Error(JSON.stringify(integratedFeatures.error))
        }
        if (integratedFeatures.data.features.length > 0) {
          store.dispatch(setIntegratedFeatures(integratedFeatures.data.features))
        }

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

        if (has_whatsapp) {
          store.dispatch(setWhatsAppIntegrated(true));
          store.dispatch(setWppCloudAppUuid(wpp_cloud_app_uuid));
          store.dispatch(setFlowsChannelUuid(flows_channel_uuid));
        }

        if (has_agent && has_whatsapp) {
          store.dispatch(setAgentIntegrated(true))

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
        console.error("error during user initialization:", response.error);
        navigate('/setup-error');
      }
    }
  }, [navigate]);

  return { initializeProject, initializeUser };
}
