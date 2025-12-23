import store from "../../store/provider.store";
import getEnv from "../../utils/env";
import { VTEXFetch } from "../../utils/VTEXFetch";
import {
  AgentsListResponse,
  IntegratedAgentsListResponse,
  UpdateAgentSettingsData,
  UpdateAgentSettingsResponse,
  adaptUpdateAgentSettingsRequest,
  adaptUpdateAgentSettingsResponse,
  adapterAgentsList,
  adapterIntegratedAgentsList,
} from "./adapters";
import { proxy } from "../proxy";

interface Template {
  variables: {
    definition: string;
    fallback: string;
  }[];
}

interface IntegrateAgentData {
  feature_uuid: string;
  project_uuid: string;
  store: string;
  flows_channel_uuid: string;
  wpp_cloud_app_uuid: string;
  origin?: 'commerce' | 'nexus';
}

interface CreateAgentBuilderData {
  agent: {
    name: string;
    objective: string;
    occupation: string;
  };
  links: string[];
}

export async function createAgentBuilderRequest(data: CreateAgentBuilderData) {
  const projectUuid = store.getState().project.project_uuid;
  const userEmail = store.getState().user.userData?.user;

  const url = `/_v/create-agent-builder?projectUUID=${projectUuid}&user_email=${userEmail}`;
  const response = await VTEXFetch<{
    message: string;
    error: string;
  }>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Project-Uuid': projectUuid,
    },
    body: JSON.stringify(data),
  });

  return response;
}

export async function agentsList() {
  const projectUuid = store.getState().project.project_uuid;
  const userEmail = store.getState().user.userData?.user;

  const response = await proxy<AgentsListResponse>(
    'GET',
    `${getEnv('VITE_APP_COMMERCE_URL')}/v2/feature/${projectUuid}/`,
    {
      headers: { 'Project-Uuid': projectUuid, },
      params: {
        user_email: userEmail || '',
        category: 'ACTIVE',
        can_vtex_integrate: true,
        nexus_agents: true,
      },
    },
  );

  return adapterAgentsList(response);
}

export async function integratedAgentsList() {
  const projectUuid = store.getState().project.project_uuid;
  const userEmail = store.getState().user.userData?.user;

  const response = await proxy<IntegratedAgentsListResponse>(
    'GET',
    `${getEnv('VITE_APP_COMMERCE_URL')}/v2/app_integrated_feature/${projectUuid}/`,
    {
      headers: { 'Project-Uuid': projectUuid, },
      params: {
        projectUUID: projectUuid,
        user_email: userEmail || '',
      },
    },
  );

  return adapterIntegratedAgentsList(response);
}

