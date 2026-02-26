import {
  ActivateInStoreResponse,
  EnsureProjectAndUserResponse,
  OnboardStatusResponse,
  StartCrawlingResponse,
  UpdateDisplayRatioResponse,
  UpdateOnboardingResponse,
  VTEXOnboardAdapter,
} from "../api/onboarding/adapters";

const onboardingAdapter = new VTEXOnboardAdapter();

export async function getOnboardingStatus(vtex_account: string): Promise<OnboardStatusResponse> {
  return onboardingAdapter.getOnboardingStatus(vtex_account);
}

export async function ensureProjectAndUser(vtex_account: string, user_email: string): Promise<EnsureProjectAndUserResponse> {
  return onboardingAdapter.ensureProjectAndUser(vtex_account, user_email);
}

export async function startCrawling(vtex_account: string, url: string): Promise<StartCrawlingResponse> {
  return onboardingAdapter.startCrawling(vtex_account, url);
}

export async function updateOnboarding(
  vtex_account: string,
  data: { current_page?: string; completed?: boolean },
): Promise<UpdateOnboardingResponse> {
  return onboardingAdapter.updateOnboarding(vtex_account, data);
}

export async function updateDisplayRatio(
  webchatAppUuid: string,
  displayRatio: number,
): Promise<UpdateDisplayRatioResponse> {
  return onboardingAdapter.updateDisplayRatio(webchatAppUuid, displayRatio);
}

export async function activateInStore(
  vtex_account: string,
): Promise<ActivateInStoreResponse> {
  return onboardingAdapter.activateInStore(vtex_account);
}