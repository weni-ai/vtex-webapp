import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Bleed,
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  IconPencil,
  Page,
  PageContent,
  PageHeader,
  PageHeaderRow,
  PageHeading,
  Stack,
} from '@vtex/shoreline';
import { selectUser, selectAccount } from '../../../store/userSlice';
import { selectOnboardingStatus, setOnboardingStatus } from '../../../store/onboardSlice';
import { updateOnboarding, activateInStore } from '../../../services/onboarding.service';
import { getWhatsAppConfig, getWhatsAppProfile } from '../../../services/channel.service';
import { SETUP_CHANNEL } from '../../../constants/onboarding';
import { CompletionBanner } from '../shared/CompletionBanner';
import { WhatsAppProfileCard } from '../../../components/shared/WhatsAppProfileCard';
import { WhatsAppPreview } from './WhatsAppPreview';
import { LiveTestSection } from './LiveTestSection';

interface WhatsAppProfileData {
  displayName: string | null;
  displayPhoneNumber: string | null;
  photoUrl: string | null;
}

export function WhatsAppTestAndActivate() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector(selectUser);
  const accountData = useSelector(selectAccount);
  const onboardingStatus = useSelector(selectOnboardingStatus);

  const wppCloudAppUuid = onboardingStatus?.config?.channels?.['wpp-cloud']?.app_uuid ?? null;
  const projectUuid = onboardingStatus?.project_uuid ?? null;

  const [isSkipping, setIsSkipping] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileData, setProfileData] = useState<WhatsAppProfileData>({
    displayName: null,
    displayPhoneNumber: null,
    photoUrl: null,
  });

  useEffect(() => {
    if (!wppCloudAppUuid || !projectUuid) {
      setIsLoadingProfile(false);
      return;
    }

    let cancelled = false;

    async function fetchProfileData() {
      setIsLoadingProfile(true);

      const [configResult, profileResult] = await Promise.all([
        getWhatsAppConfig(wppCloudAppUuid!, projectUuid!),
        getWhatsAppProfile(wppCloudAppUuid!),
      ]);

      if (cancelled) return;

      setProfileData({
        displayName: configResult.data?.displayName ?? null,
        displayPhoneNumber: configResult.data?.displayPhoneNumber ?? null,
        photoUrl: profileResult.data?.photoUrl ?? null,
      });

      setIsLoadingProfile(false);
    }

    fetchProfileData();

    return () => {
      cancelled = true;
    };
  }, [wppCloudAppUuid, projectUuid]);

  const handleSkip = useCallback(async () => {
    const vtexAccount = userData?.account;
    if (!vtexAccount) return;

    setIsSkipping(true);
    try {
      const result = await updateOnboarding(vtexAccount, { skipped: true });
      if (!result.success) {
        setIsSkipping(false);
        return;
      }

      dispatch(setOnboardingStatus({
        ...onboardingStatus!,
        skipped: true,
      }));

      navigate('/dash');
    } catch {
      setIsSkipping(false);
    }
  }, [userData?.account, navigate, dispatch, onboardingStatus]);

  const handleActivate = useCallback(async () => {
    const vtexAccount = userData?.account;
    const vtexAccountId = accountData?.id;
    if (!vtexAccountId || !wppCloudAppUuid || !vtexAccount) return;

    setIsActivating(true);
    try {
      const activation = await activateInStore(SETUP_CHANNEL.whatsapp, wppCloudAppUuid, vtexAccountId);
      if (activation.success) {
        await updateOnboarding(vtexAccount, { completed: true });
        dispatch(setOnboardingStatus({
          ...onboardingStatus!,
          completed: true,
        }));
        navigate('/dash', { state: { fromOnboarding: true } });
      }
    } finally {
      setIsActivating(false);
    }
  }, [accountData?.id, wppCloudAppUuid, userData?.account, navigate, dispatch, onboardingStatus]);

  const completionItems = useMemo(() => [
    t('onboarding.onboard_test.completion.knowledge_base'),
    t('onboarding.onboard_test.completion.business_rules'),
    t('onboarding.onboard_test.completion.abandoned_cart_ready'),
  ], [t]);

  return (
    <Page style={{ height: '100vh' }}>
      <PageHeader>
        <PageHeaderRow>
          <PageHeading>{t('onboarding.onboard_test.title')}</PageHeading>
          <Stack space="$space-3" horizontal>
            <Bleed top="$space-2" bottom="$space-2">
              <Button
                variant="secondary"
                size="large"
                onClick={handleSkip}
                disabled={isSkipping}
              >
                {t('common.skip')}
              </Button>
            </Bleed>
            <Bleed top="$space-2" bottom="$space-2">
              <Button
                variant="primary"
                size="large"
                onClick={handleActivate}
                disabled={isActivating}
                loading={isActivating}
              >
                {t('onboarding.onboard_test.activate_button')}
              </Button>
            </Bleed>
          </Stack>
        </PageHeaderRow>
      </PageHeader>

      <PageContent style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Flex direction="column" gap="$space-5" grow={1} style={{ minHeight: 0 }}>
          <CompletionBanner completionItems={completionItems} />

          <Divider />

          <Flex gap="$space-5" style={{ flex: 1, minHeight: 0 }}>
            <Flex direction="column" gap="$space-2" style={{ width: 613, flexShrink: 0 }}>
              <Heading variant="display3">
                {t('onboarding.onboard_test.whatsapp.preview_title')}
              </Heading>
              <WhatsAppPreview showBanner={false} centerContent={true}/>
            </Flex>

            <Flex direction="column" gap="$space-6" style={{ flex: 1, minWidth: 0 }}>
              <WhatsAppProfileCard
                title={t('onboarding.onboard_test.whatsapp.profile_settings_title')}
                displayName={profileData.displayName}
                displayPhoneNumber={profileData.displayPhoneNumber}
                photoUrl={profileData.photoUrl}
                isLoading={isLoadingProfile}
                editAction={
                  <IconButton label={t('settings.whatsapp.profile.edit')} variant="tertiary">
                    <IconPencil />
                  </IconButton>
                }
              />
              <LiveTestSection />
            </Flex>
          </Flex>
        </Flex>
      </PageContent>
    </Page>
  );
}
