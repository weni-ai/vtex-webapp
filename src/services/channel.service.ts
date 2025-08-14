import { toast } from "@vtex/shoreline";
import { VTEXWhatsAppAdapter } from "../api/channels/adapters";
import { setFlowsChannelUuid, setWppCloudAppUuid, setWppLoading } from "../store/projectSlice";
import store from "../store/provider.store";
import { setAgentBuilderIntegrated, setLoadingWhatsAppIntegration, setWhatsAppError, setWhatsAppIntegrated, setWhatsAppPhoneNumber } from "../store/userSlice";
import { VTEXFetch } from "../utils/VTEXFetch";

const whatsappAdapter = new VTEXWhatsAppAdapter();

export async function checkWppIntegration(project_uuid: string) {
  return whatsappAdapter.checkIntegration(project_uuid);
}

export async function createChannel(code: string, project_uuid: string, wabaId: string, phoneId: string): Promise<{ success: boolean, error?: unknown }> {
  store.dispatch(setWppLoading(true))
  const data = {
    waba_id: wabaId,
    phone_number_id: phoneId,
    project_uuid: project_uuid,
    auth_code: code,
  };

  try {
    const response = await VTEXFetch<{ flows_channel_uuid: string, wpp_cloud_app_uuid: string, phone_number: string, error?: string, }>(`/_v/whatsapp-integration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Project-Uuid': project_uuid,
      },
      body: JSON.stringify(data),
    });

    if (!response || response?.error) {
      throw new Error(response.error || '')
    }

    store.dispatch(setWhatsAppIntegrated(true));
    store.dispatch(setLoadingWhatsAppIntegration(true));
    store.dispatch(setAgentBuilderIntegrated(true));
    store.dispatch(setFlowsChannelUuid(response.flows_channel_uuid));
    store.dispatch(setWppCloudAppUuid(response.wpp_cloud_app_uuid));
    toast.success(t('integration.channels.whatsapp.success'));

    checkWppIntegration(project_uuid).then((response) => {
      const { phone_number = null } = response.data || {};

      if (response?.error) {
        throw new Error(JSON.stringify(response.error))
      }

      if (phone_number) {
        store.dispatch(setWhatsAppPhoneNumber(phone_number ? phone_number.replace(/\D/g, '') : null));
      }
    });

    return { success: true };
  } catch (error) {
    console.error('error creating channel:', error);
    store.dispatch(setWhatsAppError(JSON.stringify(error) || 'unknown error'));
    toast.critical(t('integration.channels.whatsapp.error'));
    return { success: false, error: error };
  } finally {
    store.dispatch(setWppLoading(false))
  }
}
