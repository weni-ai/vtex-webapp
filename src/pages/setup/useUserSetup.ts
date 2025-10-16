import * as Sentry from '@sentry/react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { growthbook } from '../../plugins/growthbook';
import { checkAgentIntegration, updateAgentsList } from '../../services/agent.service';
import { checkWppIntegration } from '../../services/channel.service';
import { checkProject, createUserAndProject, fetchAccountData, fetchUserData } from '../../services/user.service';
import { setBaseAddress } from '../../store/authSlice';
import { setAgentBuilder, setFlowsChannelUuid, setInitialLoading, setProjectUuid, setWppCloudAppUuid } from '../../store/projectSlice';
import store from '../../store/provider.store';
import { setAccount, setAgentBuilderIntegrated, setUser, setWhatsAppIntegrated, setWhatsAppPhoneNumber } from '../../store/userSlice';
import { setEmbeddedWithin } from '../../store/appSlice';
import { moduleStorage } from '../../utils/storage';

export function useUserSetup() {
  const navigate = useNavigate();

  const initializeProject = useCallback(async () => {
    try {
      store.dispatch(setInitialLoading(true));

      const searchParams = new URLSearchParams(window.location.search);
      const embeddedWithin = searchParams.get('embedded_within');

      if (embeddedWithin === 'Weni Platform') {
        const accessToken = searchParams.get('access_token') as string;
        const userEmail = searchParams.get('user_email') as string;
        const projectUuid = searchParams.get('project_uuid') as string;

        store.dispatch(setEmbeddedWithin('Weni Platform'));
        store.dispatch(setProjectUuid(projectUuid));

        moduleStorage.setItem('access_token', accessToken);

        Sentry.setUser({
          email: userEmail,
        });

        await updateAgentsList();

        navigate('/dash');
      } else {

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

        Sentry.setUser({
          email: userData.user,
          VTEXAccountName: userData.account,
        });

        window.hj?.('identify', userData.user, {
          'VTEX Account Name': userData.account,
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
          result.saveCache?.();

          store.dispatch(setProjectUuid(project_uuid));
          await updateAgentsList();

          const response = await checkWppIntegration(project_uuid);
          const { has_whatsapp = false, flows_channel_uuid = null, wpp_cloud_app_uuid = null, phone_number = null } = response.data || {};

          if (response?.error) {
            throw new Error(JSON.stringify(response.error))
          }

          const agentIntegration = await checkAgentIntegration(project_uuid);
          if (agentIntegration?.error || !agentIntegration.data) {
            throw new Error(JSON.stringify(agentIntegration.error))
          }

          const { name = '', links = [], objective = '', occupation = '', has_agent = false } = agentIntegration.data.data;

          if (name) {
            agentIntegration.saveCache?.();

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
            store.dispatch(setWhatsAppPhoneNumber(phone_number ? phone_number.replace(/\D/g, '') : null));
          }

          await updateAgentsList();

          if (has_agent) {
            store.dispatch(setAgentBuilderIntegrated(true))
            navigate('/dash');
          } else {
            navigate('/onboarding');
          }
        } else {
          navigate('/agent-details');
        }
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
