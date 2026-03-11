import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { isWhatsAppIntegrated } from '../../store/userSlice';
import {
  agents as agentsSelector,
  hasTheFirstLoadOfTheAgentsHappened,
  selectProject,
  wppCloudAppUuid,
} from '../../store/projectSlice';
import { getWhatsAppConfig } from '../../api/channels/requests';

interface WhatsAppProfile {
  displayName: string;
  displayPhoneNumber: string;
}

export function useWhatsAppData() {
  const hasWhatsApp = useSelector(isWhatsAppIntegrated);
  const wppAppUuid = useSelector(wppCloudAppUuid);
  const projectUuid = useSelector(selectProject);
  const agentsList = useSelector(agentsSelector);
  const hasFirstLoadHappened = useSelector(hasTheFirstLoadOfTheAgentsHappened);

  const [whatsAppProfile, setWhatsAppProfile] = useState<WhatsAppProfile | null>(null);
  const [whatsAppProfileLoading, setWhatsAppProfileLoading] = useState(false);

  const cliAgents = useMemo(
    () => agentsList.filter((agent) => agent.origin === 'CLI'),
    [agentsList],
  );

  const fetchWhatsAppProfile = useCallback(async () => {
    if (!wppAppUuid || !projectUuid) return;

    setWhatsAppProfileLoading(true);
    try {
      const response = await getWhatsAppConfig(wppAppUuid, projectUuid);

      if (response?.data) {
        const phoneNumber = response.data.config.config.phone_number;
        setWhatsAppProfile({
          displayName: phoneNumber.display_name,
          displayPhoneNumber: phoneNumber.display_phone_number,
        });
      }
    } catch (error) {
      console.error('Failed to fetch WhatsApp profile:', error);
    } finally {
      setWhatsAppProfileLoading(false);
    }
  }, [wppAppUuid, projectUuid]);

  useEffect(() => {
    if (hasWhatsApp && wppAppUuid) {
      fetchWhatsAppProfile();
    }
  }, [hasWhatsApp, wppAppUuid, fetchWhatsAppProfile]);

  return {
    hasWhatsApp,
    whatsAppProfile,
    whatsAppProfileLoading,
    cliAgents,
    hasFirstLoadHappened,
  };
}
