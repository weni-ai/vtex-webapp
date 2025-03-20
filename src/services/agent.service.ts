/* eslint-disable @typescript-eslint/no-explicit-any */
import { UpdateAgentSettingsData } from "../api/agents/adapters";
import { disableFeatureRequest, integrateAgentRequest, integratedAgentsList, updateAgentSettingsRequest, createAgentBuilderRequest } from "../api/agents/requests";
import { agentsList } from "../api/agents/requests";
import { setAgents, setDisableAgentLoading, setIntegratedAgents, setUpdateAgentLoading, setAgentsLoading } from "../store/projectSlice";
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
    const response = await VTEXFetch(`/_v/check-agent-builder?projectUUID=${project_uuid}`, {
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

export async function setAgentBuilder(payload: any) {
  console.log('payload', payload)

  const response = await createAgentBuilderRequest(payload);

  if (response.error) {
    return { success: false, error: response?.message || 'Error creating agent' };
  }
  return { success: true, data: response };
}

export async function updateAgentsList() {
  const availableAgents = await agentsList();
  store.dispatch(setAgents(availableAgents));

  const integratedAgents = await integratedAgentsList();
  store.dispatch(setIntegratedAgents(integratedAgents))
  store.dispatch(setAgentsLoading(availableAgents.map(agent => ({ agent_uuid: agent.uuid, isLoading: false }))))
}

export async function integrateAgent(feature_uuid: string, project_uuid: string) {
  const agentsLoading = store.getState().project.agentsLoading;
  const agentLoading = agentsLoading.find(loading => loading.agent_uuid === feature_uuid);
  if (agentLoading) {
    store.dispatch(setAgentsLoading([...agentsLoading, { agent_uuid: feature_uuid, isLoading: true }]));
  }
  try {
    const storeAddress = store.getState().auth.base_address;
    const flows_channel_uuid = store.getState().project.flows_channel_uuid;
    const wpp_cloud_app_uuid = store.getState().project.wpp_cloud_app_uuid;

    const data = {
      feature_uuid,
      project_uuid,
      store: storeAddress,
      flows_channel_uuid,
      wpp_cloud_app_uuid,
    };

    const response = await integrateAgentRequest(data);
    await updateAgentsList();

    store.dispatch(setAgentsLoading(agentsLoading.filter(loading => loading.agent_uuid !== feature_uuid)));
    return { success: true, data: response };
  } catch (error) {
    store.dispatch(setAgentsLoading(agentsLoading.filter(loading => loading.agent_uuid !== feature_uuid)));
    return { success: false, error: error || 'unknown error' };
  }
}

export async function updateAgentSettings(body: UpdateAgentSettingsData) {
  store.dispatch(setUpdateAgentLoading(true))

  try {
    const response = await updateAgentSettingsRequest(body);

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

export async function disableAgent(project_uuid: string, feature_uuid: string) {
  store.dispatch(setDisableAgentLoading(true))

  try {
    const response = await disableFeatureRequest({ project_uuid, feature_uuid });

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