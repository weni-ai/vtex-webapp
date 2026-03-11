import { Flex, Heading, Skeleton, Text } from '@vtex/shoreline';
import { useTranslation } from 'react-i18next';
import { ActivationSection } from '../shared/ActivationSection';
import type { ActivationMode } from '../shared/activationConstants';
import { Button } from '../adapters/Button';
import { openPlatformUrl } from '../../utils/platform';
import type { WebchatConfig } from '../../interfaces/Webchat';

interface WebchatSectionProps {
  webchatConfig: WebchatConfig | null;
  isLoading: boolean;
  activationMode: ActivationMode;
  onActivationModeChange: (mode: ActivationMode) => void;
}

const cardStyle: React.CSSProperties = {
  flex: '1 1 0',
  border: '$border-base',
  borderRadius: '$radius-2',
  padding: '$space-4',
  minHeight: '140px',
};

const avatarContainerStyle: React.CSSProperties = {
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  flexShrink: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
};

const truncatedTextStyle: React.CSSProperties = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical' as const,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

function AppearanceCard({ webchatConfig, isLoading }: { webchatConfig: WebchatConfig | null; isLoading: boolean }) {
  const { t } = useTranslation();

  function handleEdit() {
    openPlatformUrl('/integrations/apps/my');
  }

  if (isLoading) {
    return (
      <Flex direction="column" gap="$space-4" style={cardStyle}>
        <Skeleton style={{ height: '24px', width: '60%' }} />
        <Skeleton style={{ height: '60px', width: '100%' }} />
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="$space-4" style={cardStyle}>
      <Heading variant="display3">
        {t('settings.webchat.appearance.title')}
      </Heading>

      <Flex gap="$space-4" align="center" justify="space-between">
        <Flex gap="$space-4" align="center" style={{ flex: '1 1 0', minWidth: 0 }}>
          <Flex align="center" justify="center" style={{...avatarContainerStyle, backgroundImage: `url(${webchatConfig?.profileAvatar || ''})`, border: webchatConfig?.profileAvatar ? 'none' : '$border-base'}}>
          </Flex>

          <Flex direction="column" gap="$space-2" style={{ flex: '1 1 0', minWidth: 0 }}>
            <Text variant="emphasis" color="$fg-base">
              {webchatConfig?.title || '—'}
            </Text>
            <Text variant="body" color="$fg-base-soft" style={truncatedTextStyle}>
              {webchatConfig?.inputTextFieldHint || '—'}
            </Text>
          </Flex>
        </Flex>

        <Button variant="tertiary" size="normal" onClick={handleEdit}>
          {t('settings.webchat.appearance.edit')}
        </Button>
      </Flex>
    </Flex>
  );
}

function TrafficRolloutCard({
  activationMode,
  onActivationModeChange,
  isLoading,
}: {
  activationMode: ActivationMode;
  onActivationModeChange: (mode: ActivationMode) => void;
  isLoading: boolean;
}) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Flex direction="column" gap="$space-4" style={cardStyle}>
        <Skeleton style={{ height: '24px', width: '50%' }} />
        <Skeleton style={{ height: '60px', width: '100%' }} />
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="$space-4" style={cardStyle}>
      <Heading variant="display3">
        {t('settings.webchat.traffic_rollout.title')}
      </Heading>

      <ActivationSection
        activationMode={activationMode}
        onModeChange={onActivationModeChange}
        labelKey=""
        safeLabelKey="settings.webchat.traffic_rollout.safe_label"
        fullLabelKey="settings.webchat.traffic_rollout.full_label"
        safeDescriptionKey="settings.webchat.traffic_rollout.safe_description"
        fullDescriptionKey="settings.webchat.traffic_rollout.full_description"
      />
    </Flex>
  );
}

export function WebchatSection({ webchatConfig, isLoading, activationMode, onActivationModeChange }: WebchatSectionProps) {
  const { t } = useTranslation();

  return (
    <Flex direction="column" gap="$space-5">
      <Heading variant="display2">
        {t('settings.webchat.title')}
      </Heading>

      <Flex gap="$space-5" style={{ minHeight: '140px' }}>
        <AppearanceCard webchatConfig={webchatConfig} isLoading={isLoading} />
        <TrafficRolloutCard
          activationMode={activationMode}
          onActivationModeChange={onActivationModeChange}
          isLoading={isLoading}
        />
      </Flex>
    </Flex>
  );
}
