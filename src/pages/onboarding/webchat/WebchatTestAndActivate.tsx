import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Divider,
  Flex,
} from '@vtex/shoreline';
import { selectAccount, selectUser } from '../../../store/userSlice';
import { selectOnboardingStatus, setOnboardingStatus } from '../../../store/onboardSlice';
import {
  updateOnboarding,
  updateDisplayRatio,
  activateInStore,
} from '../../../services/onboarding.service';
import { WebchatOnboardingLayout } from './WebchatOnboardingLayout';
import { UseCaseId } from './webchatUseCases';
import { Instructions } from '../../../components/manager/Instructions';
import { SETUP_CHANNEL } from '../../../constants/onboarding';
import { CompletionBanner } from '../shared/CompletionBanner';
import { ActivationSection } from '../../../components/shared/ActivationSection';
import { DISPLAY_RATIO } from '../../../components/shared/activationConstants';
import type { ActivationMode } from '../../../components/shared/activationConstants';
import { useDispatch } from 'react-redux';

const TEST_DESCRIPTION_KEYS: Record<UseCaseId, string> = {
  catalog_concierge: 'onboarding.onboard_test.scenarios.catalog_concierge',
  cancellations: 'onboarding.onboard_test.scenarios.cancellations',
  order_status: 'onboarding.onboard_test.scenarios.order_status',
  faq_assistant: 'onboarding.onboard_test.scenarios.faq_assistant',
};

export function WebchatTestAndActivate() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userData = useSelector(selectUser);
  const accountData = useSelector(selectAccount);
  const onboardingStatus = useSelector(selectOnboardingStatus);
  const dispatch = useDispatch();
  
  const webchatAppUuid = onboardingStatus?.config?.channels?.wwc?.app_uuid ?? null;

  const [activationMode, setActivationMode] = useState<ActivationMode>('safe');
  const [isSkipping, setIsSkipping] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const handleActivationModeChange = useCallback(async (mode: ActivationMode) => {
    setActivationMode(mode);

    if (!webchatAppUuid) return;

    const displayRatio = DISPLAY_RATIO[mode];
    await updateDisplayRatio(webchatAppUuid, displayRatio);
  }, [webchatAppUuid]);

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

      // update onboarding status to skipped
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
    if (!vtexAccountId || !webchatAppUuid || !vtexAccount) return;

    setIsActivating(true);
    try {
      const activation = await activateInStore(SETUP_CHANNEL.webchat, webchatAppUuid, vtexAccountId);
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
  }, [accountData?.id, webchatAppUuid, userData?.account, navigate, dispatch, onboardingStatus]);

  const completionItems = useMemo(() => [
    t('onboarding.onboard_test.completion.knowledge_base'),
    t('onboarding.onboard_test.completion.business_rules'),
    t('onboarding.onboard_test.completion.agents_ready'),
  ], [t]);

  const useCaseDescriptions = useMemo(
    () => Object.fromEntries(
      Object.entries(TEST_DESCRIPTION_KEYS).map(([id, key]) => [id, t(key)]),
    ) as Record<UseCaseId, string>,
    [t],
  );

  const belowCards = (
    <Flex direction="column" gap="$space-6" style={{ marginTop: 'var(--sl-space-2)' }}>
      <Instructions />

      <Divider />

      <ActivationSection
        activationMode={activationMode}
        onModeChange={handleActivationModeChange}
      />
    </Flex>
  );

  return (
    <WebchatOnboardingLayout
      type="test"
      title={t('onboarding.onboard_test.title')}
      primaryAction={{
        label: t('onboarding.onboard_test.activate_button'),
        onClick: handleActivate,
        disabled: isActivating,
        loading: isActivating,
      }}
      skipAction={{
        onClick: handleSkip,
        disabled: isSkipping,
      }}
      topSection={<CompletionBanner completionItems={completionItems} />}
      useCasesTitle={t('onboarding.onboard_test.scenarios.title')}
      useCaseDescriptions={useCaseDescriptions}
      belowCards={belowCards}
      webchatAppUuid={webchatAppUuid}
    />
  );
}
