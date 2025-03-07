import store from "../../store/provider.store";
import { VTEXFetch } from "../../utils/VTEXFetch";
import { 
  UpdateAgentSettingsData, 
  UpdateAgentSettingsResponse,
  adaptUpdateAgentSettingsRequest,
  adaptUpdateAgentSettingsResponse 
} from "./adapters";

interface IntegrateFeatureData {
  feature_uuid: string;
  project_uuid: string;
  store: string;
  flows_channel_uuid: string;
  wpp_cloud_app_uuid: string;
}

export async function integrateFeatureRequest(data: IntegrateFeatureData) {
  const response = await VTEXFetch<{
    message: string;
    error: string;
  }>('/_v/integrate-feature', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (response?.error) {
    throw new Error(response.message || 'Error integrating feature');
  }

  return response;
}

export async function updateAgentSettingsRequest(data: UpdateAgentSettingsData) {
  const adaptedData = adaptUpdateAgentSettingsRequest(data);
  
  const response = await VTEXFetch<UpdateAgentSettingsResponse>(
    '/_v/update-feature-settings',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
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
  return await VTEXFetch<{
    message: string;
    error: string;
  }>(`/_v/disable-feature`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
} 

export async function getSkillMetricsRequest() {
  const projectUuid = store.getState().project.project_uuid;

  const queryParams = new URLSearchParams({
    projectUUID: projectUuid,
    skill: 'abandoned_cart',
    start_date: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  });

  const url = `/_v/get-skill-metrics?${queryParams.toString()}`;

  return await VTEXFetch<{
    message: string;
    error: string;
  }>(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}