import { OnboardStatus } from "../../interfaces/Store";
import { 
  ensureProjectAndUser, 
  fetchOnboardingStatus, 
  startOnboardingSetup,
  updateOnboarding, 
  updateWebchatDisplayRatio, 
  activatePixelApp,
  getWebchatConfig,
} from "./requests";
import type { WebchatConfigResponse, WhatsAppChannelData } from "./requests";
import type { SetupChannel } from "../../constants/onboarding";

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

export interface StartOnboardingSetupResponse {
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

export interface GetWebchatConfigResponse {
  success: boolean;
  error?: string;
  data?: {
    config: WebchatConfigResponse;
    flow_object_uuid: string;
  };
}

export interface OnboardAdapter {
  getOnboardingStatus(vtex_account: string): Promise<OnboardStatusResponse>;
  ensureProjectAndUser(vtex_account: string, user_email: string): Promise<EnsureProjectAndUserResponse>;
  startOnboardingSetup(vtex_account: string, url: string, channel: SetupChannel, channelData?: WhatsAppChannelData): Promise<StartOnboardingSetupResponse>;
  updateOnboarding(vtex_account: string, data: { current_page?: string; completed?: boolean; skipped?: boolean }): Promise<UpdateOnboardingResponse>;
  updateDisplayRatio(webchatAppUuid: string, newConfig: object): Promise<UpdateDisplayRatioResponse>;
  activateInStore(channel: SetupChannel, appUuid: string, accountId: string): Promise<ActivateInStoreResponse>;
  getWebchatConfig(webchatAppUuid: string): Promise<GetWebchatConfigResponse>;
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

  async startOnboardingSetup(vtex_account: string, url: string, channel: SetupChannel, channelData?: WhatsAppChannelData): Promise<StartOnboardingSetupResponse> {
    try {
      const response = await startOnboardingSetup(vtex_account, url, channel, channelData);
      if (!response) {
        throw new Error('error starting onboarding setup.');
      }
      return { success: true, data: { status: response.status } };
    } catch (error) {
      console.error('error starting onboarding setup:', error);
      return { success: false, error: error instanceof Error ? error.message : 'unknown error' };
    }
  }

  async updateOnboarding(
    vtex_account: string,
    data: { current_page?: string; completed?: boolean; skipped?: boolean },
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
    newConfig: object,
  ): Promise<UpdateDisplayRatioResponse> {
    try {
      const response = await updateWebchatDisplayRatio(webchatAppUuid, newConfig);
      if (!response) {
        throw new Error('error updating display ratio.');
      }
      return { success: true, data: response };
    } catch (error) {
      console.error('error updating display ratio:', error);
      return { success: false, error: error instanceof Error ? error.message : 'unknown error' };
    }
  }

  async activateInStore(channel: SetupChannel, appUuid: string, accountId: string): Promise<ActivateInStoreResponse> {
    try {
      await activatePixelApp(channel, appUuid, accountId);
      return { success: true };
    } catch (error) {
      console.error('error activating in store:', error);
      return { success: false, error: error instanceof Error ? error.message : 'unknown error' };
    }
  }

  async getWebchatConfig(webchatAppUuid: string): Promise<GetWebchatConfigResponse> {
    try {
      const response = await getWebchatConfig(webchatAppUuid);
      if (!response) {
        throw new Error('error getting webchat config.');
      }
      return { success: true, data: response };
    } catch (error) {
      console.error('error getting webchat config:', error);
      return { success: false, error: error instanceof Error ? error.message : 'unknown error' };
    }
  }
}