import { SettingsFormData } from "../../components/settings/SettingsContainer/SettingsContext";
import { VTEXFetch } from "../../utils/VTEXFetch";
import { adapterAgentsSettingsUpdate, AgentsSettingsUpdateResponse } from "./adapters";
import store from "../../store/provider.store";

export async function agentsSettingsUpdate({ agentUuid, code, formData }: { agentUuid: string, code: AgentCommerce['code'], formData: SettingsFormData }) {
  const projectUuid = store.getState().project.project_uuid;
  const userEmail = store.getState().user.userData?.user;

  const url = `/_v/update-feature-settings?user_email=${userEmail}`;

  const messageTimeRestriction = formData?.messageTimeRestriction;
  const orderStatusRestriction = formData?.order_status_restriction;

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
      }
      : {
        order_status_restriction: {
          is_active: orderStatusRestriction?.is_active || false,
          phone_numbers: orderStatusRestriction?.phone_numbers || "",
          sellers: orderStatusRestriction?.sellers || [],
        },
      }

  const response = await VTEXFetch<AgentsSettingsUpdateResponse>(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Project-Uuid': projectUuid,
    },
    body: JSON.stringify({
      feature_uuid: agentUuid,
      project_uuid: projectUuid,
      integration_settings: integrationSettings,
    }),
  });

  return adapterAgentsSettingsUpdate(response);
}
