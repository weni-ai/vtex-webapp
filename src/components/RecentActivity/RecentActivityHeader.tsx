import { Button, Flex, Heading } from '@vtex/shoreline';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectProject } from '../../store/projectSlice';
import { selectUser } from '../../store/userSlice';
import getEnv from '../../utils/env';

interface RecentActivityHeaderProps {
  showViewDetails: boolean;
}

export function RecentActivityHeader({ showViewDetails }: RecentActivityHeaderProps) {
  const { t } = useTranslation();
  const projectUuid = useSelector(selectProject);
  const userData = useSelector(selectUser);

  function handleViewDetails() {
    const dash = new URL(`/projects/${projectUuid}/ai-conversations/conversations`, getEnv('VITE_APP_DASH_URL'));

    const vtexAppParams = new URLSearchParams();
    if (userData?.user) {
      vtexAppParams.append('email', userData.user);
    }
    dash.searchParams.append('vtex_app', vtexAppParams.toString());

    window.open(dash.toString(), '_blank');
  }

  return (
    <Flex align="center" justify="space-between">
      <Heading variant="display2">
        {t('recent_activity.title')}
      </Heading>

      {showViewDetails && (
        <Button variant="secondary" onClick={handleViewDetails}>
          {t('recent_activity.view_details')}
        </Button>
      )}
    </Flex>
  );
}
