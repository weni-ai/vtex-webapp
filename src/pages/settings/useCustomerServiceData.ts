import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { isWebChatIntegrated, selectWebChatAppUuid } from '../../store/userSlice';
import { agents as agentsSelector, hasTheFirstLoadOfTheAgentsHappened } from '../../store/projectSlice';
import { getManager } from '../../services/agent.service';
import { VTEXOnboardAdapter } from '../../api/onboarding/adapters';
import type { ActivationMode } from '../../components/shared/activationConstants';
import { DISPLAY_RATIO } from '../../components/shared/activationConstants';
import { updateDisplayRatio } from '../../services/onboarding.service';
import type { WebchatConfig } from '../../interfaces/Webchat';

interface ManagerInfo {
  name: string;
  goal: string;
}

const onboardingAdapter = new VTEXOnboardAdapter();

export function useCustomerServiceData() {
  const hasWebChat = useSelector(isWebChatIntegrated);
  const webchatAppUuid = useSelector(selectWebChatAppUuid);
  const agentsList = useSelector(agentsSelector);
  const hasFirstLoadHappened = useSelector(hasTheFirstLoadOfTheAgentsHappened);

  const [webchatConfig, setWebchatConfig] = useState<WebchatConfig | null>(null);
  const [webchatConfigLoading, setWebchatConfigLoading] = useState(false);

  const [managerInfo, setManagerInfo] = useState<ManagerInfo | null>(null);
  const [managerInfoLoading, setManagerInfoLoading] = useState(false);

  const [activationMode, setActivationMode] = useState<ActivationMode>('safe');

  const nexusAgents = useMemo(() => {
    return agentsList.filter((agent) => agent.origin === 'nexus');
  }, [agentsList]);

  const fetchWebchatConfig = useCallback(async () => {
    if (!webchatAppUuid) return;

    setWebchatConfigLoading(true);
    try {
      const result = await onboardingAdapter.getWebchatConfig(webchatAppUuid);
      if (result.success && result.data) {
        const config = result.data.config;
        setWebchatConfig({
          title: config.title || '',
          inputTextFieldHint: config.inputTextFieldHint || config.subtitle || '',
          renderPercentage: config.renderPercentage ?? config.displayRatio ?? 10,
          profileAvatar: config.profileAvatar || '',
        });

        const ratio = config.renderPercentage ?? config.displayRatio ?? 10;
        setActivationMode(ratio >= 100 ? 'full' : 'safe');
      }
    } catch (error) {
      console.error('Failed to fetch webchat config:', error);
    } finally {
      setWebchatConfigLoading(false);
    }
  }, [webchatAppUuid]);

  const fetchManagerInfo = useCallback(async () => {
    setManagerInfoLoading(true);
    try {
      const manager = await getManager();
      setManagerInfo({
        name: manager.name || '',
        goal: manager.goal || '',
      });
    } catch (error) {
      console.error('Failed to fetch manager info:', error);
    } finally {
      setManagerInfoLoading(false);
    }
  }, []);

  const handleActivationModeChange = useCallback(async (mode: ActivationMode) => {
    setActivationMode(mode);

    if (!webchatAppUuid) return;

    const displayRatio = DISPLAY_RATIO[mode];
    await updateDisplayRatio(webchatAppUuid, displayRatio);
  }, [webchatAppUuid]);

  useEffect(() => {
    if (hasWebChat && webchatAppUuid) {
      fetchWebchatConfig();
    }
  }, [hasWebChat, webchatAppUuid, fetchWebchatConfig]);

  useEffect(() => {
    fetchManagerInfo();
  }, [fetchManagerInfo]);

  return {
    hasWebChat,
    webchatConfig,
    webchatConfigLoading,
    managerInfo,
    managerInfoLoading,
    nexusAgents,
    hasFirstLoadHappened,
    activationMode,
    handleActivationModeChange,
    webchatAppUuid,
  };
}
