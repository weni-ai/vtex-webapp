/* eslint-disable @typescript-eslint/no-explicit-any */
import { VTEXFetch } from "../utils/VTEXFetch";
import storeProvider from "../store/provider.store";
import { setFeatureLoading } from "../store/projectSlice";

export async function getFeatureList(project_uuid: string, token: string) {
  try {
    const response = await VTEXFetch(`/_v/get-feature-list?projectUUID=${project_uuid}&token=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response || response.error) {
      throw new Error(response?.message || 'error retrieving list of agents.');
    }

    return { success: true, data: response };
  } catch (error) {
    console.error('error retrieving list of agents:', error);
    return { success: false, error: error || 'unknown error' };
  }
}

export async function integrateFeature(feature_uuid: string, project_uuid: string, token: string) {
  console.log('entrou no integrate feature com ', feature_uuid, project_uuid, token)
  const store = storeProvider.getState().auth.base_address;
  const flows_channel_uuid = storeProvider.getState().project.flows_channel_uuid;
  const wpp_cloud_app_uuid = storeProvider.getState().project.wpp_cloud_app_uuid;

  const data = {
    feature_uuid,
    project_uuid,
    store,
    flows_channel_uuid,
    wpp_cloud_app_uuid,
  };

  try {
    const response = await VTEXFetch(`/_v/integrate-feature?token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response || response.error) {
      throw new Error(response?.message || 'error integrating agents.');
    }

    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error || 'unknown error' };
  }
}

export async function getIntegratedFeatures(project_uuid: string, token: string) {
  try {
    const response = await VTEXFetch(`/_v/get-integrated-features?token=${token}&projectUUID=${project_uuid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response || response.error) {
      throw new Error(response?.message || 'error retrieving list of integrated agents.');
    }

    return { success: true, data: response };
  } catch (error) {
    console.error('error retrieving list of integrated agents:', error);
    return { success: false, error: error || 'unknown error' };
  }
}

export async function updateAgentSettings(body: any, token: string) {
  storeProvider.dispatch(setFeatureLoading(true))

  try {
    const response = await VTEXFetch<{
      message: string;
      error: string;
    }>(`/_v/update-feature-settings?token=${token}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response || response.error) {
      throw new Error(response?.message || 'error updating agent.');
    }

    return { success: true, data: response };
  } catch (error) {
    console.error('error updating agent:', error);
    return { success: false, error: error || 'unknown error' };
  } finally {
    storeProvider.dispatch(setFeatureLoading(false))
  }
}
