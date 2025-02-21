/* eslint-disable @typescript-eslint/no-explicit-any */
import { VTEXFetch } from "../utils/VTEXFetch";
import storeProvider from "../store/provider.store";
import { setDisableFeatureLoading, setFeatureList, setFeatureLoading, setIntegratedFeatures, setUpdateFeatureLoading } from "../store/projectSlice";

export async function getFeatureList(project_uuid: string) {
  try {
    const response = await VTEXFetch(`/_v/get-feature-list?projectUUID=${project_uuid}`, {
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

export async function updateFeatureList(project_uuid: string) {
  const availableFeatures = await getFeatureList(project_uuid);

  if (availableFeatures?.error) {
    return { success: false, error: JSON.stringify(availableFeatures?.error) || 'unknown error' };
  }
  storeProvider.dispatch(setFeatureList(availableFeatures.data.features))

  const integratedFeatures = await getIntegratedFeatures(project_uuid);

  if (integratedFeatures?.error) {
    return { success: false, error: JSON.stringify(integratedFeatures?.error) || 'unknown error' };
  }
  storeProvider.dispatch(setIntegratedFeatures(integratedFeatures.data.integratedFeatures))
}

export async function integrateFeature(feature_uuid: string, project_uuid: string) {
  storeProvider.dispatch(setUpdateFeatureLoading({feature_uuid: feature_uuid, isLoading: true}))
  const store = 'https://anadev--qastore.myvtex.com' //storeProvider.getState().auth.base_address;
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
    const response = await VTEXFetch(`/_v/integrate-feature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response || response.error) {
      throw new Error(response?.message || 'error integrating agents.');
    }

    await updateFeatureList(project_uuid);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error || 'unknown error' };
  } finally {
    storeProvider.dispatch(setUpdateFeatureLoading({feature_uuid: feature_uuid, isLoading: true}))
  }
}

export async function getIntegratedFeatures(project_uuid: string) {
  try {
    const response = await VTEXFetch(`/_v/get-integrated-features?projectUUID=${project_uuid}`, {
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

export async function updateAgentSettings(body: any) {
  storeProvider.dispatch(setFeatureLoading(true))

  try {
    const response = await VTEXFetch<{
      message: string;
      error: string;
    }>(`/_v/update-feature-settings`, {
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

export async function disableFeature(project_uuid: string, feature_uuid: string) {
  storeProvider.dispatch(setDisableFeatureLoading(true))

  try{
    const response = await VTEXFetch<{
      message: string;
      error: string;
    }>(`/_v/disable-feature`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_uuid,
        feature_uuid
      }),
    })

    if(response?.error){
      throw new Error(response?.message || 'error updating agent.');
    }

    await updateFeatureList(project_uuid);
    return { success: true, data: response };
  } catch(error){
    console.error('error updating agent:', error);
    return { success: false, error: error || 'unknown error' };
  } finally{
    storeProvider.dispatch(setDisableFeatureLoading(false))
  }
}
