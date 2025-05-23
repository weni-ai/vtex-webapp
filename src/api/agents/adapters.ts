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
  results: {
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
  nexus_agents: {
    uuid: string;
    name: string;
    description: string;
    assigned: boolean;
    slug: string;
    skills: { name: string; }[];
  }[];
  gallery_agents: {
    uuid: string;
    name: string;
    description: string;
    assigned: boolean;
    assigned_agent_uuid: string;
    is_oficial: boolean;
    lambda_arn: string;
    templates: {
      uuid: string;
      name: string;
      display_name: string;
      start_condition: string;
      content: string;
      is_valid: boolean;
      metadata: {};
    }[];
    credentials: {
      [key: string]: {
        key: string;
        label: string;
        placeholder: string;
        is_confidential: boolean;
      };
    };
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

export function adapterAgentsList(response: AgentsListResponse): (AgentCommerce | AgentNexus | AgentCLI)[] {
  const agents: (AgentCommerce | AgentNexus | AgentCLI)[] = response.results.map((agent) => ({
    origin: 'commerce' as const,
    uuid: agent.feature_uuid,
    name: agent.name,
    description: agent.description,
    notificationType: 'active' as const,
    code: agent.code,
    isAssigned: false,
    isInTest: isInTest(agent.config),
    isConfiguring: isConfiguring(agent.config),
    templateSynchronizationStatus: 'unset',
  }));

  agents.push(...response.nexus_agents.map((agent) => ({
    origin: 'nexus' as const,
    uuid: agent.uuid,
    name: agent.name,
    description: agent.description,
    notificationType: 'passive' as const,
    code: agent.slug,
    isAssigned: agent.assigned,
    isInTest: false,
    skills: agent.skills.map((skill) => skill.name),
  })));

  agents.push(...response.gallery_agents.map((agent) => ({
    origin: 'CLI' as const,
    uuid: agent.uuid,
    assignedAgentUuid: agent.assigned_agent_uuid,
    name: agent.name,
    description: agent.description,
    notificationType: 'active' as const,
    code: agent.name.toLowerCase().replace(/ /g, '_'),
    isAssigned: agent.assigned,
    isInTest: false,
    credentials: Object.values(agent.credentials).reduce((acc, value) => {
      acc[value.key] = {
        label: value.label,
        placeholder: value.placeholder,
      };
      return acc;
    }, {} as Record<string, { label: string; placeholder: string; }>),
    templates: agent.templates.map((template) => ({
      uuid: template.uuid,
      name: template.display_name,
      startCondition: template.start_condition,
    })),
  })));

  return agents;
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
      origin: 'commerce' as const,
      uuid: agent.feature_uuid,
      name: agent.name,
      description: agent.description,
      notificationType: 'active' as const,
      code: agent.code,
      isAssigned: true,
      isInTest: isInTest(agent.config),
      isConfiguring: isConfiguring(agent.config),
      templateSynchronizationStatus: agent.config?.templates_synchronization_status || 'unset' as const,
      restrictTestContact: {
        isActive: !!agent.config?.integration_settings?.order_status_restriction?.phone_numbers,
        phoneNumber: agent.config?.integration_settings?.order_status_restriction?.phone_numbers || '',
      },
      restrictMessageTime: {
        isActive: !!agent.config?.integration_settings?.message_time_restriction?.is_active,
        periods: {
          weekdays: {
            from: agent.config?.integration_settings?.message_time_restriction?.periods?.weekdays?.from || '',
            to: agent.config?.integration_settings?.message_time_restriction?.periods?.weekdays?.to || '',
          },
          saturdays: {
            from: agent.config?.integration_settings?.message_time_restriction?.periods?.saturdays?.from || '',
            to: agent.config?.integration_settings?.message_time_restriction?.periods?.saturdays?.to || '',
          },
        },
    },
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
