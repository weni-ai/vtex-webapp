export type UsageTier = 'informational' | 'warning' | 'danger' | 'critical';

export const TRIAL_CONVERSATIONS_LIMIT = 1000;
export const MINUTES_SAVED_PER_CONVERSATION = 6;

const TIER_THRESHOLDS = {
  informational: 300,
  warning: 700,
  danger: 999,
} as const;

interface TierStyles {
  background: string;
  border: string;
  barTrack: string;
  barFill: string;
}

const TIER_STYLES: Record<UsageTier, TierStyles> = {
  informational: {
    background: 'var(--sl-bg-informational)',
    border: 'var(--sl-color-blue-3)',
    barTrack: 'var(--sl-color-blue-3)',
    barFill: 'var(--sl-color-blue-9)',
  },
  warning: {
    background: 'var(--sl-bg-warning)',
    border: 'var(--sl-color-yellow-3)',
    barTrack: 'var(--sl-color-yellow-3)',
    barFill: 'var(--sl-color-yellow-7)',
  },
  danger: {
    background: 'var(--sl-color-orange-1)',
    border: 'var(--sl-color-orange-5)',
    barTrack: 'var(--sl-color-orange-3)',
    barFill: 'var(--sl-color-orange-8)',
  },
  critical: {
    background: 'var(--sl-bg-critical)',
    border: 'var(--sl-color-red-6)',
    barTrack: 'var(--sl-color-blue-3)',
    barFill: 'var(--sl-fg-critical)',
  },
};

export function getUsageTier(count: number): UsageTier {
  if (count >= TRIAL_CONVERSATIONS_LIMIT) return 'critical';
  if (count > TIER_THRESHOLDS.warning) return 'danger';
  if (count > TIER_THRESHOLDS.informational) return 'warning';
  return 'informational';
}

export function getTierStyles(tier: UsageTier): TierStyles {
  return TIER_STYLES[tier];
}

export function getUsagePercentage(count: number): number {
  return Math.min((count / TRIAL_CONVERSATIONS_LIMIT) * 100, 100);
}

export interface TimeSaved {
  value: number;
  unit: 'minutes' | 'hours';
}

export function getTimeSaved(count: number): TimeSaved {
  const totalMinutes = count * MINUTES_SAVED_PER_CONVERSATION;

  if (totalMinutes < 60) {
    return { value: totalMinutes, unit: 'minutes' };
  }

  const hours = totalMinutes / 60;
  const roundedHours = hours % 1 === 0 ? hours : parseFloat(hours.toFixed(1));

  return { value: roundedHours, unit: 'hours' };
}
