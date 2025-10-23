import { createContext, PropsWithChildren, useContext, useState } from "react";
import { disableDeliveredOrderTracking, enableDeliveredOrderTracking } from "../../services/agent.service";
import { toast } from "@vtex/shoreline";

export const AgentTemplateDeliveredOrderContext = createContext<{
  appKey: string;
  setAppKey: (appKey: string) => void;
  appToken: string;
  setAppToken: (appToken: string) => void;
  isEnabled: boolean;
  enable: (agentUuid: string) => Promise<void>;
  isEnabling: boolean;
  disable: (agentUuid: string) => Promise<void>;
  isDisabling: boolean;
}>({
  appKey: '',
  setAppKey: () => {},
  appToken: '',
  setAppToken: () => {},
  isEnabled: false,
  enable: () => Promise.resolve(),
  isEnabling: false,
  disable: () => Promise.resolve(),
  isDisabling: false,
});

export function AgentTemplateDeliveredOrderProvider({ children, ...props }: PropsWithChildren<{ isEnabled: boolean, setIsEnabled: (isEnabled: boolean) => void }>) {
  const [appKey, setAppKey] = useState('');
  const [appToken, setAppToken] = useState('');
  const [isEnabled, setIsEnabled] = useState(props.isEnabled);
  const [isEnabling, setIsEnabling] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);

  function handleSetIsEnabled(isEnabled: boolean) {
    setIsEnabled(isEnabled);
    props.setIsEnabled(isEnabled);
  }

  async function enable(agentUuid: string) {
    try {
      setIsEnabling(true);

      await enableDeliveredOrderTracking({
        agentUuid: agentUuid,
        appToken,
        appKey,
      });

      toast.success(t('agents.details.settings.actions.enable_delivered_order_tracking.success'));
      handleSetIsEnabled(true);
    } catch (error) {
      if (error instanceof Error) {
        toast.critical(error.message);
      }
    } finally {
      setIsEnabling(false);
    }
  }

  async function disable(agentUuid: string) {
    try {
      setIsDisabling(true);

      await disableDeliveredOrderTracking({
        agentUuid: agentUuid,
      });

      toast.success(t('agents.details.settings.actions.disable_delivered_order_tracking.success'));
      handleSetIsEnabled(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.critical(error.message);
      }
    } finally {
      setIsDisabling(false);
    }
  }

  return (
    <AgentTemplateDeliveredOrderContext.Provider value={{
      appKey, setAppKey,
      appToken, setAppToken,
      enable, isEnabling,
      disable, isDisabling,
      isEnabled,
    }}>
      {children}
    </AgentTemplateDeliveredOrderContext.Provider>
  );
}

export function useAgentTemplateDeliveredOrderContext() {
  return useContext(AgentTemplateDeliveredOrderContext);
}
