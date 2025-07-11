import { adaptGetSkillMetricsResponse, GetSkillMetricsResponse, UpdateAgentSettingsData } from "../api/agents/adapters";
import { agentCLIRequest, agentMetricsRequest, agentsList, assignAgentCLIRequest, createAgentBuilderRequest, createAssignedAgentTemplateRequest, disableAssignedAgentTemplateRequest, disableFeatureRequest, getSkillMetricsRequest, getWhatsAppURLRequest, integrateAgentRequest, integratedAgentsList, saveAgentButtonTemplateRequest, unassignAgentCLIRequest, updateAgentGlobalRuleRequest, updateAgentTemplateRequest } from "../api/agents/requests";
import { agentsSettingsUpdate } from "../api/agentsSettings/requests";
import { addAssignedAgent, setAgents, setAgentsLoading, setAssignedAgents, setDisableAgentLoading, setHasTheFirstLoadOfTheAgentsHappened, setUpdateAgentLoading, setWhatsAppURL } from "../store/projectSlice";
import store from "../store/provider.store";
import { VTEXFetch } from "../utils/VTEXFetch";
import getEnv from "../utils/env";

export async function checkAgentIntegration(project_uuid: string) {
  const integrationsAPI = getEnv('VITE_APP_NEXUS_URL') || '';

  if (!integrationsAPI) {
    console.error('VITE_APP_NEXUS_URL is not configured');
    return { success: false, error: 'missing configuration' };
  }

  try {
    const response = await VTEXFetch<{ error?: boolean, message?: string, data: { has_agent: boolean, name: string, links: string[], objective: string, occupation: string } }>(`/_v/check-agent-builder?projectUUID=${project_uuid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response || response?.error) {
      throw new Error(response?.message || 'error integrating agents.');
    }

    return { success: true, data: response };
  } catch (error) {
    console.error('error in the integration check:', error);
    return { success: false, error: error || 'unknown error' };
  }
}

export async function setAgentBuilder(
  payload: {
    agent: {
      name: string;
      objective: string;
      occupation: string;
    },
    links: string[],
  },
) {
  const response = await createAgentBuilderRequest(payload);

  if (response.error) {
    return { success: false, error: response?.message || 'Error creating agent' };
  }
  return { success: true, data: response };
}

export async function updateAgentsList() {
  const [availableAgents, integratedAgents] = await Promise.all([
    agentsList(),
    integratedAgentsList()
  ]);

  store.dispatch(setAgents([...availableAgents, ...integratedAgents]));
  store.dispatch(setHasTheFirstLoadOfTheAgentsHappened(true));

  store.dispatch(setAgentsLoading(availableAgents.map(agent => ({ agent_uuid: agent.uuid, isLoading: false }))))
}

export async function assignAgentCLI(data: { uuid: string, templatesUuids: string[], credentials: Record<string, string> }) {
  const response = await assignAgentCLIRequest({
    agentUuid: data.uuid,
    templatesUuids: data.templatesUuids,
    credentials: data.credentials,
  });

  const agents = store.getState().project.agents;

  store.dispatch(setAgents(agents.map((item) => {
    if (item.origin === 'CLI' && item.uuid === data.uuid) {
      return {
        ...item,
        isAssigned: true,
        assignedAgentUuid: response.uuid,
      };
    }

    return item;
  })));
}

const status = {
  "APPROVED": "active" as const,
  "PENDING": "pending" as const,
  "REJECTED": "rejected" as const,
  "IN_APPEAL": "in_appeal" as const,
  "PENDING_DELETION": "pending_deletion" as const,
  "DELETED": "deleted" as const,
  "DISABLED": "disabled" as const,
  "LOCKED": "locked" as const,
}

export async function agentCLI(data: { agentUuid: string, forceUpdate?: boolean, dontSave?: boolean, params?: { showAll?: boolean } }) {
  const agent = store.getState().project.assignedAgents.find(agent => agent.uuid === data.agentUuid);

  if (agent && !data.forceUpdate && !data.dontSave) {
    return agent;
  }

  const response = await agentCLIRequest({
    agentUuid: data.agentUuid,
    params: data.params,
  });

  const statusValues = Object.values(status);

  function getTemplateHeader(metadata: { header: { header_type: 'TEXT' | 'IMAGE', text: string } }) {    
    if (typeof metadata.header === 'string') {
      return metadata.header;
    }

    if (!metadata?.header?.header_type) {
      return '';
    }

    return metadata.header.header_type === 'TEXT' ? metadata.header.text : metadata.header.text;
  }

  const assignedAgent = {
    ...response,
    templates: response.templates.map((template) => ({
      uuid: template.uuid,
      name: template.display_name,
      startCondition: template.start_condition,
      status: template.needs_button_edit ? 'needs-editing' as const : status[template.status] as typeof statusValues[number],
      metadata: {
        ...template.metadata,
        header: getTemplateHeader(template.metadata),
      },
    })),
  }

  if (!data.dontSave) {
    store.dispatch(addAssignedAgent(assignedAgent));
  }

  return assignedAgent;
}

export async function unassignAgentCLI(data: { agentUuid: string }) {
  store.dispatch(setDisableAgentLoading(true))

  const response = await unassignAgentCLIRequest({
    agentUuid: data.agentUuid,
  });

  const agents = store.getState().project.agents;

  store.dispatch(setAgents(agents.map((item) => {
    if (item.origin === 'CLI' && item.uuid === data.agentUuid) {
      return {
        ...item,
        isAssigned: false,
        assignedAgentUuid: '',
      };
    }

    return item;
  })));

  return response;
}

export async function saveAgentButtonTemplate(data: {
  templateUuid: string,
  template: {
    button: {
      url: string,
      urlExample?: string,
    }
  }
}) {
  const response = await saveAgentButtonTemplateRequest(data);

  const statusValues = Object.values(status);

  const assignedAgents = store.getState().project.assignedAgents;

  store.dispatch(setAssignedAgents(assignedAgents.map((agent) => {
    return {
      ...agent,
      templates: agent.templates.map((template) => {
        if (template.uuid === data.templateUuid) {
          return {
            ...template,
            status: response.needs_button_edit ? 'needs-editing' as const : status[response.status] as typeof statusValues[number],
            metadata: {
              ...template.metadata,
              buttons: response.metadata.buttons,
            }
          };
        }

        return template;
      })
    }
  })));

  return response;
}

export async function integrateAgent(feature_uuid: string, project_uuid: string) {
  const agentsLoading = store.getState().project.agentsLoading;
  const agentLoadingExists = agentsLoading.find(loading => loading.agent_uuid === feature_uuid);

  if (agentLoadingExists) {
    const newAgentsLoading = agentsLoading.map(
      ({ agent_uuid, isLoading }) =>
      ({
        agent_uuid,
        isLoading: agent_uuid === feature_uuid ? true : isLoading,
      })
    );

    store.dispatch(setAgentsLoading(newAgentsLoading));
  } else {
    store.dispatch(setAgentsLoading([...agentsLoading, { agent_uuid: feature_uuid, isLoading: true }]));
  }

  try {
    const storeAddress = store.getState().auth.base_address;
    const flows_channel_uuid = store.getState().project.flows_channel_uuid;
    const wpp_cloud_app_uuid = store.getState().project.wpp_cloud_app_uuid;

    const agent = store.getState().project.agents.find(agent => agent.uuid === feature_uuid);

    const data = {
      feature_uuid,
      project_uuid,
      store: storeAddress,
      flows_channel_uuid,
      wpp_cloud_app_uuid,
      is_nexus_agent: false,
      agent_uuid: '',
    };

    if (agent?.origin === 'nexus') {
      data.is_nexus_agent = true;
      data.agent_uuid = feature_uuid;
    }

    const response = await integrateAgentRequest(data);

    const agents = store.getState().project.agents;
    store.dispatch(setAgents(agents.map((item) => ({ ...item, isAssigned: item.uuid === feature_uuid || item.isAssigned }))));
    return { success: true, data: response };
  } catch (error) {
    const agents = store.getState().project.agents;
    store.dispatch(setAgents(agents.map((item) => ({ ...item, isAssigned: item.uuid !== feature_uuid && item.isAssigned }))))
    return { success: false, error: error || 'unknown error' };
  } finally {
    store.dispatch(setAgentsLoading(agentsLoading.filter(loading => loading.agent_uuid !== feature_uuid)));
  }
}

export async function updateAgentSettings(code: AgentCommerce['code'], body: UpdateAgentSettingsData) {
  store.dispatch(setUpdateAgentLoading(true))

  try {
    const response = await agentsSettingsUpdate({ agentUuid: body.agentUuid, code, formData: body.formData });
    if (!response || response.error) {
      throw new Error(response?.message || 'error updating agent.');
    }

    await updateAgentsList()
    return { success: true, data: response };
  } catch (error) {
    console.error('error updating agent:', error);
    return { success: false, error: error || 'unknown error' };
  } finally {
    store.dispatch(setUpdateAgentLoading(false))
  }
}

export async function disableAgent(project_uuid: string, feature_uuid: string, agentOrigin: string) {
  try {
    const data =
      agentOrigin === 'nexus' ?
        { project_uuid, feature_uuid, agent_uuid: feature_uuid, is_nexus_agent: true } :
        { project_uuid, feature_uuid };

    const response = await disableFeatureRequest(data);

    if (response?.error) {
      throw new Error(response?.message || 'error updating agent.');
    }

    await updateAgentsList();
    return { success: true, data: response };
  } catch (error) {
    console.error('error updating agent:', error);
    return { success: false, error: error || 'unknown error' };
  }
}

export async function getSkillMetrics(data: { startDate: string, endDate: string }) {
  try {
    const response = await getSkillMetricsRequest(data) as GetSkillMetricsResponse;
    if (!response.data) {
      throw new Error('No metrics data received');
    }
    return adaptGetSkillMetricsResponse(response);
  } catch (error: unknown) {
    console.error('error getting skill metrics:', error);
    return { success: false, error: error instanceof Error ? error.message : 'unknown error' };
  }
}

export async function getWhatsAppURLService() {
  const WhatsAppURL = store.getState().project.WhatsAppURL;

  if (WhatsAppURL) {
    return WhatsAppURL;
  }

  const response = await getWhatsAppURLRequest();

  if (response.error?.detail) {
    throw new Error(response.error.detail);
  }

  const redirectUrl = response.config?.redirect_url || '';

  store.dispatch(setWhatsAppURL(redirectUrl));
  return redirectUrl;
}

export async function assignedAgentTemplate(data: { templateUuid: string }) {
  const templates = store.getState().project.assignedAgents
    .map((agent) => agent.templates)
    .flat()

  const template = templates.find((template) => template.uuid === data.templateUuid);

  if (!template) {
    throw new Error('Template not found');
  }

  return template;
}

export async function updateAgentTemplate(data: { templateUuid: string, template: { header?: string, content: string, footer?: string, button?: { text: string, url: string, urlExample?: string } } }) {
  const response = await updateAgentTemplateRequest(data);

  const assignedAgents = store.getState().project.assignedAgents;

  const statusValues = Object.values(status);

  store.dispatch(setAssignedAgents(assignedAgents.map((agent) => {
    return {
      ...agent,
      templates: agent.templates.map((template) => {
        if (template.uuid === response.uuid) {
          return {
            ...template,
            status: status[response.status] as typeof statusValues[number],
            metadata: {
              ...template.metadata,
              header: response.metadata.header,
              body: response.metadata.body,
              footer: response.metadata.footer,
              buttons: response.metadata.buttons,
            }
          };
        }

        return template;
      })
    }
  })));
}

export async function createAssignedAgentTemplate(data: { name: string, header?: { type: 'text', text: string } | { type: 'media', src: string }, body: string, footer?: string, button?: { text: string, url: string }, assignedAgentUuid: string, variables: { definition: string, fallback: string }[], startCondition: string }) {
  const response = await createAssignedAgentTemplateRequest(data);
  return response;
}

export async function disableAssignedAgentTemplate(data: { templateUuid: string }) {
  const response = await disableAssignedAgentTemplateRequest(data);

  const assignedAgents = store.getState().project.assignedAgents;

  store.dispatch(setAssignedAgents(assignedAgents.map((agent) => {
    return {
      ...agent,
      templates: agent.templates.filter((template) => template.uuid !== data.templateUuid),
    }
  })));

  return response;
}

export async function agentMetrics(data: { templateUuid: string, startDate: string, endDate: string }) {
  const response = await agentMetricsRequest({
    templateUuid: data.templateUuid,
    startDate: data.startDate,
    endDate: data.endDate,
  });

  return response;
}

function updateAssignedAgentProperty(agentUuid: string, replace: Record<string, string | number>) {
  const assignedAgents = store.getState().project.assignedAgents;

  store.dispatch(setAssignedAgents(assignedAgents.map((agent) => {
    return agent.uuid === agentUuid ?
      {
        ...agent,
        ...replace,
      }
      : agent;
  })));
}

export async function updateAgentGlobalRule(data: {
  agentUuid: string;
  contactPercentage?: number;
  globalRule?: string;
}) {
  const response = await updateAgentGlobalRuleRequest(data);

  updateAssignedAgentProperty(data.agentUuid, {
    globalRule: response.globalRule,
    contactPercentage: response.contactPercentage,
  });

  return response;
}
