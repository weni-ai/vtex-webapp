type AgentConfig = {
  integration_settings?: {
    order_status_restriction?: {
      phone_numbers: string;
    };
    message_time_restrictions: {
      is_active: boolean;
      periods: {
        saturdays: {
          to: string;
          from: string;
        };
        weekdays: {
          to: string;
          from: string;
        };
      };
    };
  };
  templates_synchronization_status?: 'pending' | 'rejected' | 'approved';
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
  if (config && Object.keys(config).length === 0) {
    return true;
  }

  const hasPhoneNumber = config?.integration_settings?.order_status_restriction?.phone_numbers
    && config?.integration_settings?.order_status_restriction?.phone_numbers.length > 0;
  
  const syncStatus = config?.templates_synchronization_status;
  const isPendingOrRejected = syncStatus === 'pending' || syncStatus === 'rejected';

  return hasPhoneNumber || isPendingOrRejected || false;
}

export function adapterAgentsList(response: AgentsListResponse) {
  return response.features.map((agent) => ({
    uuid: agent.feature_uuid,
    category: agent.category,
    code: agent.code,
    isInTest: isInTest(agent.config),
    phone_numbers: agent.config?.integration_settings?.order_status_restriction?.phone_numbers ? 
      [agent.config.integration_settings.order_status_restriction.phone_numbers] : 
      []
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
    phone_numbers: agent.config?.integration_settings?.order_status_restriction?.phone_numbers ? 
      [agent.config.integration_settings.order_status_restriction.phone_numbers] : 
      [],
    message_time_restrictions: agent.config?.integration_settings?.message_time_restrictions
  }));
}
