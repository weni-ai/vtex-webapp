import { VTEXFetch } from "../../utils/VTEXFetch";
import {
  AgentsListResponse,
  adapterAgentsList,
  IntegratedAgentsListResponse,
  adapterIntegratedAgentsList,
} from "./adpters";
import store from "src/store/provider.store";

export async function agentsList() {
  const projectUuid = store.getState().project.project_uuid;

  const queryParams = new URLSearchParams({
    projectUUID: projectUuid
  });

  const url = `/_v/get-feature-list?${queryParams.toString()}`;

  const response = await VTEXFetch<AgentsListResponse>(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return adapterAgentsList(response);
}

export async function integratedAgentsList() {
  const projectUuid = store.getState().project.project_uuid;

  const queryParams = new URLSearchParams({
    projectUUID: projectUuid
  });

  const url = `/_v/get-integrated-features?${queryParams.toString()}`;

  const response = await VTEXFetch<IntegratedAgentsListResponse>(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return adapterIntegratedAgentsList(response);
}
