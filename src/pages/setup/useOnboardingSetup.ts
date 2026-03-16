import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOnboardingStatus, ensureProjectAndUser } from '../../services/onboarding.service';
import { initializeUserContext, initializeWeniPlatformContext } from '../../services/setup.service';
import { setAgentBuilder, setInitialLoading, setProjectUuid } from '../../store/projectSlice';
import { setOnboardingStatus } from '../../store/onboardSlice';
import store from '../../store/provider.store';
import { refreshChannelIntegrations } from '../../services/channel.service';
import { checkAgentIntegration } from '../../services/agent.service';
import { loadProjectDetail } from '../../services/project.service';

export function useOnboardingSetup() {
  const navigate = useNavigate();

  const initializeOnboarding = useCallback(async () => {
    store.dispatch(setInitialLoading(true));
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const embeddedWithin = searchParams.get('embedded_within');

      if (embeddedWithin === 'Weni Platform') {
        initializeWeniPlatformContext(searchParams);
        await loadProjectDetail();
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

        const [{ wppResponse, webchatResponse }, agentIntegrationResponse] = await Promise.all([
          refreshChannelIntegrations(projectUuid),
          checkAgentIntegration(projectUuid),
          loadProjectDetail(),
        ]);

        if (!wppResponse.success || wppResponse?.error) {
          throw new Error(JSON.stringify(wppResponse.error))
        }

        if (!webchatResponse.success || webchatResponse?.error) {
          throw new Error(JSON.stringify(webchatResponse.error))
        }

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
