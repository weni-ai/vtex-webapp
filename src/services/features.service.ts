 
import { VTEXFetch } from "../utils/VTEXFetch";
import storeProvider from "../store/provider.store";
import { setDisableFeatureLoading, setFeatureList, setFeatureLoading, setIntegratedFeatures, setUpdateFeatureLoading } from "../store/projectSlice";
import { agentsList, integratedAgentsList } from "../api/agents/requests";
import { integrateFeatureRequest } from "../api/features/requests";
import { UpdateAgentSettingsData } from "../api/features/adapters";
import { updateAgentSettingsRequest } from "../api/features/requests";

export async function updateFeatureList() {
  const availableFeatures = await agentsList();
  storeProvider.dispatch(setFeatureList(availableFeatures));

  const integratedFeatures = await integratedAgentsList();
  storeProvider.dispatch(setIntegratedFeatures(integratedFeatures))
}

export async function integrateFeature(feature_uuid: string, project_uuid: string) {
  storeProvider.dispatch(setUpdateFeatureLoading({feature_uuid: feature_uuid, isLoading: true}))
  try {
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

    const response = await integrateFeatureRequest(data);
    await updateFeatureList();
    
    storeProvider.dispatch(setUpdateFeatureLoading({feature_uuid: feature_uuid, isLoading: false}))
    return { success: true, data: response };
  } catch (error) {
    storeProvider.dispatch(setUpdateFeatureLoading({feature_uuid: feature_uuid, isLoading: false}))
    return { success: false, error: error || 'unknown error' };
  } 
}

export async function updateAgentSettings(body: UpdateAgentSettingsData) {
  storeProvider.dispatch(setFeatureLoading(true))

  try {
    const response = await updateAgentSettingsRequest(body);

    if (!response || response.error) {
      throw new Error(response?.message || 'error updating agent.');
    }

    await updateFeatureList()
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

    await updateFeatureList();
    return { success: true, data: response };
  } catch(error){
    console.error('error updating agent:', error);
    return { success: false, error: error || 'unknown error' };
  } finally{
    storeProvider.dispatch(setDisableFeatureLoading(false))
  }
}
