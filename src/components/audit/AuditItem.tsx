import { Flex, TableCell, TableRow, Tag, Text } from '@vtex/shoreline';
import { useTranslation } from 'react-i18next';
import { formatUrn } from '../../utils/urn';
import {
  CSAT_CONFIG,
  RESOLUTION_CONFIG,
  isValidCsatScore,
  type CsatScore,
  type SupervisorConversation,
} from './constants';

function formatDateOnly(isoDate: string): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function formatTimeOnly(isoDate: string): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return '';

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

function formatCsat(csat: number, label: string): string {
  const config = CSAT_CONFIG[csat as CsatScore];
  return `${config.emoji} ${label} | CSAT: ${csat}`;
}

interface AuditItemProps {
  conversation: SupervisorConversation;
}

export function AuditItem({ conversation }: AuditItemProps) {
  const { t } = useTranslation();
  const resolutionConfig = RESOLUTION_CONFIG[conversation.resolution];
  const showCsat =
    conversation.csat !== null &&
    conversation.resolution !== 'in_progress' &&
    isValidCsatScore(conversation.csat!);

  return (
    <TableRow>
      <TableCell>
        <Flex direction="column" gap="$space-0">
          <Text variant="emphasis">
            {conversation.name ?? t('audit.unnamed_contact')}
          </Text>
          <Text variant="caption2" color="$fg-base-soft">
            {formatUrn(conversation.urn)}
          </Text>
        </Flex>
      </TableCell>

      <TableCell>
        <Tag color={resolutionConfig.color} variant="secondary">
          {t(resolutionConfig.labelKey)}
        </Tag>
      </TableCell>

      <TableCell>
        {showCsat && (
          <Text variant="body">
            {formatCsat(
              conversation.csat!,
              t(CSAT_CONFIG[conversation.csat! as CsatScore].labelKey),
            )}
          </Text>
        )}
      </TableCell>

      <TableCell>
        <Text variant="body">{formatDateOnly(conversation.createdOn)}</Text>
      </TableCell>

      <TableCell>
        <Text variant="body">{formatTimeOnly(conversation.createdOn)}</Text>
      </TableCell>
    </TableRow>
  );
}
