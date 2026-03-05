import type { CSSProperties } from 'react';
import { Flex, Tag, Text } from '@vtex/shoreline';
import { useTranslation } from 'react-i18next';
import { formatUrn } from '../../utils/urn';
import {
  CSAT_CONFIG,
  RESOLUTION_CONFIG,
  isValidCsatScore,
  type CsatScore,
  type SupervisorConversation,
} from './constants';

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

const csatBadgeStyle: CSSProperties = {
  padding: '4px 12px',
  border: 'var(--sl-border-base)',
  borderRadius: 'var(--sl-radius-full)',
  whiteSpace: 'nowrap',
};

function CsatBadge({ csat }: { csat: number }) {
  const { t } = useTranslation();

  if (!isValidCsatScore(csat)) return null;

  const config = CSAT_CONFIG[csat as CsatScore];

  return (
    <Flex align="center" justify="center" style={csatBadgeStyle}>
      <Text variant="caption2" color="$fg-base-soft">
        {config.emoji} {t(config.labelKey)} | CSAT: {csat}
      </Text>
    </Flex>
  );
}

const itemStyle: CSSProperties = {
  padding: 'var(--sl-space-2) var(--sl-space-4)',
  borderRadius: 'var(--sl-radius-2)',
  background: 'var(--sl-bg-base)',
};

const dateStyle: CSSProperties = {
  whiteSpace: 'nowrap',
  flexShrink: 0,
};

interface RecentActivityItemProps {
  conversation: SupervisorConversation;
}

export function RecentActivityItem({ conversation }: RecentActivityItemProps) {
  const { t } = useTranslation();
  const resolutionConfig = RESOLUTION_CONFIG[conversation.resolution];
  const showCsat = conversation.csat !== null && conversation.resolution !== 'in_progress';

  return (
    <Flex align="center" gap="$space-4" style={itemStyle}>
      <Flex align="center" justify="space-between" style={{ flex: '1 1 0', minWidth: 0 }}>
        <Flex align="center" gap="$space-4">
          <Flex direction="column" justify="center" gap="$space-0">
            <Text variant="emphasis">
              {conversation.name ?? t('recent_activity.unnamed_contact')}
            </Text>
            <Text variant="caption2" color="$fg-base-soft">{formatUrn(conversation.urn)}</Text>
          </Flex>
          <Tag color={resolutionConfig.color} variant="secondary">
            {t(resolutionConfig.labelKey)}
          </Tag>
        </Flex>

        {showCsat && <CsatBadge csat={conversation.csat!} />}
      </Flex>

      <Text variant="body" color="$fg-base-soft" style={dateStyle}>
        {formatDate(conversation.createdOn)}
      </Text>
    </Flex>
  );
}
