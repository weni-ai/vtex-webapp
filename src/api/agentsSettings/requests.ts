import { SettingsFormData } from "../../components/settings/SettingsContainer/SettingsContext";
import { useSelector } from "react-redux";
import { selectProject } from "../../store/projectSlice";
import { VTEXFetch } from "../../utils/VTEXFetch";
import { adapterAgentsSettingsUpdate, AgentsSettingsUpdateResponse } from "./adapters";
import { Feature } from "../../interfaces/Store";

export async function agentsSettingsUpdate({ agentUuid, code, formData }: { agentUuid: string, code: Feature['code'], formData: SettingsFormData }) {
  const projectUuid = useSelector(selectProject);

  const url = '/_v/update-feature-settings';

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
            phone_number: orderStatusRestriction?.phone_number || "",
            sellers: orderStatusRestriction?.sellers || [],
          },
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
