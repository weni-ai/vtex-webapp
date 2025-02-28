type AgentConfig = {
  integration_settings?: {
    order_status_restriction?: {
      phone_number: string;
    };
    templates_synchronization_status?: 'pending' | 'rejected' | 'approved';
  };
};

export interface AgentsListResponse {
  features: {
    feature_uuid: string;
    category: 'ACTIVE' | 'PASSIVE';
    code: 'order_status' | 'abandoned_cart';
    name: string;
    description: string;
    disclaimer: string;
    documentation_url: string;
    globals: string[];
    config?: AgentConfig;
    sectors: string[];
    initial_flow: { uuid: string; name: string; }[];
  }[]
};

function isInTest(config?: AgentConfig) {
  const hasPhoneNumber = config?.integration_settings?.order_status_restriction?.phone_number
    && config?.integration_settings?.order_status_restriction?.phone_number.length > 0;
  
  const syncStatus = config?.integration_settings?.templates_synchronization_status;
  const isPendingOrRejected = syncStatus === 'pending' || syncStatus === 'rejected';

  return hasPhoneNumber || isPendingOrRejected || false;
}

export function adapterAgentsList(response: AgentsListResponse) {
  return response.features.map((agent) => ({
    uuid: agent.feature_uuid,
    category: agent.category,
    code: agent.code,
    isInTest: isInTest(agent.config),
  }));
}

export interface IntegratedAgentsListResponse {
  integratedFeatures: {
    feature_uuid: string;
    category: 'ACTIVE' | 'PASSIVE';
    code: 'order_status' | 'abandoned_cart';
    name: string;
    description: string;
    disclaimer: string;
    documentation_url: string;
    globals: { name: string; value: boolean }[];
    config?: AgentConfig;
    sectors: string[];
  }[]
};

export function adapterIntegratedAgentsList(response: IntegratedAgentsListResponse) {
  return response.integratedFeatures.map((agent) => ({
    uuid: agent.feature_uuid,
    category: agent.category,
    code: agent.code,
    isInTest: isInTest(agent.config),
  }));
}
