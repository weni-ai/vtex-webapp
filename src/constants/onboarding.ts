import type { OnboardChannel } from '../interfaces/Store';

export const ONBOARD_CHANNEL = {
  WEBCHAT: 'webchat',
  WHATSAPP: 'whatsapp',
} as const satisfies Record<string, OnboardChannel>;

export type SetupChannel = 'wwc' | 'wpp-cloud';

export const SETUP_CHANNEL: Record<OnboardChannel, SetupChannel> = {
  [ONBOARD_CHANNEL.WEBCHAT]: 'wwc',
  [ONBOARD_CHANNEL.WHATSAPP]: 'wpp-cloud',
} as const;

export const ONBOARDING_PAGES = {
  ONBOARD_CHANNEL_SELECTION: 'ONBOARD_CHANNEL_SELECTION',
  ONBOARD_WEBCHAT_SETUP: 'ONBOARD_WEBCHAT_SETUP',
  ONBOARD_WEBCHAT_TEST: 'ONBOARD_WEBCHAT_TEST',
  ONBOARD_WHATSAPP_SETUP: 'ONBOARD_WHATSAPP_SETUP',
  ONBOARD_WHATSAPP_TEST: 'ONBOARD_WHATSAPP_TEST',
  ONBOARD_LEGACY: 'ONBOARD_LEGACY',
} as const;

export const SUPPORT_EMAIL = 'support.weni@vtex.com';

export const ONBOARDING_STEPS = {
  PROJECT_CONFIG: 'PROJECT_CONFIG',
  CRAWL: 'CRAWL',
  NEXUS_CONFIG: 'NEXUS_CONFIG',
} as const;