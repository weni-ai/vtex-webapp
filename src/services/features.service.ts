import { toast } from "@vtex/shoreline";
import { VTEXFetch } from "../utils/VTEXFetch";
import storeProvider from "../store/provider.store";

export async function getFeatureList(project_uuid: string, token: string) {
  return await VTEXFetch(`/_v/get-feature-list?projectUUID=${project_uuid}&token=${token}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  }).then((response) => {
    if (response.error) {
      console.log('erro')
    } else {
      return response
    }
  }).catch((error) => {
    console.error('Error:', error);
  });
}

export async function integrateAvailableFeatures(project_uuid: string, token: string) {
  const store = storeProvider.getState().auth.base_address;
  const flows_channel_uuid = storeProvider.getState().project.flows_channel_uuid;
  const wpp_cloud_app_uuid = storeProvider.getState().project.wpp_cloud_app_uuid

  const data = {
    project_uuid,
    store,
    flows_channel_uuid,
    wpp_cloud_app_uuid
  };
  await VTEXFetch(`/_v/integrate-available-features?token=${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.error) {
      toast.critical(t('integration.error'));
    } else {
      toast.success(t('integration.success'))
      console.log('Feature integrated', response)
    }
  }).catch((error) => {
    console.error('Error:', error);
    toast.critical(t('integration.error'));
  });
}