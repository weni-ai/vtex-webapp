import { SettingsFormData } from "../../components/settings/SettingsContainer/SettingsContext";
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
  }[],
  store_type: string;
  agents: {
    uuid: string;
    name: string;
    description: string;
    assigned: boolean;
    slug: string;
    skills: { name: string; }[];
  }[];
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

export function adapterAgentsList(response: AgentsListResponse): {
  origin: 'commerce' | 'nexus';
  uuid: string;
  category: "ACTIVE" | "PASSIVE";
  code: "order_status" | "abandoned_cart";
  name: string;
  description: string;
  isInTest: boolean;
  isConfiguring: boolean;
  phone_numbers: string[];
  integrated?: boolean;
}[] {
  const commerceAgents = response.features.map((agent) => ({
    origin: 'commerce' as const,
    uuid: agent.feature_uuid,
    category: 'ACTIVE' as const,
    code: agent.code,
    name: agent.name,
    description: agent.description,
    isInTest: isInTest(agent.config),
    isConfiguring: isConfiguring(agent.config),
    phone_numbers: agent.config?.integration_settings?.order_status_restriction?.phone_numbers ? 
      [agent.config.integration_settings.order_status_restriction.phone_numbers] : 
      [],
    skills: [],
  }));

  return [...commerceAgents, ...response.agents.map((agent) => ({
    origin: 'nexus' as const,
    uuid: agent.uuid,
    category: 'PASSIVE' as const,
    code: 'abandoned_cart' as const,
    name: agent.name,
    description: agent.description,
    isInTest: false,
    isConfiguring: false,
    phone_numbers: [],
    integrated: agent.assigned,
    skills: agent.skills.map((skill) => skill.name),
  }))];
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
    category: 'ACTIVE' as const,
    code: agent.code,
    name: agent.name,
    description: agent.description,
    isInTest: isInTest(agent.config),
    isConfiguring: isConfiguring(agent.config),
    templateSynchronizationStatus: agent.config?.templates_synchronization_status,
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
    data: { id: 'sent-messages' | 'delivered-messages' | 'read-messages' | 'interactions' | 'utm-revenue' | 'orders-placed'; value: number; prefix?: string }[];
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
    agentUuid: string;
    formData: SettingsFormData,
}


export function adaptUpdateAgentSettingsRequest(projectUuid: string, data: UpdateAgentSettingsData) {
    return {
        feature_uuid: data.agentUuid,
        project_uuid: projectUuid,
        integration_settings: data.formData,
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
      data: response.data.map(({ id, value, prefix }) => ({
        title: id,
        value: prefix ? `${prefix} ${value}` : `${value}`,
      })),
  };
}
