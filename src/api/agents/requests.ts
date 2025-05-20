import { setStoreType } from "../../store/projectSlice";
import store from "../../store/provider.store";
import getEnv from "../../utils/env";
import { VTEXFetch } from "../../utils/VTEXFetch";
import {
  AgentsListResponse,
  IntegratedAgentsListResponse,
  UpdateAgentSettingsData,
  UpdateAgentSettingsResponse,
  adaptUpdateAgentSettingsRequest,
  adaptUpdateAgentSettingsResponse,
  adapterAgentsList,
  adapterIntegratedAgentsList,
} from "./adapters";

interface IntegrateAgentData {
  feature_uuid: string;
  project_uuid: string;
  store: string;
  flows_channel_uuid: string;
  wpp_cloud_app_uuid: string;
  origin?: 'commerce' | 'nexus';
}

interface CreateAgentBuilderData {
  agent: {
    name: string;
    objective: string;
    occupation: string;
  };
  links: string[];
}
export async function createAgentBuilderRequest(data: CreateAgentBuilderData) {
  const projectUuid = store.getState().project.project_uuid;
  const url = `/_v/create-agent-builder?projectUUID=${projectUuid}`;
  const response = await VTEXFetch<{
    message: string;
    error: string;
  }>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response;
}

export async function agentsList() {
  const projectUuid = store.getState().project.project_uuid;

  const response = await VTEXFetch<AgentsListResponse>('/_v/proxy-request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      method: 'POST',
      url: `${getEnv('VITE_APP_COMMERCE_URL')}/v2/feature/${projectUuid}`,
      params: {
        category: 'ACTIVE',
        can_vtex_integrate: true,
        nexus_agents: true,
      },
    }),
  });

  store.dispatch(setStoreType(response.store_type));

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

export async function integrateAgentRequest(data: IntegrateAgentData) {
  const response = await VTEXFetch<{
    message: string;
    error: string;
  }>('/_v/integrate-feature', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (response?.error) {
    throw new Error(response.message || 'Error integrating feature');
  }

  return response;
}

export async function updateAgentSettingsRequest(data: UpdateAgentSettingsData) {
  const adaptedData = adaptUpdateAgentSettingsRequest(store.getState().project.project_uuid, data);

  const response = await VTEXFetch<UpdateAgentSettingsResponse>(
    '/_v/update-feature-settings',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adaptedData),
    }
  );

  return adaptUpdateAgentSettingsResponse(response);
}

export async function disableFeatureRequest(data: {
  project_uuid: string;
  feature_uuid: string;
}) {
  return await VTEXFetch<{
    message: string;
    error: string;
  }>(`/_v/disable-feature`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export async function getSkillMetricsRequest() {
  const projectUuid = store.getState().project.project_uuid;

  const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7));

  const [startDate] = sevenDaysAgo.toISOString().split('T');
  const [endDate] = new Date().toISOString().split('T');

  const queryParams = new URLSearchParams({
    projectUUID: projectUuid,
    skill: 'abandoned_cart',
    start_date: startDate,
    end_date: endDate,
  });

  const url = `/_v/get-skill-metrics?${queryParams.toString()}`;

  return {
    data: await VTEXFetch<{
      id: 'sent-messages' | 'delivered-messages' | 'read-messages' | 'interactions' | 'utm-revenue' | 'orders-placed';
      value: number;
      prefix?: string;
    }[]>(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  };
}

interface IntegrationsError {
  error?: {
    detail: string;
  }
}

export async function getWhatsAppURLRequest(): Promise<{
  config?: {
    redirect_url?: string;
  };
} & IntegrationsError> {
  const projectUuid = store.getState().project.project_uuid;

  const response = await VTEXFetch<{
    config?: {
      redirect_url?: string;
    };
  } & IntegrationsError>('/_v/proxy-request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      method: 'POST',
      url: `${getEnv('VITE_APP_INTEGRATIONS_URL')}/api/v1/apptypes/wpp-demo/apps/get-or-create/`,
      data: {
        project_uuid: projectUuid,
      }
    }),
  });

  return response;
}
