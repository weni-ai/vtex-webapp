import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Bleed,
  Button,
  Divider,
  Flex,
  Heading,
  Link,
  Page,
  PageContent,
  PageHeader,
  PageHeaderRow,
  PageHeading,
  Stack,
  Text,
  toast,
} from '@vtex/shoreline';
import { selectUser } from '../../../store/userSlice';
import { updateOnboarding } from '../../../services/onboarding.service';
import { selectOnboardingStatus, setOnboardingStatus } from '../../../store/onboardSlice';
import { ONBOARDING_PAGES, SUPPORT_EMAIL } from '../../../constants/onboarding';
import { useOnboardProgress } from '../shared/useOnboardProgress';
import { ProgressBar } from '../shared/ProgressBar';
import { WhatsAppPreview } from './WhatsAppPreview';

function FailedToastContent({ message, actionLabel }: { message: string; actionLabel: string }) {
  return (
    <Flex direction="column" gap="$space-1">
      <Text variant="emphasis">{message}</Text>
      <Link
        href={`mailto:${SUPPORT_EMAIL}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontWeight: 600 }}
      >
        {actionLabel}
      </Link>
    </Flex>
  );
}

export function WhatsAppOnboardSetup() {
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

    updateOnboarding(vtexAccount, { skipped: true });
    dispatch(setOnboardingStatus({
      ...onboardingStatus!,
      skipped: true,
    }));
    navigate('/dash');
  }, [userData?.account, navigate, dispatch, onboardingStatus]);

  const handleTest = useCallback(async () => {
    const vtexAccount = userData?.account;
    if (!vtexAccount || !onboardingStatus) return;

    setIsTesting(true);
    updateOnboarding(vtexAccount, { current_page: ONBOARDING_PAGES.ONBOARD_WHATSAPP_TEST });
    dispatch(setOnboardingStatus({
      ...onboardingStatus,
      current_page: ONBOARDING_PAGES.ONBOARD_WHATSAPP_TEST,
    }));
  }, [userData?.account, onboardingStatus, dispatch]);

  const handleContactSupport = useCallback(() => {
    const anchor = document.createElement('a');
    anchor.href = `mailto:${SUPPORT_EMAIL}`;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.click();
  }, []);

  const primaryAction = isFailed
    ? { label: t('onboarding.onboard_setup.progress.failed.contact_support'), onClick: handleContactSupport }
    : { label: t('onboarding.onboard_setup.test_button'), onClick: handleTest, disabled: !isComplete || isTesting };

  const skipAction = isFailed
    ? undefined
    : { onClick: handleSkip, disabled: !isComplete };

  return (
    <Page style={{ height: '100vh' }}>
      <PageHeader>
        <PageHeaderRow>
          <PageHeading>{t('onboarding.onboard_setup.title')}</PageHeading>
          <Stack space="$space-3" horizontal>
            {skipAction && (
              <Bleed top="$space-2" bottom="$space-2">
                <Button
                  variant="secondary"
                  size="large"
                  onClick={skipAction.onClick}
                >
                  {t('common.skip')}
                </Button>
              </Bleed>
            )}
            <Bleed top="$space-2" bottom="$space-2">
              <Button
                variant="primary"
                size="large"
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled}
              >
                {primaryAction.label}
              </Button>
            </Bleed>
          </Stack>
        </PageHeaderRow>
      </PageHeader>

      <PageContent style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Flex direction="column" gap="$space-5" grow={1} style={{ minHeight: 0 }}>
          <ProgressBar currentStep={currentStep} progress={progress} isFailed={isFailed} />

          <Divider />

          <Flex direction="column" gap="$space-4" style={{ flex: 1, minHeight: 0 }}>
            <Heading variant="display3">
              {t('onboarding.onboard_setup.whatsapp_preview_title')}
            </Heading>

            <WhatsAppPreview />
          </Flex>
        </Flex>
      </PageContent>
    </Page>
  );
}
