import store from '../../store/provider.store';
import getEnv from '../../utils/env';
import { proxy } from '../proxy';
import {
  type MetaPricingResponse,
  adaptMetaPricing,
} from './adapters';

export async function getMetaPricingRequest() {
  const projectUuid = store.getState().project.project_uuid;

  const response = await proxy<MetaPricingResponse>(
    'GET',
    `${getEnv('VITE_APP_BILLING_URL')}/api/v1/meta-pricing/`,
    {
      params: {
        project_uuid: projectUuid,
      },
    },
  );

  return adaptMetaPricing(response);
}
