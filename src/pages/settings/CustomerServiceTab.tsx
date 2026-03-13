import { Divider, Flex } from '@vtex/shoreline';
import { WebchatSection } from '../../components/settings/WebchatSection';
import { AgentsTeamSection } from '../../components/settings/AgentsTeamSection';
import { useCustomerServiceData } from './useCustomerServiceData';

export function CustomerServiceTab() {
  const {
    hasWebChat,
    webchatConfig,
    webchatConfigLoading,
    managerInfo,
    managerInfoLoading,
    nexusAgents,
    hasFirstLoadHappened,
    activationMode,
    handleActivationModeChange,
  } = useCustomerServiceData();

  return (
    <Flex direction="column" gap="$space-5" style={{ width: '100%', marginTop: '$space-5' }}>
      {hasWebChat && (
        <>
          <WebchatSection
            webchatConfig={webchatConfig}
            isLoading={webchatConfigLoading}
            activationMode={activationMode}
            onActivationModeChange={handleActivationModeChange}
          />
          <Divider />
        </>
      )}

      <AgentsTeamSection
        managerInfo={managerInfo}
        managerInfoLoading={managerInfoLoading}
        nexusAgents={nexusAgents}
        hasFirstLoadHappened={hasFirstLoadHappened}
      />
    </Flex>
  );
}
