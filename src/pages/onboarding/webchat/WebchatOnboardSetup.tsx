import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Flex, Link, Text, toast } from '@vtex/shoreline';
import { selectUser } from '../../../store/userSlice';
import { updateOnboarding } from '../../../services/onboarding.service';
import { selectOnboardingStatus, setOnboardingStatus } from '../../../store/onboardSlice';
import { ONBOARDING_PAGES } from '../../../constants/onboarding';
import { useOnboardProgress } from './useOnboardProgress';
import { ProgressBar } from './ProgressBar';
import { WebchatOnboardingLayout } from './WebchatOnboardingLayout';
import { UseCaseId } from './webchatUseCases';

const SETUP_DESCRIPTION_KEYS: Record<UseCaseId, string> = {
  catalog_concierge: 'onboarding.onboard_setup.use_cases.catalog_concierge.description',
  cancellations: 'onboarding.onboard_setup.use_cases.cancellations.description',
  order_status: 'onboarding.onboard_setup.use_cases.order_status.description',
  faq_assistant: 'onboarding.onboard_setup.use_cases.faq_assistant.description',
};

const SUPPORT_EMAIL = 'support.weni@vtex.com';

function FailedToastContent({ message, actionLabel }: { message: string; actionLabel: string }) {
  return (
    <Flex direction="column" gap="$space-1">
      <Text variant="emphasis">{message}</Text>
      <Link
        href={`mailto:${SUPPORT_EMAIL}`}
        style={{ fontWeight: 600 }}
      >
        {actionLabel}
      </Link>
    </Flex>
  );
}

export function WebchatOnboardSetup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector(selectUser);
  const onboardingStatus = useSelector(selectOnboardingStatus);
  const { currentStep, progress, isComplete, isFailed } = useOnboardProgress();

  const [isTesting, setIsTesting] = useState(false);
  const hasShownFailedToast = useRef(false);

  useEffect(() => {
    if (isFailed && !hasShownFailedToast.current) {
      hasShownFailedToast.current = true;
      toast.critical(
        <FailedToastContent
          message={t('onboarding.onboard_setup.progress.failed.toast_message')}
          actionLabel={t('onboarding.onboard_setup.progress.failed.contact_support')}
        />,
      );
    }
  }, [isFailed, t]);

  const handleSkip = useCallback(async () => {
    const vtexAccount = userData?.account;
    if (!vtexAccount) return;

    updateOnboarding(vtexAccount, { completed: true });
    navigate('/dash');
  }, [userData?.account, navigate]);

  const handleTest = useCallback(async () => {
    const vtexAccount = userData?.account;
    if (!vtexAccount || !onboardingStatus) return;

    setIsTesting(true);
    updateOnboarding(vtexAccount, { current_page: ONBOARDING_PAGES.ONBOARD_WEBCHAT_TEST });
    dispatch(setOnboardingStatus(
      {
        ...onboardingStatus!,
        current_page: ONBOARDING_PAGES.ONBOARD_WEBCHAT_TEST,
      }
    ));
  }, [userData?.account, onboardingStatus, dispatch]);

  const handleContactSupport = useCallback(() => {
    window.location.href = `mailto:${SUPPORT_EMAIL}`;
  }, []);

  const useCaseDescriptions = useMemo(
    () => Object.fromEntries(
      Object.entries(SETUP_DESCRIPTION_KEYS).map(([id, key]) => [id, t(key)]),
    ) as Record<UseCaseId, string>,
    [t],
  );

  const primaryAction = isFailed
    ? {
        label: t('onboarding.onboard_setup.progress.failed.contact_support'),
        onClick: handleContactSupport,
      }
    : {
        label: t('onboarding.onboard_setup.test_button'),
        onClick: handleTest,
        disabled: !isComplete || isTesting,
      };

  const skipAction = isFailed
    ? undefined
    : { onClick: handleSkip, disabled: !isComplete };

  return (
    <WebchatOnboardingLayout
      type="preview"
      title={t('onboarding.onboard_setup.title')}
      primaryAction={primaryAction}
      skipAction={skipAction}
      topSection={<ProgressBar currentStep={currentStep} progress={progress} isFailed={isFailed} />}
      useCasesTitle={t('onboarding.onboard_setup.use_cases.title')}
      useCaseDescriptions={useCaseDescriptions}
    />
  );
}
