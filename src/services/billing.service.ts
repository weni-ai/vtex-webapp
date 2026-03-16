import * as Sentry from '@sentry/react';
import type { MetaPricing } from '../api/billing/adapters';
import { getMetaPricingRequest } from '../api/billing/requests';

let cachedPricing: MetaPricing | null = null;

export async function getMetaPricing(): Promise<MetaPricing> {
  if (cachedPricing) return cachedPricing;

  try {
    const result = await getMetaPricingRequest();
    cachedPricing = result;
    return result;
  } catch (error: unknown) {
    Sentry.captureEvent({
      message: 'getMetaPricing error',
      level: 'error',
      tags: {
        service: 'billing.service',
        function: 'getMetaPricing',
      },
      extra: {
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      },
    });
    throw error;
  }
}