export async function integrateAgentRequest(data: IntegrateAgentData) {
  const projectUuid = data.project_uuid;
  const userEmail = store.getState().user.userData?.user;

  const response = await VTEXFetch<{
    message: string;
    error: string;
  }>(`/_v/integrate-feature?user_email=${userEmail}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Project-Uuid': projectUuid,
    },
    body: JSON.stringify(data),
  });

  if (response?.error) {
    throw new Error(response.message || 'Error integrating feature');
  }

  return response;
}

export async function assignAgentCLIRequest(data: {
  agentUuid: string;
  templatesUuids: string[];
  credentials: Record<string, string>;
}): Promise<{
  uuid: string;
  webhook_url: string;
  templates: {}[];
  channel_uuid: string;
}> {
  const projectUuid = store.getState().project.project_uuid;
  const flowsChannelUuid = store.getState().project.flows_channel_uuid;
  const WhatsAppCloudAppUuid = store.getState().project.wpp_cloud_app_uuid;
  const userEmail = store.getState().user.userData?.user;

  const response = await proxy<{
    uuid: string;
    webhook_url: string;
    templates: {}[];
    channel_uuid: string;
  } & { error?: { agent: string } }>(
    'POST',
    `${getEnv('VITE_APP_COMMERCE_URL')}/api/v3/agents/${data.agentUuid}/assign/`, {
    data: {
      templates: data.templatesUuids,
      credentials: data.credentials,
    },
    params: {
      app_uuid: WhatsAppCloudAppUuid,
      channel_uuid: flowsChannelUuid,
      user_email: userEmail,
    },
    headers: {
      'Project-Uuid': projectUuid,
    },
  },
  );

  if ('webhook_url' in Object(response)) {
    return response;
  } else {
    const error = response?.error?.agent;
    throw new Error(typeof error === 'string' ? error : t('agent.actions.assign.error'));
  }
};

export async function unassignAgentCLIRequest(data: {
  agentUuid: string;
}) {
  const projectUuid = store.getState().project.project_uuid;
  const userEmail = store.getState().user.userData?.user;

  const response = await proxy<{} | { error: string; }>(
    'POST',
    `${getEnv('VITE_APP_COMMERCE_URL')}/api/v3/agents/${data.agentUuid}/unassign/`,
    {
      data: {},
      params: {
        user_email: userEmail,
      },
      headers: { 'Project-Uuid': projectUuid, },
    }
  );

  if ('error' in Object(response)) {
    throw new Error('error unassigning agent');
  } else {
    return response;
  }
};

export async function agentCLIRequest(data: { agentUuid: string, params?: { showAll?: boolean } }) {
  const projectUuid = store.getState().project.project_uuid;
  const userEmail = store.getState().user.userData?.user;

  const response = await proxy<{
    uuid: string;
    contact_percentage: number;
    templates: {
      uuid: string;
      name: string;
      display_name: string;
      start_condition: string;
      status:
      "APPROVED" |
      "IN_APPEAL" |
      "PENDING" |
      "REJECTED" |
      "PENDING_DELETION" |
      "DELETED" |
      "DISABLED" |
      "LOCKED";
      needs_button_edit: boolean;
      is_custom: boolean;
      variables: Template["variables"];
      metadata: {
        id: string;
        body: string;
        name: string;
        topic: string;
        header: {
          header_type: 'TEXT' | 'IMAGE';
          text: string;
        };
        footer: string;
        buttons: {
          url: string;
          text: string;
          type: 'URL';
        }[];
        usecase: string;
        category: string;
        industry: string[];
        language: string;
        body_params: string[];
        body_param_types: string[];
      };
    }[],
    channel_uuid: string;
    webhook_url: string;
    global_rule_prompt: string;
    abandoned_cart_config?: {
      abandonment_time_minutes: number;
      minimum_cart_value: number;
      header_image_type: 'no_image' | 'first_image' | 'most_expensive';
    };
  }>(
    'GET',
    `${getEnv('VITE_APP_COMMERCE_URL')}/api/v3/agents/assigneds/${data.agentUuid}/`,
    {
      headers: { 'Project-Uuid': projectUuid, },
      params: {
        user_email: userEmail,
        show_all: !!data.params?.showAll,
      },
    }
  );

  if ('webhook_url' in Object(response)) {
    return {
      uuid: response.uuid,
      templates: response.templates,
      channelUuid: response.channel_uuid,
      contactPercentage: response.contact_percentage,
      webhookUrl: response.webhook_url,
      globalRule: response.global_rule_prompt,
      abandonedCartAbandonmentTimeMinutes: response.abandoned_cart_config?.abandonment_time_minutes || 0,
      abandonedCartMinimumCartValue: response.abandoned_cart_config?.minimum_cart_value || 0,
      abandonedCartHeaderImageType: response.abandoned_cart_config?.header_image_type || 'no_image',
    };
  } else {
    throw new Error('error retrieving agent');
  }
}

export async function saveAgentButtonTemplateRequest(data: {
  templateUuid: string,
  template: {
    button: {
      url: string,
      urlExample?: string,
    }
  },
}) {
  const projectUuid = store.getState().project.project_uuid;
  const userEmail = store.getState().user.userData?.user;
  const WhatsAppCloudAppUuid = store.getState().project.wpp_cloud_app_uuid;

  const response = await proxy<{
    needs_button_edit: boolean;
    status: 'PENDING' | 'APPROVED' | 'IN_APPEAL' | 'REJECTED' | 'PENDING_DELETION' | 'DELETED' | 'DISABLED' | 'LOCKED';
    metadata: {
      buttons: {
        url: string;
        text: string;
        type: 'URL';
        example?: string[];
      }[];
    };
  }>(
    'PATCH',
    `${getEnv('VITE_APP_COMMERCE_URL')}/api/v3/templates/library/${data.templateUuid}/`,
    {
      headers: { 'Project-Uuid': projectUuid, },
      data: {
        library_template_button_inputs: [{
          type: 'URL',
          url: {
            base_url: data.template.button.url,
            url_suffix_example: data.template.button.urlExample,
          }
        }],
      },
      params: {
        user_email: userEmail,
        project_uuid: projectUuid,
        app_uuid: WhatsAppCloudAppUuid,
      },
    },
  );

  if ('status' in Object(response)) {
    return {
      needs_button_edit: response.needs_button_edit,
      status: response.status,
      metadata: response.metadata,
    };
  } else {
    throw new Error('error saving template');
  }
}

export async function updateAgentSettingsRequest(data: UpdateAgentSettingsData) {
  const projectUuid = store.getState().project.project_uuid;
  const userEmail = store.getState().user.userData?.user;
  const adaptedData = adaptUpdateAgentSettingsRequest(projectUuid, data);

  const response = await VTEXFetch<UpdateAgentSettingsResponse>(
    `/_v/update-feature-settings?user_email=${userEmail}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Project-Uuid': projectUuid,
      },
      body: JSON.stringify(adaptedData),
    }
  );

  return adaptUpdateAgentSettingsResponse(response);
}

