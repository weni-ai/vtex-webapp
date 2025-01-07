/* eslint-disable @typescript-eslint/no-explicit-any */
import { VTEXFetch } from "../utils/VTEXFetch";

export async function setAgentBuilder(payload: any, project_uuid: string, token: string) {
  try {
    return await VTEXFetch(`/v/create-agent-builder?projectUUID=${project_uuid}&token=${token}`, {
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
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

