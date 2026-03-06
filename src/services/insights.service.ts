import * as Sentry from '@sentry/react';
import {
  getConversationTotalsRequest,
  getRevenueRequest,
  getCSATRequest,
  getMessagesAnalyticsRequest,
} from '../api/insights/requests';
import type {
  ConversationTotals,
  Revenue,
  CSATData,
  MessagesAnalytics,
} from '../api/insights/adapters';

export async function getConversationTotals(
  startDate: string,
  endDate: string,
): Promise<ConversationTotals> {
  try {
    return await getConversationTotalsRequest({ startDate, endDate });
  } catch (error: unknown) {
    Sentry.captureEvent({
      message: 'getConversationTotals error',
      level: 'error',
      tags: {
        service: 'insights.service',
        function: 'getConversationTotals',
      },
      extra: {
        startDate,
        endDate,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      },
    });
    throw error;
  }
}

export async function getRevenue(
  startDate: string,
  endDate: string,
): Promise<Revenue> {
  try {
    return await getRevenueRequest({ startDate, endDate });
  } catch (error: unknown) {
    Sentry.captureEvent({
      message: 'getRevenue error',
      level: 'error',
      tags: {
        service: 'insights.service',
        function: 'getRevenue',
      },
      extra: {
        startDate,
        endDate,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      },
    });
    throw error;
  }
}

export async function getCSAT(
  startDate: string,
  endDate: string,
): Promise<CSATData> {
  try {
    return await getCSATRequest({ startDate, endDate });
  } catch (error: unknown) {
    Sentry.captureEvent({
      message: 'getCSAT error',
      level: 'error',
      tags: {
        service: 'insights.service',
        function: 'getCSAT',
      },
      extra: {
        startDate,
        endDate,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      },
    });
    throw error;
  }
}

export async function getMessagesAnalytics(
  startDate: string,
  endDate: string,
): Promise<MessagesAnalytics> {
  try {
    return await getMessagesAnalyticsRequest({ startDate, endDate });
  } catch (error: unknown) {
    Sentry.captureEvent({
      message: 'getMessagesAnalytics error',
      level: 'error',
      tags: {
        service: 'insights.service',
        function: 'getMessagesAnalytics',
      },
      extra: {
        startDate,
        endDate,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      },
    });
    throw error;
  }
}
