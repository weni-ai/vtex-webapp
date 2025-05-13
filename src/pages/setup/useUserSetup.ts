import { useNavigate } from 'react-router-dom';
import { setAccount, setAgentBuilderIntegrated, setUser, setWhatsAppIntegrated } from '../../store/userSlice';
import { checkProject, createUserAndProject, fetchAccountData, fetchUserData } from '../../services/user.service';
import { setBaseAddress } from '../../store/authSlice';
import store from '../../store/provider.store';
import { setAgentBuilder, setFlowsChannelUuid, setInitialLoading, setProjectUuid, setWppCloudAppUuid } from '../../store/projectSlice';
import { checkWppIntegration } from '../../services/channel.service';
import { checkAgentIntegration } from '../../services/agent.service';
import { useCallback } from 'react';
import { updateAgentsList } from '../../services/agent.service';
import { growthbook } from '../../plugins/growthbook';

export function useUserSetup() {
  const navigate = useNavigate();

  const initializeProject = useCallback(async () => {
    try {
      store.dispatch(setInitialLoading(true));
      
      const { data: userData, error: errorData } = await fetchUserData();
      if (!userData || errorData) {
        console.error("user data not found");
        navigate('/setup-error');
        return;
      }

      store.dispatch(setUser(userData));

      growthbook.setAttributes({
        email: userData.user,
        VTEXAccountName: userData.account,
      });

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
      if (result?.error || !result.data) {
        throw new Error(JSON.stringify(result.error))
      }
      const { has_project, project_uuid } = result.data.data;

      if (has_project) {
        store.dispatch(setProjectUuid(project_uuid));
        await updateAgentsList();

        const response = await checkWppIntegration(project_uuid);
        const { has_whatsapp = false, flows_channel_uuid = null, wpp_cloud_app_uuid = null } = response.data || {};

        if (response?.error) {
          throw new Error(JSON.stringify(response.error))
        }

        const agentIntegration = await checkAgentIntegration(project_uuid);
        if (agentIntegration?.error || !agentIntegration.data) {
          throw new Error(JSON.stringify(agentIntegration.error))
        }

        const { name = '', links = [], objective = '', occupation = '', has_agent = false } = agentIntegration.data.data;

        if (name) {
          store.dispatch(
            setAgentBuilder({
              name,
              links,
              objective,
              occupation,
              channel: '',
            })
          );
        }

        if (has_whatsapp && wpp_cloud_app_uuid && flows_channel_uuid) {
          store.dispatch(setWhatsAppIntegrated(true));
          store.dispatch(setWppCloudAppUuid(wpp_cloud_app_uuid));
          store.dispatch(setFlowsChannelUuid(flows_channel_uuid));

          await updateAgentsList();
          
          if (has_agent && store.getState().project.storeType) {
            store.dispatch(setAgentBuilderIntegrated(true))
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
    } finally {
      store.dispatch(setInitialLoading(false));
    }
  }, [navigate]);

  const initializeUser = useCallback(async () => {
    const userData = store.getState().user.userData;
    const project_uuid = store.getState().project.project_uuid
    if (!project_uuid && userData) {
      const response = await createUserAndProject(userData);
      if (response.error) {
        console.error("error during user initialization:", response.error);
        navigate('/setup-error');
      }
    }
  }, [navigate]);

  return { initializeProject, initializeUser };
}
