import { VTEXFetch } from "../../utils/VTEXFetch";

export const checkWhatsAppIntegration = async (projectUUID: string) => {
  return VTEXFetch<{ error?: string, message?: string, data: {
    has_whatsapp: boolean,
    wpp_cloud_app_uuid: string,
    flows_channel_uuid: string,
    phone_number: string,
  } }>(`/_v/check-whatsapp-integration?projectUUID=${projectUUID}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Project-Uuid': projectUUID,
    },
  });
}; 