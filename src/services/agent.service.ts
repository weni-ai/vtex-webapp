/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@vtex/shoreline";
import { VTEXFetch } from "../utils/VTEXFetch";
import getEnv from "src/utils/env";

export async function checkAgentIntegration(project_uuid: string, token: string) {
  const integrationsAPI = getEnv('VITE_APP_NEXUS_URL') || '';
  const apiUrl = `${integrationsAPI}/api/commerce/check-exists-agent-builder?project_uuid=${project_uuid}`;

  if (!integrationsAPI) {
    console.error('VITE_APP_NEXUS_URL não está configurado');
    return;
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Erro no fetch:', response.statusText);
      throw new Error(`Erro ao verificar integração: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro durante a verificação da integração:', error);
    throw error;
  }
}

export async function setAgentBuilder(payload: any, project_uuid: string, token: string) {
  const url = `/_v/create-agent-builder?projectUUID=${project_uuid}&token=${token}`
  return await VTEXFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then((response) => {
    console.log('response', response)
  }).catch((error) => {
    console.error('Erro na criação do agente:', error);
    toast.critical(t('agent.error'));
  });
}

