import { SettingsFormData } from "../../components/settings/SettingsContainer/SettingsContext";
import { VTEXFetch } from "../../utils/VTEXFetch";
import { adapterAgentsSettingsUpdate, AgentsSettingsUpdateResponse } from "./adapters";
import { Feature } from "../../interfaces/Store";
import store from "../../store/provider.store";

export async function agentsSettingsUpdate({ agentUuid, code, formData }: { agentUuid: string, code: Feature['code'], formData: SettingsFormData }) {
  const projectUuid = store.getState().project.project_uuid;
  
  const url = '/_v/update-feature-settings';

  const messageTimeRestriction = formData?.messageTimeRestriction;
  const restriction = formData?.restriction;

  const integrationSettings =
    code === "abandoned_cart"
      ? {
          message_time_restriction: {
            is_active: messageTimeRestriction?.isActive || false,
            periods: {
              weekdays: {
                from: messageTimeRestriction?.periods?.weekdays?.from || "",
                to: messageTimeRestriction?.periods?.weekdays?.to || "",
              },
              saturdays: {
                from: messageTimeRestriction?.periods?.saturdays?.from || "",
                to: messageTimeRestriction?.periods?.saturdays?.to || "",
              },
            },
          },
          restriction: {},
        }
      : {
        restriction: {},
      }

  integrationSettings.restriction = {
    is_active: restriction?.is_active || false,
    phone_numbers: restriction?.phone_numbers || "",
    sellers: restriction?.sellers || [],
  }

  const response = await VTEXFetch<AgentsSettingsUpdateResponse>(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      feature_uuid: agentUuid,
      project_uuid: projectUuid,
      integration_settings: integrationSettings,
    }),
  });

  return adapterAgentsSettingsUpdate(response);
}
