import { integrateAgentRequest } from "./requests";

export type AgentConfig = {
  code: string;
  uuid: string;
  integration_settings?: {
    order_status_restriction?: {
      phone_numbers: string;
    };
    message_time_restriction?: {
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
    return false;
  }

  const hasPhoneNumber = config?.integration_settings?.order_status_restriction?.phone_numbers
    && config?.integration_settings?.order_status_restriction?.phone_numbers.length > 0;

  return hasPhoneNumber || false;
}

function isConfiguring(config?: AgentConfig) {
  if (config && Object.keys(config).length === 0) {
    return true;
  }

  const syncStatus = config?.templates_synchronization_status;
  const isPendingOrRejected = syncStatus === 'pending' || syncStatus === 'rejected';

  return isPendingOrRejected || false;
}

export function adapterAgentsList(response: AgentsListResponse) {
  return response.features.map((agent) => ({
    uuid: agent.feature_uuid,
    category: agent.category,
    code: agent.code,
    isInTest: isInTest(agent.config),
    isConfiguring: isConfiguring(agent.config),
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
    isConfiguring: isConfiguring(agent.config),
    phone_numbers: agent.config?.integration_settings?.order_status_restriction?.phone_numbers ? 
      [agent.config.integration_settings.order_status_restriction.phone_numbers] : 
      [],
    message_time_restrictions: agent.config?.integration_settings?.message_time_restriction
  }));
}


export interface IntegrateFeatureInput {
    featureId: string;
    projectId: string;
    storeName: string;
    flowsChannelId: string;
    whatsappAppId: string;
}

interface IntegrateFeatureOutput {
    success: boolean;
    message: string;
}

export interface DisableFeatureData {
    project_uuid: string;
    feature_uuid: string;
}

export interface GetSkillMetricsResponse {
    message: string;
    error: string;
    data: { title: string; value: string; variation: number; }[][];
}

export interface UpdateAgentSettingsResponse {
    message: string;
    error: string;
}


export class FeaturesAdapter {
    static async integrateFeature(input: IntegrateFeatureInput): Promise<IntegrateFeatureOutput> {
        try {
            const adaptedData = {
                feature_uuid: input.featureId,
                project_uuid: input.projectId,
                store: input.storeName,
                flows_channel_uuid: input.flowsChannelId,
                wpp_cloud_app_uuid: input.whatsappAppId,
            };

            const response = await integrateAgentRequest(adaptedData);

            return {
                success: !response.error,
                message: response.message,
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Feature integration failed: ${error.message}`);
            }
            throw new Error('Feature integration failed: Unknown error');
        }
    }
}

export interface UpdateAgentSettingsData {
    feature_uuid: string;
    project_uuid: string;
    integration_settings: {
        message_time_restriction?: {
            is_active: boolean;
            periods: {
                weekdays: { from: string; to: string };
                saturdays: { from: string; to: string };
            };
        };
        order_status_restriction?: {
            is_active: boolean;
            phone_numbers: string[];
            sellers: string[];
        };
    };
}


export function adaptUpdateAgentSettingsRequest(data: UpdateAgentSettingsData) {
    return {
        feature_uuid: data.feature_uuid,
        project_uuid: data.project_uuid,
        integration_settings: data.integration_settings,
    };
}

export function adaptUpdateAgentSettingsResponse(response: UpdateAgentSettingsResponse) {
    return {
        message: response.message,
        error: response.error,
    };
}

export function adaptGetSkillMetricsResponse(response: GetSkillMetricsResponse) {
    return {
        message: response.message,
        error: response.error,
        data: response.data,
    };
}
