import { Button, EmptyState, EmptyStateActions, Flex, Heading, Text } from '@vtex/shoreline';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AuditHeader } from './AuditHeader';
import { AuditTable } from './AuditTable';
import { AuditSkeleton } from './AuditSkeleton';
import { useAuditData } from './useAuditData';

function SkippedOnboardingEmpty({ isActivationEnabled }: { isActivationEnabled: boolean }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <EmptyState size="medium">
      <Heading>{t('audit.empty.skipped.title')}</Heading>
      <Text>{t('audit.empty.skipped.description')}</Text>
      <EmptyStateActions>
        <Button
          variant="primary"
          disabled={!isActivationEnabled}
          onClick={() => navigate('/onboarding')}
        >
          {t('audit.empty.skipped.button')}
        </Button>
      </EmptyStateActions>
    </EmptyState>
  );
}

function NoConversationsEmpty() { 
  const { t } = useTranslation();

  return (
    <EmptyState size="medium"> 
      <Heading>{t('audit.empty.no_data.title')}</Heading>
      <Text>{t('audit.empty.no_data.description')}</Text>
    </EmptyState>
  );
}

export function Audit() {
  const { state, conversations, isActivationEnabled } = useAuditData();

  const showViewDetailsButton = state === 'data' && conversations.length > 0;

  return (
    <Flex direction="column" gap="$space-4">
      <AuditHeader showViewDetailsButton={showViewDetailsButton} />

      {state === 'loading' && <AuditSkeleton />}
      {state === 'onboarding_skipped' && <SkippedOnboardingEmpty isActivationEnabled={isActivationEnabled} />}
      {state === 'empty' && <NoConversationsEmpty />}
      {state === 'data' && <AuditTable conversations={conversations} />}
    </Flex>
  );
}
