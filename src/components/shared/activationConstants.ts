export type ActivationMode = 'safe' | 'full';

export const DISPLAY_RATIO: Record<ActivationMode, number> = {
  safe: 10,
  full: 100,
};
