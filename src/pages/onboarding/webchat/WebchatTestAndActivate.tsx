import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Divider,
  Flex,
  Heading,
  IconCheckCircleFill,
  Radio,
  RadioGroup,
  Text,
  useRadioState,
} from '@vtex/shoreline';
import { selectAccount, selectUser } from '../../../store/userSlice';
import { selectOnboardingStatus } from '../../../store/onboardSlice';
import {
  updateOnboarding,
  updateDisplayRatio,
  activateInStore,
} from '../../../services/onboarding.service';
import { WebchatOnboardingLayout } from './WebchatOnboardingLayout';
import { UseCaseId } from './webchatUseCases';
import { Instructions } from '../../../components/manager/Instructions';
import { CRAWLING_CHANNEL } from '../../../constants/onboarding';

type ActivationMode = 'safe' | 'full';

const DISPLAY_RATIO: Record<ActivationMode, number> = {
  safe: 10,
  full: 100,
};

const TEST_DESCRIPTION_KEYS: Record<UseCaseId, string> = {
  catalog_concierge: 'onboarding.onboard_test.scenarios.catalog_concierge',
  cancellations: 'onboarding.onboard_test.scenarios.cancellations',
  order_status: 'onboarding.onboard_test.scenarios.order_status',
  faq_assistant: 'onboarding.onboard_test.scenarios.faq_assistant',
};

function CompletionBanner() {
  const { t } = useTranslation();

  const completionItems = [
    t('onboarding.onboard_test.completion.knowledge_base'),
    t('onboarding.onboard_test.completion.business_rules'),
    t('onboarding.onboard_test.completion.agents_ready'),
  ];

  return (
    <Flex direction="column" gap="$space-3">
      <Flex gap="$space-2" align="center">
        <IconCheckCircleFill style={{ color: 'var(--sl-color-green-8)', fontSize: 20 }} />
        <Heading variant="display3">
          {t('onboarding.onboard_test.completion.heading')}
        </Heading>
      </Flex>

      <Flex gap="$space-4">
        {completionItems.map((item) => (
          <Text key={item} variant="body">
            {`✓ ${item}`}
          </Text>
        ))}
      </Flex>
    </Flex>
  );
}

interface ActivationSectionProps {
  activationMode: ActivationMode;
  onModeChange: (mode: ActivationMode) => void;
}

function ActivationSection(props: ActivationSectionProps) {
  const { activationMode, onModeChange } = props;
  const { t } = useTranslation();

  const radioState = useRadioState({
    defaultValue: activationMode,
    setValue: (value) => {
      if (value === 'safe' || value === 'full') {
        onModeChange(value);
      }
    },
  });

  const descriptionKey = activationMode === 'safe'
    ? 'onboarding.onboard_test.activation.safe_description'
    : 'onboarding.onboard_test.activation.full_description';

  return (
    <RadioGroup
      label={t('onboarding.onboard_test.activation.title')}
      horizontal
      state={radioState}
      description={t(descriptionKey)}
    >
      <Radio value="safe">
        {t('onboarding.onboard_test.activation.safe_label')}
      </Radio>
      <Radio value="full">
        {t('onboarding.onboard_test.activation.full_label')}
      </Radio>
    </RadioGroup>
  );
}

export function WebchatTestAndActivate() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userData = useSelector(selectUser);
  const accountData = useSelector(selectAccount);
  const onboardingStatus = useSelector(selectOnboardingStatus);

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
      const result = await updateOnboarding(vtexAccount, { completed: true });
      if (!result.success) {
        setIsSkipping(false);
        return;
      }

      navigate('/dash');
    } catch {
      setIsSkipping(false);
    }
  }, [userData?.account, navigate]);

  const handleActivate = useCallback(async () => {
    const vtexAccount = userData?.account;
    const vtexAccountId = accountData?.id;
    if (!vtexAccountId || !webchatAppUuid || !vtexAccount) return;

    setIsActivating(true);
    try {
      const activation = await activateInStore(CRAWLING_CHANNEL.webchat, webchatAppUuid, vtexAccountId);
      if (activation.success) {
        await updateOnboarding(vtexAccount, { completed: true });
        navigate('/dash');
      }
    } finally {
      setIsActivating(false);
    }
  }, [accountData?.id, webchatAppUuid, userData?.account, navigate]);

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
      topSection={<CompletionBanner />}
      useCasesTitle={t('onboarding.onboard_test.scenarios.title')}
      useCaseDescriptions={useCaseDescriptions}
      belowCards={belowCards}
      webchatAppUuid={webchatAppUuid}
    />
  );
}
