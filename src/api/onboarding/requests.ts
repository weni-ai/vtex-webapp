import getEnv from "../../utils/env";
import { proxy } from "../proxy";
import { OnboardStatus } from "../../interfaces/Store";

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

export const startCrawling = async (vtex_account: string, url: string) => {
  const response = await proxy<{ status: string }>(
    'POST',
    `${getEnv('VITE_APP_COMMERCE_URL')}/api/onboard/${vtex_account}/start-crawling/`,
    {
      data: { 
        crawl_url: `https://${url}`,
      },
    }
  );

  return response;
}

export const updateOnboarding = async (
  vtex_account: string,
  data: { current_page?: string; completed?: boolean },
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
  displayRatio: number,
) => {
  const response = await proxy<{ uuid: string }>(
    'PATCH',
    `${getEnv('VITE_APP_INTEGRATIONS_URL')}/api/v1/apptypes/wwc/apps/${webchatAppUuid}/configure/`,
    {
      data: { config: { displayRatio } },
    }
  );

  return response;
}

export const activatePixelApp = async (vtex_account: string) => {
  // TODO: Replace with actual Endpoint 12 URL when backend provides it.
  const response = await proxy<{ uuid: string }>(
    'POST',
    `${getEnv('VITE_APP_COMMERCE_URL')}/api/onboard/${vtex_account}/activate/`,
    {}
  );

  return response;
}