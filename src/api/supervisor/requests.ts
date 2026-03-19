import store from "../../store/provider.store";
import getEnv from "../../utils/env";
import { proxy } from "../proxy";
import { adaptSupervisorResponse, SupervisorApiResponse } from "./adapters";

const MAX_RESULTS = 20;

export async function fetchSupervisorConversations() {
  const projectUuid = store.getState().project.project_uuid;

  const response = await proxy<SupervisorApiResponse>(
    'GET',
    `${getEnv('VITE_APP_NEXUS_URL')}/api/${projectUuid}/supervisor/`,
    {
      params: {
        page_size: String(MAX_RESULTS),
      },
    },
  );

  return adaptSupervisorResponse(response);
}
