import { toast } from "@vtex/shoreline";
import { VTEXFetch } from "../utils/VTEXFetch";
import storeProvider from "../store/provider.store";

export async function integrateAvailableFeatures(projectUUID: string, token: string) {
  const store = storeProvider.getState().auth.base_address;
  const flows_channel_uuid = storeProvider.getState().project.flows_channel_uuid;
  const wpp_cloud_app_uuid = storeProvider.getState().project.wpp_cloud_app_uuid

    const data = {
        projectUUID,
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
        console.log('Feature integrated', response)
      }).catch((error) => {
        console.error('Error:', error);
        toast.critical(t('integration.error'));
      });
}