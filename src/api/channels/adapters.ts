import { checkWebChatIntegration, checkWhatsAppIntegration, getWhatsAppConfig, getWhatsAppProfile } from "./requests";

export interface WhatsAppIntegrationResponse {
    success: boolean;
    error?: string;
    data?: {
        has_whatsapp: boolean;
        wpp_cloud_app_uuid: string;
        flows_channel_uuid: string;
        phone_number: string;
    };
}

export interface WhatsAppConfigResult {
    success: boolean;
    error?: string;
    data?: {
        displayName: string;
        displayPhoneNumber: string;
    };
}

export interface WhatsAppProfileResult {
    success: boolean;
    error?: string;
    data?: {
        photoUrl: string;
    };
}

export interface WhatsAppAdapter {
    checkIntegration(projectUUID: string): Promise<WhatsAppIntegrationResponse>;
    getWhatsAppConfig(wppCloudAppUuid: string, projectUUID: string): Promise<WhatsAppConfigResult>;
    getWhatsAppProfile(wppCloudAppUuid: string): Promise<WhatsAppProfileResult>;
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

    async getWhatsAppConfig(wppCloudAppUuid: string, projectUUID: string): Promise<WhatsAppConfigResult> {
        try {
            const response = await getWhatsAppConfig(wppCloudAppUuid, projectUUID);

            const phoneNumber = response.config.phone_number;
            return {
                success: true,
                data: {
                    displayName: phoneNumber.display_name,
                    displayPhoneNumber: phoneNumber.display_phone_number,
                },
            };
        } catch (error: unknown) {
            console.error('error getting WhatsApp config:', error);
            return { success: false, error: error instanceof Error ? error.message : 'unknown error' };
        }
    }

    async getWhatsAppProfile(wppCloudAppUuid: string): Promise<WhatsAppProfileResult> {
        try {
            const response = await getWhatsAppProfile(wppCloudAppUuid);

            return {
                success: true,
                data: {
                    photoUrl: response.photo_url,
                },
            };
        } catch (error: unknown) {
            console.error('error getting WhatsApp profile:', error);
            return { success: false, error: error instanceof Error ? error.message : 'unknown error' };
        }
    }
}

export interface WebChatIntegrationResponse {
    success: boolean;
    error?: string;
    data?: {
        has_webchat: boolean;
        webchat_app_uuid: string;
        flows_channel_uuid: string;
    };
}

export interface WebChatAdapter {
    checkIntegration(projectUUID: string): Promise<WebChatIntegrationResponse>;
}

export class VTEXWebChatAdapter implements WebChatAdapter {
    async checkIntegration(projectUUID: string): Promise<WebChatIntegrationResponse> {
        try {
            const response = await checkWebChatIntegration(projectUUID);

            if (!response) {
                throw new Error('error verifying WebChat integration');
            }

            return { success: true, data: response };
        } catch (error: unknown) {
            console.error('error verifying WebChat integration:', error);
            return { success: false, error: error instanceof Error ? error.message : 'unknown error' };
        }
    }
}