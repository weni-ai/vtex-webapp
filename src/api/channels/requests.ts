import { VTEXFetch } from "../../utils/VTEXFetch";

export const checkWhatsAppIntegration = async (projectUUID: string) => {
  return VTEXFetch(`/_v/check-whatsapp-integration?projectUUID=${projectUUID}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}; 