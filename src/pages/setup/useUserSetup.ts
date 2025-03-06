import { useNavigate } from 'react-router-dom';
import { setAccount, setAgentIntegrated, setUser, setWhatsAppIntegrated } from '../../store/userSlice';
import { checkProject, createUserAndProject, fetchAccountData, fetchUserData } from '../../services/user.service';
import { setBaseAddress, setToken } from '../../store/authSlice';
import store from '../../store/provider.store';
import { getToken } from '../../services/auth.service';
import { setAgent, setFlowsChannelUuid, setProjectUuid, setWppCloudAppUuid } from '../../store/projectSlice';
import { checkWppIntegration } from '../../services/channel.service';
import { checkAgentIntegration } from '../../services/agent.service';
import { useCallback } from 'react';
import { updateFeatureList } from '../../services/features.service';

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


      let base_address = `${userData.account}.myvtex.com`;
      if (accountData.hosts.length) {
        base_address = accountData.hosts[0]
      }
      store.dispatch(setBaseAddress(base_address));

      const result = await checkProject(userData.account, userData.user);
      if (result?.error) {
        throw new Error(JSON.stringify(result.error))
      }
      const { has_project, project_uuid } = result.data.data;

      if (has_project) {
        store.dispatch(setProjectUuid(project_uuid));

        const response = await checkWppIntegration(project_uuid);
        const { has_whatsapp = false, flows_channel_uuid = null, wpp_cloud_app_uuid = null } = response.data.data || {};

        if (response?.error) {
          throw new Error(JSON.stringify(response.error))
        }

        const agentIntegration = await checkAgentIntegration(project_uuid);
        if (agentIntegration?.error) {
          console.log('ta entrando aqui com: ', agentIntegration)
          throw new Error(JSON.stringify(agentIntegration.error))
        }

        const { name = '', links = '', objective = '', occupation = '', has_agent = false } = agentIntegration.data.data;

        if (name) {
          store.dispatch(
            setAgent({
              name,
              links,
              objective,
              occupation,
              channel: 'faststore'
            })
          );
        }

        if (has_whatsapp) {
          store.dispatch(setWhatsAppIntegrated(true));
          store.dispatch(setWppCloudAppUuid(wpp_cloud_app_uuid));
          store.dispatch(setFlowsChannelUuid(flows_channel_uuid));
          console.log('aqui')
          if (has_agent) {
            store.dispatch(setAgentIntegrated(true))

            console.log('aqui de novo')
            await updateFeatureList()
            navigate('/dash');
          } else {
            navigate('/agent-builder');
          }
        } else {
          navigate('/agent-builder');
        }
      } else {
        navigate('/agent-details');
      }
    } catch (err) {
      console.error(err);
      navigate('/setup-error');
    }
  }, [navigate]);

  const initializeUser = useCallback(async () => {
    const userData = store.getState().user.userData;
    const project_uuid = store.getState().project.project_uuid
    if (!project_uuid) {
      const response = await createUserAndProject(userData);
      if (response.error) {
        console.error("error during user initialization:", response.error);
        navigate('/setup-error');
      }
    }
  }, [navigate]);

  return { initializeProject, initializeUser };
}
