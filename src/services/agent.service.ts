/* eslint-disable @typescript-eslint/no-explicit-any */
import { adaptGetSkillMetricsResponse, GetSkillMetricsResponse, UpdateAgentSettingsData } from "../api/agents/adapters";
import { disableFeatureRequest, getSkillMetricsRequest, integrateAgentRequest, integratedAgentsList, updateAgentSettingsRequest } from "../api/agents/requests";
import { agentsList } from "../api/agents/requests";
import { setAgentLoading, setDisableFeatureLoading, setFeatureList, setFeatureLoading, setIntegratedFeatures, setUpdateFeatureLoading } from "../store/projectSlice";
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

export async function setAgentBuilder(payload: any, project_uuid: string) {
  store.dispatch(setAgentLoading(true))
  const url = `/_v/create-agent-builder?projectUUID=${project_uuid}`;

  const response = await VTEXFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  store.dispatch(setAgentLoading(false))

  if (response?.text !== 'OK') {
    return { success: false, error: response?.message || 'Error creating agent' };
  }
  return { success: true, data: response };
}

export async function updateAgentsList() {
  const availableFeatures = await agentsList();
  store.dispatch(setFeatureList(availableFeatures));

  const integratedFeatures = await integratedAgentsList();
  store.dispatch(setIntegratedFeatures(integratedFeatures))
}

export async function integrateAgent(feature_uuid: string, project_uuid: string) {
  store.dispatch(setUpdateFeatureLoading({ feature_uuid: feature_uuid, isLoading: true }))
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

    store.dispatch(setUpdateFeatureLoading({ feature_uuid: feature_uuid, isLoading: false }))
    return { success: true, data: response };
  } catch (error) {
    store.dispatch(setUpdateFeatureLoading({ feature_uuid: feature_uuid, isLoading: false }))
    return { success: false, error: error || 'unknown error' };
  }
}

export async function updateAgentSettings(body: UpdateAgentSettingsData) {
    store.dispatch(setFeatureLoading(true))

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
    store.dispatch(setFeatureLoading(false))
  }
}

export async function disableAgent(project_uuid: string, feature_uuid: string) {
  store.dispatch(setDisableFeatureLoading(true))

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
    store.dispatch(setDisableFeatureLoading(false))
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
