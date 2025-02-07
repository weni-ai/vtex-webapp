/* eslint-disable @typescript-eslint/no-explicit-any */
import { setAgentLoading } from "../store/projectSlice";
import store from "../store/provider.store";
import { VTEXFetch } from "../utils/VTEXFetch";
import getEnv from "../utils/env";

export async function checkAgentIntegration(project_uuid: string, token: string) {
  const integrationsAPI = getEnv('VITE_APP_NEXUS_URL') || '';
  const apiUrl = `${integrationsAPI}/api/commerce/check-exists-agent-builder?project_uuid=${project_uuid}`;

  if (!integrationsAPI) {
    console.error('VITE_APP_NEXUS_URL is not configured');
    return { success: false, error: 'missing configuration' };
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
    console.error('error in the integration check:', error);
    return { success: false, error: error || 'unknown error' };
  }
}

export async function setAgentBuilder(payload: any, project_uuid: string, token: string) {
  store.dispatch(setAgentLoading(true))
  const url = `/_v/create-agent-builder?projectUUID=${project_uuid}&token=${token}`;

  const response = await VTEXFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  store.dispatch(setAgentLoading(false))
  console.log(response)

  if (response.text !== 'OK') {
    return { success: false, error: response?.message || 'Error creating agent' };
  }
  return { success: true, data: response };
}
