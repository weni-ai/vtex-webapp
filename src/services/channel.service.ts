/* eslint-disable @typescript-eslint/no-explicit-any */
import store from "../store/provider.store";
import { VTEXFetch } from "../utils/VTEXFetch";
import { setFeatureIntegrated, setLoadingWhatsAppIntegration, setWhatsAppError, setWhatsAppIntegrated } from "../store/userSlice";
import { toast } from "@vtex/shoreline";
import getEnv from "../utils/env";
import { setFlowsChannelUuid, setWppCloudAppUuid } from "../store/projectSlice";

export async function checkWppIntegration(project_uuid: string, token: string) {
  const integrationsAPI = getEnv('VITE_APP_INTEGRATIONS_URL') || '';
  const apiUrl = `${integrationsAPI}/api/v1/commerce/check-whatsapp-integration?project_uuid=${project_uuid}`;

  if (!integrationsAPI) {
    console.error('Erro: VITE_APP_INTEGRATIONS_URL não está configurado.');
    return { success: false, error: 'Configuração ausente.' };
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.message || `Erro ${response.status}` };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Erro ao verificar integração do WhatsApp:', error);
    return { success: false, error: error || 'Erro desconhecido' };
  }
}

export async function createChannel(code: string, project_uuid: string, wabaId: string, phoneId: string, token: string): Promise<any> {
  const data = {
    waba_id: wabaId,
    phone_number_id: phoneId,
    project_uuid: project_uuid,
    auth_code: code,
  };

  console.log("Creating channel with data:", data);

  try {
    const response = await VTEXFetch(`/_v/whatsapp-integration?token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response || response.error) {
      throw new Error(response?.error || '')
    }

    store.dispatch(setWhatsAppIntegrated(true));
    store.dispatch(setLoadingWhatsAppIntegration(true));
    store.dispatch(setFeatureIntegrated(true));
    toast.success(t('integration.channels.whatsapp.success'))

    const checkResponse = await checkWppIntegration(project_uuid, token);

    if (checkResponse.success && checkResponse.data.has_whatsapp) {
      store.dispatch(setFlowsChannelUuid(checkResponse.data.flows_channel_uuid));
      store.dispatch(setWppCloudAppUuid(checkResponse.data.wpp_cloud_app_uuid));
    }
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Erro ao criar canal:', error);
    store.dispatch(setWhatsAppError(error|| 'Erro desconhecido.'));
    toast.critical(t('integration.channels.whatsapp.error'));
    return { success: false, error: error  };
  }
}
