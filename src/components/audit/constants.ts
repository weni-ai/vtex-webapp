export type { Resolution, CsatScore, SupervisorConversation } from '../../interfaces/Supervisor';

import type { Resolution, CsatScore } from '../../interfaces/Supervisor';

type TagColor = 'green' | 'red' | 'blue' | 'gray';

interface ResolutionConfig {
  labelKey: string;
  color: TagColor;
}

export const RESOLUTION_CONFIG: Record<Resolution, ResolutionConfig> = {
  ai_assisted: { labelKey: 'audit.resolution.ai_assisted', color: 'green' },
  other_conclusion: { labelKey: 'audit.resolution.other_conclusion', color: 'red' },
  in_progress: { labelKey: 'audit.resolution.in_progress', color: 'blue' },
  unclassified: { labelKey: 'audit.resolution.unclassified', color: 'gray' },
  transferred_to_human_support: { labelKey: 'audit.resolution.transferred', color: 'gray' },
};

interface CsatConfig {
  emoji: string;
  labelKey: string;
}

export const CSAT_CONFIG: Record<CsatScore, CsatConfig> = {
  1: { emoji: '😡', labelKey: 'audit.csat.very_unsatisfied' },
  2: { emoji: '😔', labelKey: 'audit.csat.unsatisfied' },
  3: { emoji: '😐', labelKey: 'audit.csat.neutral' },
  4: { emoji: '😃', labelKey: 'audit.csat.satisfied' },
  5: { emoji: '🤩', labelKey: 'audit.csat.very_satisfied' },
};

export function isValidCsatScore(value: number): value is CsatScore {
  return value >= 1 && value <= 5 && Number.isInteger(value);
}

export const TABLE_COLUMN_WIDTHS = ['1fr', '1fr', '1fr', '120px', '120px'];
