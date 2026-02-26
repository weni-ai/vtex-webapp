import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOnboardingStatus, ensureProjectAndUser } from '../../services/onboarding.service';
import { initializeUserContext, initializeWeniPlatformContext } from '../../services/setup.service';
import { setInitialLoading, setProjectUuid } from '../../store/projectSlice';
import { setOnboardingStatus } from '../../store/onboardSlice';
import store from '../../store/provider.store';

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
        throw new Error(onboardingStatus.error || 'error fetching onboarding status.');
      }

      store.dispatch(setOnboardingStatus(onboardingStatus.data));

      const projectUuid = onboardingStatus.data.project_uuid;
      if (projectUuid) {
        store.dispatch(setProjectUuid(projectUuid));
      }

      if (onboardingStatus.data.completed) {
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
