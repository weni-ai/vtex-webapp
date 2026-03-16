import { proxy } from '../proxy';
import store from '../../store/provider.store';
import getEnv from '../../utils/env';

interface SupervisorResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: unknown[];
}

export async function getConversationsCount(): Promise<number> {
  const projectUuid = store.getState().project.project_uuid;

  const response = await proxy<SupervisorResponse>(
    'GET',
    `${getEnv('VITE_APP_NEXUS_URL')}/api/${projectUuid}/supervisor/`,
    {
      headers: {
        'Project-Uuid': projectUuid,
      },
    },
  );

  if (typeof response?.count !== 'number') {
    throw new Error('Invalid response: missing conversations count');
  }

  return response.count;
}
