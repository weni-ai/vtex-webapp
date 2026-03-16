import { proxy } from '../proxy';
import store from '../../store/provider.store';
import getEnv from '../../utils/env';
import { ProjectDetail } from '../../interfaces/Store';

interface ProjectDetailResponse {
  uuid: string;
  name: string;
  description: string | null;
  timezone: string;
  date_format: string;
  config: Record<string, unknown>;
  created_at: string;
  status: string;
  project_type: number;
  project_mode: number;
  vtex_account: string;
  organization_billing: {
    plan: string;
    trial_end_date: string;
    days_till_trial_end: number;
  };
}

function toProjectDetail(response: ProjectDetailResponse): ProjectDetail {
  return {
    uuid: response.uuid,
    name: response.name,
    created_at: response.created_at,
    status: response.status,
    organization_billing: {
      plan: response.organization_billing.plan,
      trial_end_date: response.organization_billing.trial_end_date,
      days_till_trial_end: response.organization_billing.days_till_trial_end,
    },
  };
}

export async function getProjectDetail(): Promise<ProjectDetail> {
  const projectUuid = store.getState().project.project_uuid;

  const response = await proxy<ProjectDetailResponse>(
    'GET',
    `${getEnv('VITE_APP_API_URL')}/v2/projects/${projectUuid}/detail`,
    {
      headers: {
        'Project-Uuid': projectUuid,
      },
    },
  );

  if (!response?.uuid) {
    throw new Error('Invalid response: missing project detail');
  }

  return toProjectDetail(response);
}
