import { Button, Flex, Heading } from '@vtex/shoreline';
import { useTranslation } from 'react-i18next';
import { openPlatformUrl } from '../../utils/platform';

export function RecentActivityHeader({showViewDetailsButton}: {showViewDetailsButton: boolean}) {
  const { t } = useTranslation();

  function handleViewDetails() {
    openPlatformUrl('/ai-conversations/conversations');
  }

  return (
    <Flex align="center" justify="space-between">
      <Heading variant="display2">
        {t('recent_activity.title')}
      </Heading>

      {showViewDetailsButton && (
        <Button variant="secondary" onClick={handleViewDetails}>
          {t('recent_activity.view_details')}
        </Button>
      )}
    </Flex>
  );
}
