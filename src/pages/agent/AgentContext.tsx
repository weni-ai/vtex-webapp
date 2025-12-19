import { createContext, useContext, useState } from "react";

export const AgentContext = createContext<{
  isApproved: boolean;
  setIsApproved: (isApproved: boolean) => void;
}>({
  isApproved: true,
  setIsApproved: () => {},
});

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [isApproved, setIsApproved] = useState(false);

  return (
    <AgentContext.Provider value={{ isApproved, setIsApproved }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgentContext() {
  return useContext(AgentContext);
}
