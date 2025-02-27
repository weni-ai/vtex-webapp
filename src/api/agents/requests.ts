import { useSelector } from "react-redux";
import { VTEXFetch } from "../../utils/VTEXFetch";
import { selectProject } from "../../store/projectSlice";
import {
  AgentsListResponse,
  adapterAgentsList,
  IntegratedAgentsListResponse,
  adapterIntegratedAgentsList,
} from "./adapters";

export async function agentsList() {
  const projectUuid = useSelector(selectProject);

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
  const projectUuid = useSelector(selectProject);

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
