import getEnv from '../../utils/env';
import { proxy } from '../proxy';

export interface LeadRequestPayload {
  user: string;
  plan: string;
  vtex_account: string;
  data: {
    carts_triggered: number;
    carts_converted: number;
    total_conversations: number;
    csat: string;
    resolution_rate: string;
  };
}

export async function createLeadRequest(
  payload: LeadRequestPayload,
): Promise<void> {
  await proxy('POST', `${getEnv('VITE_APP_COMMERCE_URL')}/vtex/lead/`, {
    data: payload,
  });
}
