import { adaptGetSkillMetricsResponse, GetSkillMetricsResponse, UpdateAgentSettingsData } from "../api/agents/adapters";
import { agentsList, assignAgentCLIRequest, createAgentBuilderRequest, disableFeatureRequest, getSkillMetricsRequest, getWhatsAppURLRequest, integrateAgentRequest, integratedAgentsList } from "../api/agents/requests";
import { agentsSettingsUpdate } from "../api/agentsSettings/requests";
import { setAgents, setAgentsLoading, setDisableAgentLoading, setHasTheFirstLoadOfTheAgentsHappened, setUpdateAgentLoading, setWhatsAppURL } from "../store/projectSlice";
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
  await assignAgentCLIRequest({
    agentUuid: data.uuid,
    templatesUuids: data.templatesUuids,
    credentials: data.credentials,
  });

  const agents = store.getState().project.agents;
  store.dispatch(setAgents(agents.map((item) => ({ ...item, isAssigned: item.uuid === data.uuid ? true : item.isAssigned }))));
}

export async function integrateAgent(feature_uuid: string, project_uuid: string) {
  const agents = store.getState().project.agents;
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

    store.dispatch(setAgents(agents.map((item) => ({ ...item, isAssigned: item.uuid === feature_uuid || item.isAssigned }))));
    return { success: true, data: response };
  } catch (error) {
    store.dispatch(setAgents(agents.map((item) => ({ ...item, isAssigned: item.uuid === feature_uuid ? false : item.isAssigned }))))
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
  store.dispatch(setDisableAgentLoading(true))

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
  } finally {
    store.dispatch(setDisableAgentLoading(false))
  }
}

export async function getSkillMetrics() {
  try {
    const response = await getSkillMetricsRequest() as GetSkillMetricsResponse;
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
