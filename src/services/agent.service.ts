/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "../pages/setup/useUserSetup";
import { VTEXFetch } from "../utils/VTEXFetch";

export async function setAgentBuilder(payload: any, project_uuid: string, token: string) {
  const url = `/_v/create-agent-builder?projectUUID=${project_uuid}&token=${token}`
  console.log(url, payload);
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
  });
}

