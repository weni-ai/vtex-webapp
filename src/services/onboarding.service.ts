import {
  ActivateInStoreResponse,
  EnsureProjectAndUserResponse,
  OnboardStatusResponse,
  StartCrawlingResponse,
  UpdateDisplayRatioResponse,
  UpdateOnboardingResponse,
  VTEXOnboardAdapter,
} from "../api/onboarding/adapters";
import type { CrawlingChannel } from "../constants/onboarding";

const onboardingAdapter = new VTEXOnboardAdapter();

export async function getOnboardingStatus(vtex_account: string): Promise<OnboardStatusResponse> {
  return onboardingAdapter.getOnboardingStatus(vtex_account);
}

export async function ensureProjectAndUser(vtex_account: string, user_email: string): Promise<EnsureProjectAndUserResponse> {
  return onboardingAdapter.ensureProjectAndUser(vtex_account, user_email);
}

export async function startCrawling(vtex_account: string, url: string, channel: CrawlingChannel): Promise<StartCrawlingResponse> {
  return onboardingAdapter.startCrawling(vtex_account, url, channel);
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
  channel: CrawlingChannel,
  appUuid: string,
  accountId: string,
): Promise<ActivateInStoreResponse> {
  return onboardingAdapter.activateInStore(channel, appUuid, accountId);
}