import { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Flex, Heading } from '@vtex/shoreline';
import { selectUser } from '../store/userSlice';
import { selectOnboardingStatus, setOnboardingStatus } from '../store/onboardSlice';
import { updateOnboarding } from '../services/onboarding.service';
import { ONBOARDING_PAGES } from '../constants/onboarding';
import { useOnboardProgress } from '../pages/onboarding/webchat/useOnboardProgress';
import { ProgressBar } from '../pages/onboarding/webchat/ProgressBar';

export function SkippedOnboardingBanner() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector(selectUser);
  const onboardingStatus = useSelector(selectOnboardingStatus);
  const { currentStep, progress, isComplete } = useOnboardProgress();

  const [isActivating, setIsActivating] = useState(false);

  const handleStartActivation = useCallback(async () => {
    const vtexAccount = userData?.account;
    if (!vtexAccount || !onboardingStatus) return;

    setIsActivating(true);
    try {
      const result = await updateOnboarding(vtexAccount, { current_page: ONBOARDING_PAGES.ONBOARD_WEBCHAT_TEST });
      if (!result.success) {
        setIsActivating(false);
        return;
      }

      dispatch(setOnboardingStatus({
        ...onboardingStatus,
        current_page: ONBOARDING_PAGES.ONBOARD_WEBCHAT_TEST,
        skipped: false,
      }));
      navigate('/onboarding');
    } catch {
      setIsActivating(false);
    }
  }, [userData?.account, onboardingStatus, dispatch, navigate]);

  return (
    <Flex
      direction="column"
      gap="$space-4"
      style={{
        border: 'var(--sl-border-base)',
        borderRadius: 'var(--sl-radius-4)',
        padding: 'var(--sl-space-4)',
      }}
    >
      <Flex justify="space-between" align="center">
        <Heading variant="display2">
          {t('dashboard.skipped_onboarding.title')}
        </Heading>
        <Button
          variant="primary"
          size="normal"
          onClick={handleStartActivation}
          disabled={!isComplete || isActivating}
          loading={isActivating}
        >
          {t('dashboard.skipped_onboarding.start_activation')}
        </Button>
      </Flex>

      <ProgressBar currentStep={currentStep} progress={progress} />
    </Flex>
  );
}
