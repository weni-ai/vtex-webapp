import {
  ActivateInStoreResponse,
  EnsureProjectAndUserResponse,
  OnboardStatusResponse,
  StartOnboardingSetupResponse,
  UpdateDisplayRatioResponse,
  UpdateOnboardingResponse,
  VTEXOnboardAdapter,
} from "../api/onboarding/adapters";
import type { SetupChannel } from "../constants/onboarding";
import type { WhatsAppChannelData } from "../api/onboarding/requests";

const onboardingAdapter = new VTEXOnboardAdapter();

export async function getOnboardingStatus(vtex_account: string): Promise<OnboardStatusResponse> {
  return onboardingAdapter.getOnboardingStatus(vtex_account);
}

export async function ensureProjectAndUser(vtex_account: string, user_email: string): Promise<EnsureProjectAndUserResponse> {
  return onboardingAdapter.ensureProjectAndUser(vtex_account, user_email);
}

export async function startOnboardingSetup(
  vtex_account: string,
  url: string,
  channel: SetupChannel,
  channelData?: WhatsAppChannelData,
): Promise<StartOnboardingSetupResponse> {
  return onboardingAdapter.startOnboardingSetup(vtex_account, url, channel, channelData);
}

export async function updateOnboarding(
  vtex_account: string,
  data: { current_page?: string; completed?: boolean; skipped?: boolean },
): Promise<UpdateOnboardingResponse> {
  return onboardingAdapter.updateOnboarding(vtex_account, data);
}

export async function updateDisplayRatio(
  webchatAppUuid: string,
  displayRatio: number,
): Promise<UpdateDisplayRatioResponse> {
  // integrations patch currently requires the complete config object
  // fetch current webchat config
  const currentConfig = await onboardingAdapter.getWebchatConfig(webchatAppUuid);
  if (!currentConfig.success) {
    throw new Error(currentConfig.error);
  }

  // add new display ratio to current config
  const newConfig = {
    ...currentConfig.data?.config,
    renderPercentage: displayRatio,
  };

  return onboardingAdapter.updateDisplayRatio(webchatAppUuid, newConfig);
}

export async function activateInStore(
  channel: SetupChannel,
  appUuid: string,
  accountId: string,
): Promise<ActivateInStoreResponse> {
  return onboardingAdapter.activateInStore(channel, appUuid, accountId);
}