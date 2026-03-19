import getEnv from "../../utils/env";
import store from "../../store/provider.store";
import { proxy } from "../proxy";

/** GET pre-verified phone number IDs from integrations (calls Meta). Auth via proxy. No params or body. */
export const getPreVerifiedPhoneIds = async () => {
  const baseUrl = getEnv('VITE_APP_INTEGRATIONS_URL');
  if (!baseUrl) {
    return { data: [] };
  }

  const response = await proxy<{
    error?: string;
    message?: string;
    data: string[];
  }>(
    'GET',
    `${baseUrl}/api/v1/commerce/preverified-phone-number`,
    {
      headers: {},
      params: {},
    },
  );

  return response;
};

interface WhatsAppConfigResponse {
  code: string;
  uuid: string;
  created_by: string;
  created_on: string;
  modified_by: string;
  config: {
    title: string;
    waba: {
      id: string;
      name: string;
      timezone: string;
      namespace: string;
    };
    phone_number: {
      display_name: string;
      display_phone_number: string;
    },
    wa_business_id: string;
    mmlite_status: string;
    has_calling: string;
  };
}

export const checkWhatsAppIntegration = async (projectUUID: string) => {
  const userEmail = store.getState().user.userData?.user;

  const response = await proxy<{
    error?: string,
    message?: string,
    data: {
      has_whatsapp: boolean,
      wpp_cloud_app_uuid: string,
      flows_channel_uuid: string,
      phone_number: string,
    },
  }>(
    'GET',
    `${getEnv('VITE_APP_INTEGRATIONS_URL')}/api/v1/commerce/check-whatsapp-integration`,
    {
      headers: { 'Project-Uuid': projectUUID, },
      params: {
        user_email: userEmail || '',
        project_uuid: projectUUID,
      },
    },
  );

  return response;
};


export const checkWebChatIntegration = async (projectUUID: string) => {
  const userEmail = store.getState().user.userData?.user;

  const response = await proxy<{
    has_webchat: boolean,
    webchat_app_uuid: string,
    flows_channel_uuid: string,
  }>(
    'GET',
    `${getEnv('VITE_APP_INTEGRATIONS_URL')}/api/v1/gallery/check-webchat-integration`,
    {
      headers: { 'Project-Uuid': projectUUID, },
      params: {
        user_email: userEmail || '',
        project_uuid: projectUUID,
      },
    },
  );

  return response;
};

export const getWhatsAppConfig = async (wppCloudAppUuid: string, projectUUID: string) => {
  const response = await proxy<WhatsAppConfigResponse>(
    'GET',
    `${getEnv('VITE_APP_INTEGRATIONS_URL')}/api/v1/apptypes/wpp-cloud/apps/${wppCloudAppUuid}/`,
    {
      headers: { 'Project-Uuid': projectUUID, },
    }
  );

  return response;
}