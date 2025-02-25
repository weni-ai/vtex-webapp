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
    config: {
      [key: string]: {
        [key: string]: {
          [key: string]: boolean | {
            [key: string]: string;
          };
        } | string[];
      };
    };
    sectors: string[];
    initial_flow: { uuid: string; name: string; }[];
  }[]
};

export function adapterAgentsList(response: AgentsListResponse) {
  return response.features.map((agent) => ({
    uuid: agent.feature_uuid,
    category: agent.category,
    code: agent.code,
    isInTest: agent.config?.integration_settings?.order_status_restriction?.phone_number.length > 0,
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
    config: {
      [key: string]: {
        [key: string]: {
          [key: string]: boolean | {
            [key: string]: string;
          };
        } | string[];
      };
    };
    sectors: string[];
  }[]
};

export function adapterIntegratedAgentsList(response: IntegratedAgentsListResponse) {
  return response.integratedFeatures.map((agent) => ({
    uuid: agent.feature_uuid,
    category: agent.category,
    code: agent.code,
    isInTest: agent.config?.integration_settings?.order_status_restriction?.phone_number.length > 0,
  }));
}
