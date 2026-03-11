import { Flex, Tag, Text } from '@vtex/shoreline';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Toggle } from '../shared/Toggle';
import { getAgentIcon } from '../shared/agentIconMap';
import { toggleNexusAgentAssignment } from '../../services/agent.service';

interface NexusAgentCardProps {
  uuid: string;
  name: string;
  description: string;
  code: string;
  isAssigned: boolean;
  isOfficial: boolean;
}

const cardStyle: React.CSSProperties = {
  border: 'var(--sl-border-base)',
  borderRadius: '16px',
  padding: '16px',
};

const avatarContainerStyle: React.CSSProperties = {
  width: '48px',
  height: '48px',
  flexShrink: 0,
};

const avatarInnerStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  overflow: 'hidden',
  backgroundColor: 'var(--sl-color-gray-2)',
};

const truncatedTextStyle: React.CSSProperties = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical' as const,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minHeight: '40px',
};

const inactiveFilter = 'grayscale(100%) brightness(500%) contrast(0.2)';

export function NexusAgentCard({ uuid, name, description, code, isAssigned, isOfficial }: NexusAgentCardProps) {
  const { t } = useTranslation();
  const [isToggling, setIsToggling] = useState(false);

  const icon = getAgentIcon(code);
  const tagLabel = isOfficial
    ? t('settings.agents_team.official_tag')
    : t('settings.agents_team.custom_tag');

  const textColor = isAssigned ? '$fg-base' : '$fg-base-disabled';
  const descriptionColor = isAssigned ? '$fg-base-soft' : '$fg-base-disabled';

  const handleToggle = useCallback(async (checked: boolean) => {
    setIsToggling(true);
    try {
      await toggleNexusAgentAssignment(uuid, checked);
    } catch {
      // Error already handled in service with toast
    } finally {
      setIsToggling(false);
    }
  }, [uuid]);

  return (
    <Flex direction="column" gap="$space-4" style={cardStyle}>
      <Flex gap="$space-3" align="center">
        <Flex align="center" justify="center" style={avatarContainerStyle}>
          <Flex align="center" justify="center" style={avatarInnerStyle}>
            <img
              src={icon}
              alt={name}
              style={{
                width: '40px',
                height: '40px',
                filter: isAssigned ? 'unset' : inactiveFilter,
                transition: 'filter 0.15s ease',
              }}
            />
          </Flex>
        </Flex>

        <Flex direction="column" gap="$space-1" style={{ flex: '1 1 0', minWidth: 0 }}>
          <Text variant="emphasis" color={textColor} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {name}
          </Text>
          <Tag color="blue" variant="secondary">
            {tagLabel}
          </Tag>
        </Flex>

        <Toggle
          checked={isAssigned}
          onChange={handleToggle}
          loading={isToggling}
        />
      </Flex>

      <Text variant="body" color={descriptionColor} style={truncatedTextStyle} title={description}>
        {description}
      </Text>
    </Flex>
  );
}