export async function disableFeatureRequest(data: {
  project_uuid: string;
  feature_uuid: string;
}) {
  const userEmail = store.getState().user.userData?.user;

  return await VTEXFetch<{
    message: string;
    error: string;
  }>(`/_v/disable-feature?user_email=${userEmail}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Project-Uuid': data.project_uuid,
    },
    body: JSON.stringify(data),
  });
}

export async function getSkillMetricsRequest(data: { startDate: string, endDate: string }) {
  const projectUuid = store.getState().project.project_uuid;
  const userEmail = store.getState().user.userData?.user;

  const queryParams = new URLSearchParams({
    projectUUID: projectUuid,
    skill: 'abandoned_cart',
    start_date: data.startDate,
    end_date: data.endDate,
    user_email: userEmail || '',
  });

  const url = `/_v/get-skill-metrics?${queryParams.toString()}`;

  return {
    data: await VTEXFetch<{
      id: 'sent-messages' | 'delivered-messages' | 'read-messages' | 'interactions' | 'utm-revenue' | 'orders-placed';
      value: number;
      prefix?: string;
    }[]>(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Project-Uuid': projectUuid,
      },
    }),
  };
}

interface IntegrationsError {
  error?: {
    detail: string;
  }
}

export async function getWhatsAppURLRequest(): Promise<{
  config?: {
    redirect_url?: string;
  };
} & IntegrationsError> {
  const projectUuid = store.getState().project.project_uuid;
  const userEmail = store.getState().user.userData?.user;

  const response = await proxy<{
    config?: {
      redirect_url?: string;
    };
  } & IntegrationsError>(
    'POST',
    `${getEnv('VITE_APP_INTEGRATIONS_URL')}/api/v1/apptypes/wpp-demo/apps/get-or-create/`,
    {
      headers: { 'Project-Uuid': projectUuid, },
      data: {
        project_uuid: projectUuid,
      },
      params: {
        user_email: userEmail,
      },
    },
  );

  return response;
}

export async function updateAgentTemplateRequest(data: {
  templateUuid: string;
  template: {
    header?: string,
    content: string,
    footer?: string,
    button?: { text: string, url: string, urlExample?: string },
    startCondition?: string,
    variables: Template["variables"],
  }
}) {
  const projectUuid = store.getState().project.project_uuid;
  const userEmail = store.getState().user.userData?.user;
  const WhatsAppCloudAppUuid = store.getState().project.wpp_cloud_app_uuid;

  const parameters: { name: string, value: string | Template["variables"] }[] = [];

  if (data.template.startCondition) {
    parameters.push(...[{
      name: 'start_condition',
      value: data.template.startCondition,
    }, {
      name: 'variables',
      value: data.template.variables,
    }, {
      name: 'examples',
      value: [],
    }]);
  }

  type error =
    {
      errors: string[],
      error: { body: { message: string } },
      correction_needed: string,
      template_method: string,
      message: string,
    };

  const response = await proxy<{
    uuid: string;
    display_name: string;
    status: "APPROVED" | "IN_APPEAL" | "PENDING" | "REJECTED" | "PENDING_DELETION" | "DELETED" | "DISABLED" | "LOCKED";
    metadata: {
      header: string;
      body: string;
      footer: string;
      buttons: {
        url: string;
        text: string;
        type: 'URL';
        example?: string[];
      }[];
    };
    error?: error,
  }>(
    'PATCH',
    `${getEnv('VITE_APP_COMMERCE_URL')}/api/v3/templates/${data.templateUuid}/`,
    {
      data: {
        project_uuid: projectUuid,
        app_uuid: WhatsAppCloudAppUuid,
        template_header: data.template.header,
        template_body: data.template.content,
        template_body_params: data.template.variables?.map((variable) => variable.fallback),
        template_footer: data.template.footer,
        template_button: data.template.button ? [{
          type: 'URL',
          text: data.template.button.text,
          url: {
            base_url: data.template.button.url,
            url_suffix_example: data.template.button.urlExample,
          }
        }] : [],
        parameters,
      },
      params: {
        user_email: userEmail,
      },
      headers: { 'Project-Uuid': projectUuid, },
    },
  );

  if ('display_name' in Object(response)) {
    return response;
  } else {
    let errorText = '';

    if ('error' in Object(response)) {
      errorText = response.error?.correction_needed || response.error?.template_method || '';
    }

    throw new Error(errorText || `${t('error.title')}! ${t('error.description')}`);
  }
};

class AssignedAgentTemplate {
  static create(data: {
    projectUuid: string,
    name: string,
    header?: string,
    body: string,
    footer?: string,
    button?: { text: string, url: string },
    WhatsAppCloudAppUuid: string,
    assignedAgentUuid: string,
    variables: Template["variables"],
    startCondition: string,
  }) {
    const userEmail = store.getState().user.userData?.user;

    const button = data.button ? [{
      type: 'URL',
      text: data.button.text,
      url: {
        base_url: data.button.url,
      }
    }] : [];

    type error =
      {
        errors: string[],
        error: { body: { message: string } },
        correction_needed: string,
        template_method: string,
        message: string,
      }

    return proxy<{ uuid: string; error?: error }>(
      'POST',
      `${getEnv('VITE_APP_COMMERCE_URL')}/api/v3/templates/custom/`,
      {
        headers: {
          'Project-Uuid': data.projectUuid,
        },
        data: {
          "template_translation": {
            "template_header": data.header,
            "template_body": data.body,
            "template_footer": data.footer,
            "template_button": button,
            "template_body_params": data.variables.map((variable) => variable.fallback),
          },
          "category": "UTILITY",
          "project_uuid": data.projectUuid,
          "app_uuid": data.WhatsAppCloudAppUuid,
          "integrated_agent_uuid": data.assignedAgentUuid,
          "display_name": data.name,
          "parameters": [
            {
              "name": "variables",
              "value": data.variables
            },
            {
              "name": "start_condition",
              "value": data.startCondition
            },
            {
              name: 'exemples',
              value: [],
            },
          ],
        },
        params: {
          user_email: userEmail || '',
        },
      }
    );
  }

  static disable(data: { templateUuid: string, projectUuid: string }) {
    const userEmail = store.getState().user.userData?.user;

    return proxy<{ text: string; }>(
      'DELETE',
      `${getEnv('VITE_APP_COMMERCE_URL')}/api/v3/templates/${data.templateUuid}/`,
      {
        headers: {
          'Project-Uuid': data.projectUuid,
        },
        params: {
          user_email: userEmail || '',
        },
      }
    );
  }
}

export async function disableAssignedAgentTemplateRequest(data: {
  templateUuid: string;
}) {
  const projectUuid = store.getState().project.project_uuid;

  const response = await AssignedAgentTemplate.disable({
    projectUuid,
    templateUuid: data.templateUuid,
  });

  if ('text' in Object(response)) {
    return response;
  } else {
    throw new Error('error disabling template');
  }
};

export async function agentMetricsRequest(data: { templateUuid: string, startDate: string, endDate: string }) {
  const projectUuid = store.getState().project.project_uuid;
  const userEmail = store.getState().user.userData?.user;

  const response = await proxy<{
    data: {
      status_count: {
        sent: {
          value: number;
        },
        delivered: {
          value: number;
          percentage: number;
        },
        read: {
          value: number;
          percentage: number;
        },
        clicked: {
          value: number;
          percentage: number;
        }
      }
    }
  }>(
    'POST',
    `${getEnv('VITE_APP_COMMERCE_URL')}/api/v3/templates/template-metrics/`,
    {
      headers: {
        'Project-Uuid': projectUuid,
      },
      data: {
        template_uuid: data.templateUuid,
        start: data.startDate,
        end: data.endDate,
      },
      params: {
        user_email: userEmail,
      },
    },
  );

  if ('data' in Object(response) && 'status_count' in Object(response.data)) {
    return response.data.status_count;
  } else {
    throw new Error('error retrieving agent');
  }
}

export async function createAssignedAgentTemplateRequest(data: {
  name: string,
  header?: { type: 'text', text: string } | { type: 'media', src: string },
  body: string,
  footer?: string,
  button?: { text: string, url: string },
  assignedAgentUuid: string,
  variables: Template["variables"],
  startCondition: string,
}) {
  const projectUuid = store.getState().project.project_uuid;
  const WhatsAppCloudAppUuid = store.getState().project.wpp_cloud_app_uuid;

  function getHeader(header: { type: 'text', text: string } | { type: 'media', src: string }) {
    if (header.type === 'text') {
      return header.text;
    } else if (header.type === 'media') {
      return header.src;
    } else {
      return undefined;
    }
  }

  const header = data.header ? getHeader(data.header) : undefined;

  const response = await AssignedAgentTemplate.create({
    projectUuid,
    WhatsAppCloudAppUuid,
    name: data.name,
    header,
    body: data.body,
    footer: data.footer,
    button: data.button,
    assignedAgentUuid: data.assignedAgentUuid,
    variables: data.variables,
    startCondition: data.startCondition,
  });

  if ('uuid' in Object(response)) {
    return response;
  } else {
    let errorText = '';

    if ('error' in Object(response)) {
      errorText = response.error?.error?.body?.message || response.error?.correction_needed || response.error?.template_method || response.error?.message || '';
    } else if ('errors' in Object(response.error)) {
      errorText = response.error?.errors?.join?.(' ') || '';
    }

    throw new Error(errorText || t('template.modals.create.errors.generic_error'));
  }
}

class AssignedAgent {
  static update(data: {
    projectUuid: string,
    agentUuid: string,
    contactPercentage?: number,
    globalRule?: string,
    abandonedCartAbandonmentTimeMinutes?: number,
    abandonedCartMinimumCartValue?: number,
    abandonedCartHeaderImageType?: 'no_image' | 'first_image' | 'most_expensive',
  }) {
    const userEmail = store.getState().user.userData?.user;

    type error =
      {
        error?: {
          status?: 'invalid',
          correction_needed?: string,
          template_method?: string,
          message?: string,
        }
      }

    return proxy<{
      uuid: string;
      contact_percentage: number;
      global_rule_prompt: string;
      abandoned_cart_config: {
        abandonment_time_minutes: number;
        minimum_cart_value: number;
        header_image_type: 'no_image' | 'first_image' | 'most_expensive';
      };
    } & error>(
      'PATCH',
      `${getEnv('VITE_APP_COMMERCE_URL')}/api/v3/agents/assigneds/${data.agentUuid}/`,
      {
        headers: {
          'Project-Uuid': data.projectUuid,
        },
        data: {
          global_rule: data.globalRule || null,
          contact_percentage: data.contactPercentage,
          abandoned_cart_config: {
            abandonment_time_minutes: data.abandonedCartAbandonmentTimeMinutes,
            minimum_cart_value: data.abandonedCartMinimumCartValue,
            header_image_type: data.abandonedCartHeaderImageType,
          },
        },
        params: {
          user_email: userEmail || '',
        },
      }
    );
  }
}


export async function updateAgentGlobalRuleRequest(data: {
  agentUuid: string,
  contactPercentage?: number,
  globalRule?: string,
  abandonedCartAbandonmentTimeMinutes?: number,
  abandonedCartMinimumCartValue?: number,
  abandonedCartHeaderImageType?: 'no_image' | 'first_image' | 'most_expensive',
}) {
  const projectUuid = store.getState().project.project_uuid;

  const response = await AssignedAgent.update({
    projectUuid,
    agentUuid: data.agentUuid,
    contactPercentage: data.contactPercentage,
    globalRule: data.globalRule,
    abandonedCartAbandonmentTimeMinutes: data.abandonedCartAbandonmentTimeMinutes,
    abandonedCartMinimumCartValue: data.abandonedCartMinimumCartValue,
    abandonedCartHeaderImageType: data.abandonedCartHeaderImageType,
  });

  if ('uuid' in Object(response)) {
    return {
      uuid: response.uuid,
      contactPercentage: response.contact_percentage,
      globalRule: response.global_rule_prompt,
      abandonedCartAbandonmentTimeMinutes: response.abandoned_cart_config?.abandonment_time_minutes,
      abandonedCartMinimumCartValue: response.abandoned_cart_config?.minimum_cart_value,
      abandonedCartHeaderImageType: response.abandoned_cart_config?.header_image_type,
    };
  } else {
    let errorText = '';

    if ('error' in Object(response)) {
      errorText = response.error?.correction_needed || response.error?.template_method || '';
    }

    throw new Error(errorText || t('agents.details.settings.actions.save.error'));
  }
}
