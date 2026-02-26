import { OnboardStatus } from "../../interfaces/Store";
import { 
  ensureProjectAndUser, 
  fetchOnboardingStatus, 
  startCrawling, 
  updateOnboarding, 
  updateWebchatDisplayRatio, 
  activatePixelApp 
} from "./requests";

export interface OnboardStatusResponse {
  success: boolean;
  error?: string;
  data?: OnboardStatus;
}

export interface EnsureProjectAndUserResponse {
  success: boolean;
  error?: string;
  data?: { project_uuid: string; user_uuid: string };
}

export interface StartCrawlingResponse {
  success: boolean;
  error?: string;
  data?: { status: string };
}

export interface UpdateOnboardingResponse {
  success: boolean;
  error?: string;
  data?: OnboardStatus;
}

export interface UpdateDisplayRatioResponse {
  success: boolean;
  error?: string;
  data?: { uuid: string };
}

export interface ActivateInStoreResponse {
  success: boolean;
  error?: string;
}

export interface OnboardAdapter {
  getOnboardingStatus(vtex_account: string): Promise<OnboardStatusResponse>;
  ensureProjectAndUser(vtex_account: string, user_email: string): Promise<EnsureProjectAndUserResponse>;
  startCrawling(vtex_account: string, url: string): Promise<StartCrawlingResponse>;
  updateOnboarding(vtex_account: string, data: { current_page?: string; completed?: boolean }): Promise<UpdateOnboardingResponse>;
  updateDisplayRatio(webchatAppUuid: string, displayRatio: number): Promise<UpdateDisplayRatioResponse>;
  activateInStore(vtex_account: string): Promise<ActivateInStoreResponse>;
}

export class VTEXOnboardAdapter implements OnboardAdapter {
  async getOnboardingStatus(vtex_account: string): Promise<OnboardStatusResponse> {
    try {
      const response = await fetchOnboardingStatus(vtex_account);
      if (!response) {
        throw new Error('error fetching onboarding status.');
      }
      return { success: true, data: response };
    } catch (error) {
      console.error('error fetching onboarding status:', error);
      return { success: false, error: error instanceof Error ? error.message : 'unknown error' };
    }
  }

  async ensureProjectAndUser(vtex_account: string, user_email: string): Promise<EnsureProjectAndUserResponse> {
    try {
      const response = await ensureProjectAndUser(vtex_account, user_email);
      if (!response) {
        throw new Error('error ensuring project and user.');
      }
      return { success: true, data: { project_uuid: response.project_uuid, user_uuid: response.user_uuid } };
    } catch (error) {
      console.error('error ensuring project and user:', error);
      return { success: false, error: error instanceof Error ? error.message : 'unknown error' };
    }
  }

  async startCrawling(vtex_account: string, url: string): Promise<StartCrawlingResponse> {
    try {
      const response = await startCrawling(vtex_account, url);
      if (!response) {
        throw new Error('error starting crawling.');
      }
      return { success: true, data: { status: response.status } };
    } catch (error) {
      console.error('error starting crawling:', error);
      return { success: false, error: error instanceof Error ? error.message : 'unknown error' };
    }
  }

  async updateOnboarding(
    vtex_account: string,
    data: { current_page?: string; completed?: boolean },
  ): Promise<UpdateOnboardingResponse> {
    try {
      const response = await updateOnboarding(vtex_account, data);
      if (!response) {
        throw new Error('error updating onboarding.');
      }
      return { success: true, data: response };
    } catch (error) {
      console.error('error updating onboarding:', error);
      return { success: false, error: error instanceof Error ? error.message : 'unknown error' };
    }
  }

  async updateDisplayRatio(
    webchatAppUuid: string,
    displayRatio: number,
  ): Promise<UpdateDisplayRatioResponse> {
    try {
      const response = await updateWebchatDisplayRatio(webchatAppUuid, displayRatio);
      if (!response) {
        throw new Error('error updating display ratio.');
      }
      return { success: true, data: response };
    } catch (error) {
      console.error('error updating display ratio:', error);
      return { success: false, error: error instanceof Error ? error.message : 'unknown error' };
    }
  }

  async activateInStore(vtex_account: string): Promise<ActivateInStoreResponse> {
    try {
      await activatePixelApp(vtex_account);
      return { success: true };
    } catch (error) {
      console.error('error activating in store:', error);
      return { success: false, error: error instanceof Error ? error.message : 'unknown error' };
    }
  }
}