import store from "../store/provider.store";
import { VTEXFetch } from "../utils/VTEXFetch";
import { setLoadingWhatsAppIntegration, setWhatsAppError, setWhatsAppIntegrated } from "../store/userSlice";
import { toast } from "@vtex/shoreline";
import getEnv from "../utils/env";

export async function checkWppIntegration(project_uuid: string, token: string) {
  console.log('checando o zap',  )
  const integrationsAPI = getEnv('VITE_APP_INTEGRATIONS_URL') || '';
  const apiUrl = `${integrationsAPI}/api/v1/commerce/check-whatsapp-integration?project_uuid=${project_uuid}`
  console.log('dados', integrationsAPI, apiUrl)
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Erro ao verificar integração: ${response.statusText}`);
    }
    const result = await response.json();
    console.log('ta integrado? ', result)
    return result;
  } catch (error) {
    console.error('Error checking integration:', error);
    throw error;
  }
}

export async function createChannel(code: string, project_uuid: string, wabaId: string, phoneId: string, token: string) {
  console.log('entrou no create channel...', code, project_uuid, wabaId, phoneId, token);

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

    console.log('Whatsapp registered', response);

    store.dispatch(setWhatsAppIntegrated(true));
    store.dispatch(setLoadingWhatsAppIntegration(true));
  } catch (error) {
    store.dispatch(setWhatsAppError(error));
    console.error('Error:', error);
    toast.critical('Integrations channel WhatsApp error');
  }
}
