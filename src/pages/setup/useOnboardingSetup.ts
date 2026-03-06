import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOnboardingStatus, ensureProjectAndUser } from '../../services/onboarding.service';
import { initializeUserContext, initializeWeniPlatformContext } from '../../services/setup.service';
import { setAgentBuilder, setFlowsChannelUuid, setInitialLoading, setProjectUuid, setWppCloudAppUuid } from '../../store/projectSlice';
import { setWhatsAppPhoneNumber } from '../../store/userSlice';
import { setOnboardingStatus } from '../../store/onboardSlice';
import store from '../../store/provider.store';
import { checkWppIntegration } from '../../services/channel.service';
import { setWhatsAppIntegrated } from '../../store/userSlice';
import { checkAgentIntegration } from '../../services/agent.service';

export function useOnboardingSetup() {
  const navigate = useNavigate();

  const initializeOnboarding = useCallback(async () => {
    store.dispatch(setInitialLoading(true));
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const embeddedWithin = searchParams.get('embedded_within');

      if (embeddedWithin === 'Weni Platform') {
        initializeWeniPlatformContext(searchParams);
        navigate('/dash');
        return;
      }

      const { userData } = await initializeUserContext();

      ensureProjectAndUser(userData.account, userData.user).then((result) => {
        if (result.success && result.data) {
          store.dispatch(setProjectUuid(result.data.project_uuid));
        } else {
          console.error('error ensuring project and user:', result.error);
        }
      });

      const onboardingStatus = await getOnboardingStatus(userData.account);
      if (!onboardingStatus.success || !onboardingStatus.data) {
        throw new Error(JSON.stringify(onboardingStatus.error))
      }

      store.dispatch(setOnboardingStatus(onboardingStatus.data));

      const projectUuid = onboardingStatus.data.project_uuid;
      if (projectUuid) {
        store.dispatch(setProjectUuid(projectUuid));

        // TODO: check in the future if this will be needed when we have the new dashboard and settings page
        const wppIntegrationResponse = await checkWppIntegration(projectUuid);
        if (!wppIntegrationResponse.success || wppIntegrationResponse?.error) {
          throw new Error(JSON.stringify(wppIntegrationResponse.error))
        }
        const { has_whatsapp = false, flows_channel_uuid = null, wpp_cloud_app_uuid = null, phone_number = null } = wppIntegrationResponse.data || {};
        if (has_whatsapp && wpp_cloud_app_uuid && flows_channel_uuid) {
          store.dispatch(setWhatsAppIntegrated(true));
          store.dispatch(setWppCloudAppUuid(wpp_cloud_app_uuid));
          store.dispatch(setFlowsChannelUuid(flows_channel_uuid));
          store.dispatch(setWhatsAppPhoneNumber(phone_number ? phone_number.replace(/\D/g, '') : null));
        }

        // TODO: check in the future if this will be needed when we have the new dashboard and settings page
        const agentIntegrationResponse = await checkAgentIntegration(projectUuid);
        if (agentIntegrationResponse?.error || !agentIntegrationResponse.data) {
          throw new Error(JSON.stringify(agentIntegrationResponse.error))
        }

        const { name = '', links = [], objective = '', occupation = '' } = agentIntegrationResponse.data.data;

        if (name) {
          agentIntegrationResponse.saveCache?.();

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

      }

      if (onboardingStatus.data.completed || onboardingStatus.data.skipped) {
        navigate('/dash');
        return;
      }

      navigate('/onboarding');
    } catch (error) {
      console.error('error in onboarding setup:', error);
      navigate('/setup-error');
    } finally {
      store.dispatch(setInitialLoading(false));
    }
  }, [navigate]);

  return { initializeOnboarding };
}
