import store from '../../store/provider.store';
import getEnv from '../../utils/env';
import { proxy } from '../proxy';
import {
  type ConversationTotalsResponse,
  type RevenueResponse,
  type CSATResponse,
  type MessagesAnalyticsResponse,
  adaptConversationTotals,
  adaptRevenue,
  adaptCSAT,
  adaptMessagesAnalytics,
} from './adapters';

const UTM_SOURCE = 'weni-ai-agent';

export async function getConversationTotalsRequest(params: {
  startDate: string;
  endDate: string;
}) {
  const projectUuid = store.getState().project.project_uuid;

  const response = await proxy<ConversationTotalsResponse>(
    'GET',
    `${getEnv('VITE_APP_INSIGHTS_URL')}/v1/metrics/conversations/totals/`,
    {
      params: {
        project_uuid: projectUuid,
        start_date: params.startDate,
        end_date: params.endDate,
      },
    },
  );

  return adaptConversationTotals(response);
}

export async function getRevenueRequest(params: {
  startDate: string;
  endDate: string;
}) {
  const projectUuid = store.getState().project.project_uuid;

  const response = await proxy<RevenueResponse>(
    'GET',
    `${getEnv('VITE_APP_INSIGHTS_URL')}/v1/metrics/vtex/internal/orders/from_utm_source/`,
    {
      params: {
        project_uuid: projectUuid,
        start_date: params.startDate,
        end_date: params.endDate,
        utm_source: UTM_SOURCE,
      },
    },
  );

  return adaptRevenue(response);
}

export async function getCSATRequest(params: {
  startDate: string;
  endDate: string;
}) {
  const projectUuid = store.getState().project.project_uuid;

  const response = await proxy<CSATResponse>(
    'GET',
    `${getEnv('VITE_APP_INSIGHTS_URL')}/v1/metrics/conversations/csat/`,
    {
      params: {
        project_uuid: projectUuid,
        start_date: params.startDate,
        end_date: params.endDate,
        type: 'AI',
      },
    },
  );

  return adaptCSAT(response);
}

export async function getMessagesAnalyticsRequest(params: {
  startDate: string;
  endDate: string;
}) {
  const projectUuid = store.getState().project.project_uuid;

  const response = await proxy<MessagesAnalyticsResponse>(
    'GET',
    `${getEnv('VITE_APP_INSIGHTS_URL')}/api/v1/metrics/meta/internal/whatsapp-message-templates/messages-analytics/`,
    {
      params: {
        project_uuid: projectUuid,
        start_date: params.startDate,
        end_date: params.endDate,
      },
    },
  );

  return adaptMessagesAnalytics(response);
}
