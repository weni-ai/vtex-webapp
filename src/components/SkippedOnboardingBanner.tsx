import { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Flex, Heading } from '@vtex/shoreline';
import { selectUser } from '../store/userSlice';
import { selectOnboardingStatus, setOnboardingStatus } from '../store/onboardSlice';
import { updateOnboarding } from '../services/onboarding.service';
import { ONBOARDING_PAGES, SUPPORT_EMAIL } from '../constants/onboarding';
import { useOnboardProgress } from '../pages/onboarding/webchat/useOnboardProgress';
import { ProgressBar } from '../pages/onboarding/webchat/ProgressBar';

export function SkippedOnboardingBanner() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector(selectUser);
  const onboardingStatus = useSelector(selectOnboardingStatus);
  const { currentStep, progress, isComplete, isFailed } = useOnboardProgress();

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

  const handleContactSupport = useCallback(() => {
    const anchor = document.createElement('a');
    anchor.href = `mailto:${SUPPORT_EMAIL}`;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.click();
  }, []);

  const title = isFailed
    ? t('dashboard.skipped_onboarding.failed_title')
    : t('dashboard.skipped_onboarding.title');

  return (
    <Flex
      direction="column"
      gap="$space-4"
      style={{
        border: 'var(--sl-border-base)',
        borderRadius: 'var(--sl-radius-3)',
        padding: 'var(--sl-space-4)',
      }}
    >
      <Flex justify="space-between" align="center">
        <Heading variant="display2">
          {title}
        </Heading>
        {isFailed ? (
          <Button
            variant="primary"
            size="normal"
            onClick={handleContactSupport}
          >
            {t('onboarding.onboard_setup.progress.failed.contact_support')}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="normal"
            onClick={handleStartActivation}
            disabled={!isComplete || isActivating}
            loading={isActivating}
          >
            {t('dashboard.skipped_onboarding.start_activation')}
          </Button>
        )}
      </Flex>

      <ProgressBar currentStep={currentStep} progress={progress} isFailed={isFailed} />
    </Flex>
  );
}
