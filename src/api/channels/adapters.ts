import { checkWhatsAppIntegration } from "./requests";

export interface WhatsAppIntegrationResponse {
    success: boolean;
    error?: string;
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

            return { success: true };
        } catch (error: unknown) {
            console.error('error verifying WhatsApp integration:', error);
            return { success: false, error: error instanceof Error ? error.message : 'unknown error' };
        }
    }
}
