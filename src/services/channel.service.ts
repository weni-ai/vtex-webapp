/* eslint-disable @typescript-eslint/no-explicit-any */
import store from "../store/provider.store";
import { VTEXFetch } from "../utils/VTEXFetch";
import { setFeatureIntegrated, setLoadingWhatsAppIntegration, setWhatsAppError, setWhatsAppIntegrated } from "../store/userSlice";
import { toast } from "@vtex/shoreline";
import { setFlowsChannelUuid, setWppCloudAppUuid, setWppLoading } from "../store/projectSlice";

export async function checkWppIntegration(project_uuid: string) {
  try {
    const response = await VTEXFetch(`/_v/check-whatsapp-integration?projectUUID=${project_uuid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response || response?.error) {
      throw new Error(response?.error || '')
    }

    return { success: true, data: response };
  } catch (error) {
    console.error('error verifying WhatsApp integration:', error);
    return { success: false, error: error || 'unknown error' };
  }
}

export async function createChannel(code: string, project_uuid: string, wabaId: string, phoneId: string): Promise<any> {
  store.dispatch(setWppLoading(true))
  const data = {
    waba_id: wabaId,
    phone_number_id: phoneId,
    project_uuid: project_uuid,
    auth_code: code,
  };

  try {
    const response = await VTEXFetch(`/_v/whatsapp-integration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response || response?.error) {
      throw new Error(response.error || '')
    }

    store.dispatch(setWhatsAppIntegrated(true));
    store.dispatch(setLoadingWhatsAppIntegration(true));
    store.dispatch(setFeatureIntegrated(true));
    store.dispatch(setFlowsChannelUuid(response.flows_channel_uuid));
    store.dispatch(setWppCloudAppUuid(response.wpp_cloud_app_uuid));
    toast.success(t('integration.channels.whatsapp.success'))

    return { success: true, data: response };
  } catch (error) {
    console.error('error creating channel:', error);
    store.dispatch(setWhatsAppError(JSON.stringify(error) || 'unknown error'));
    toast.critical(t('integration.channels.whatsapp.error'));
    return { success: false, error: error };
  } finally {
    store.dispatch(setWppLoading(false))
  }
}
