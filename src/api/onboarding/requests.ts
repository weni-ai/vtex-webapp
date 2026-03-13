import getEnv from "../../utils/env";
import { proxy } from "../proxy";
import { OnboardStatus } from "../../interfaces/Store";
import type { CrawlingChannel } from "../../constants/onboarding";

export interface WebchatConfigResponse {
  displayRatio: number;
  title: string;
  subtitle: string;
  inputTextFieldHint?: string;
  renderPercentage?: number;
  profileAvatar: string;
}

export const fetchOnboardingStatus = async (vtex_account: string) => {
  const response = await proxy<OnboardStatus>(
    'GET',
    `${getEnv('VITE_APP_COMMERCE_URL')}/api/onboard/${vtex_account}/status/`,
    {}
  );

  return response;
}

export const ensureProjectAndUser = async (vtex_account: string, user_email: string) => {
  const response = await proxy<{ project_uuid: string; user_uuid: string }>(
    'POST',
    `${getEnv('VITE_APP_COMMERCE_URL')}/vtex/account/${vtex_account}/project-user/`,
    {
      data: { user_email },
    }
  );

  return response;
}

export const startCrawling = async (vtex_account: string, url: string, channel: CrawlingChannel) => {
  const response = await proxy<{ status: string }>(
    'POST',
    `${getEnv('VITE_APP_COMMERCE_URL')}/api/onboard/${vtex_account}/start-crawling/`,
    {
      data: { 
        crawl_url: `https://${url}`,
        channel,
      },
    }
  );

  return response;
}

export const updateOnboarding = async (
  vtex_account: string,
  data: { current_page?: string; completed?: boolean; skipped?: boolean },
) => {
  const response = await proxy<OnboardStatus>(
    'PATCH',
    `${getEnv('VITE_APP_COMMERCE_URL')}/api/onboard/${vtex_account}/`,
    {
      data,
    }
  );

  return response;
}

export const updateWebchatDisplayRatio = async (
  webchatAppUuid: string,
  newConfig: object,
) => {
  const response = await proxy<{ uuid: string }>(
    'PATCH',
    `${getEnv('VITE_APP_INTEGRATIONS_URL')}/api/v1/apptypes/wwc/apps/${webchatAppUuid}/configure/`,
    {
      data: { config: newConfig },
    }
  );

  return response;
}

export const activatePixelApp = async (channel: CrawlingChannel, appUuid: string, accountId: string) => {
  const response = await proxy<{ uuid: string }>(
    'POST',
    `${getEnv('VITE_APP_COMMERCE_URL')}/api/onboard/${channel}/activate/`,
    {
      data: {
        app_uuid: appUuid,
        account_id: accountId,
      },
    }
  );

  return response;
}

export const getWebchatConfig = async (webchatAppUuid: string) => {
  const response = await proxy<{
    config: WebchatConfigResponse;
    flow_object_uuid: string;
  }>(
    'GET',
    `${getEnv('VITE_APP_INTEGRATIONS_URL')}/api/v1/apptypes/wwc/apps/${webchatAppUuid}/`,
    {}
  );

  return response;
}