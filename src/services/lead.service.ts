import * as Sentry from '@sentry/react';
import { createLeadRequest } from '../api/lead/requests';
import { getConversationsCount } from '../api/conversations/requests';
import { getConversationTotals, getRevenue, getCSAT } from './insights.service';
import { getSkillMetrics } from './agent.service';
import type { SkillMetricsData } from '../api/agents/adapters';
import { getLast3MonthsDates } from '../utils';
import store from '../store/provider.store';

function extractTotalSends(skillMetrics: SkillMetricsData): number {
  return Number(
    skillMetrics.data.find((item) => item.title === 'sent-messages')?.value ??
      0,
  );
}

export async function requestPlanLead(planKey: string): Promise<void> {
  const user = store.getState().user.userData?.user;
  const vtexAccount = store.getState().user.userData?.account;

  if (!user || !vtexAccount) {
    throw new Error('User or VTEX account information is not available');
  }

  const { startDate, endDate } = getLast3MonthsDates();

  const [
    revenueResult,
    skillMetricsResult,
    conversationsCountResult,
    csatResult,
    conversationTotalsResult,
  ] = await Promise.allSettled([
    getRevenue(startDate, endDate),
    getSkillMetrics({ startDate, endDate }),
    getConversationsCount(),
    getCSAT(startDate, endDate),
    getConversationTotals(startDate, endDate),
  ]);

  const revenue =
    revenueResult.status === 'fulfilled' ? revenueResult.value : null;

  const skillMetricsRaw =
    skillMetricsResult.status === 'fulfilled'
      ? skillMetricsResult.value
      : null;
  const skillMetrics =
    skillMetricsRaw && !('success' in skillMetricsRaw)
      ? skillMetricsRaw
      : null;

  const conversationsCount =
    conversationsCountResult.status === 'fulfilled'
      ? conversationsCountResult.value
      : 0;

  const csat =
    csatResult.status === 'fulfilled' ? csatResult.value : null;

  const conversationTotals =
    conversationTotalsResult.status === 'fulfilled'
      ? conversationTotalsResult.value
      : null;

  const cartsTriggered = skillMetrics ? extractTotalSends(skillMetrics) : 0;
  const cartsConverted = revenue?.ordersPlaced.value ?? 0;
  const csatValue = csat ? `${csat.highestLabelScore}%` : '0%';
  const resolutionRate = conversationTotals
    ? `${conversationTotals.resolved.percentage}%`
    : '0%';

  try {
    await createLeadRequest({
      user,
      plan: planKey,
      vtex_account: vtexAccount,
      data: {
        carts_triggered: cartsTriggered,
        carts_converted: cartsConverted,
        total_conversations: conversationsCount,
        csat: csatValue,
        resolution_rate: resolutionRate,
      },
    });
  } catch (error: unknown) {
    Sentry.captureEvent({
      message: 'requestPlanLead error',
      level: 'error',
      tags: {
        service: 'lead.service',
        function: 'requestPlanLead',
      },
      extra: {
        planKey,
        user,
        vtexAccount,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      },
    });
    throw error;
  }
}
