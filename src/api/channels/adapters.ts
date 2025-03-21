import { checkWhatsAppIntegration } from "./requests";

export interface WhatsAppIntegrationResponse {
    success: boolean;
    error?: string;
    data?: {
        has_whatsapp: boolean;
        wpp_cloud_app_uuid: string;
        flows_channel_uuid: string;
    };
}

export interface WhatsAppAdapter {
    checkIntegration(projectUUID: string): Promise<WhatsAppIntegrationResponse>;
}

export class VTEXWhatsAppAdapter implements WhatsAppAdapter {
    async checkIntegration(projectUUID: string): Promise<WhatsAppIntegrationResponse> {
        try {
            const response = await checkWhatsAppIntegration(projectUUID);

            if (!response || response?.error) {
                throw new Error(response?.error || '');
            }

            return { success: true, data: response.data };
        } catch (error: unknown) {
            console.error('error verifying WhatsApp integration:', error);
            return { success: false, error: error instanceof Error ? error.message : 'unknown error' };
        }
    }
}
