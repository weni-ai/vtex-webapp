import getEnv from "../../utils/env";
import store from "../../store/provider.store";
import { proxy } from "../proxy";

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
