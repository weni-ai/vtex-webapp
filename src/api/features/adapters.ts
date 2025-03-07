import { integrateFeatureRequest } from "./requests";

export interface IntegrateFeatureInput {
    featureId: string;
    projectId: string;
    storeName: string;
    flowsChannelId: string;
    whatsappAppId: string;
}

interface IntegrateFeatureOutput {
    success: boolean;
    message: string;
}

export class FeaturesAdapter {
    static async integrateFeature(input: IntegrateFeatureInput): Promise<IntegrateFeatureOutput> {
        try {
            const adaptedData = {
                feature_uuid: input.featureId,
                project_uuid: input.projectId,
                store: input.storeName,
                flows_channel_uuid: input.flowsChannelId,
                wpp_cloud_app_uuid: input.whatsappAppId,
            };

            const response = await integrateFeatureRequest(adaptedData);

            return {
                success: !response.error,
                message: response.message,
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Feature integration failed: ${error.message}`);
            }
            throw new Error('Feature integration failed: Unknown error');
        }
    }
}

export interface UpdateAgentSettingsData {
    feature_uuid: string;
    project_uuid: string;
    integration_settings: {
        message_time_restriction?: {
            is_active: boolean;
            periods: {
                weekdays: { from: string; to: string };
                saturdays: { from: string; to: string };
            };
        };
        order_status_restriction?: {
            is_active: boolean;
            phone_numbers: string[];
            sellers: string[];
        };
    };
}

export interface UpdateAgentSettingsResponse {
    message: string;
    error: string;
}

export function adaptUpdateAgentSettingsRequest(data: UpdateAgentSettingsData) {
    return {
        feature_uuid: data.feature_uuid,
        project_uuid: data.project_uuid,
        integration_settings: data.integration_settings,
    };
}

export function adaptUpdateAgentSettingsResponse(response: UpdateAgentSettingsResponse) {
    return {
        message: response.message,
        error: response.error,
    };
}

export interface DisableFeatureData {
    project_uuid: string;
    feature_uuid: string;
} 