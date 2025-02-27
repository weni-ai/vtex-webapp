import { SettingsFormData } from "../../components/settings/SettingsContainer/SettingsContext";
import { useSelector } from "react-redux";
import { selectProject } from "../../store/projectSlice";
import { VTEXFetch } from "../../utils/VTEXFetch";
import { adapterAgentsSettingsUpdate, AgentsSettingsUpdateResponse } from "./adapters";
import { Feature } from "../../interfaces/Store";

export async function agentsSettingsUpdate({ agentUuid, code, formData }: { agentUuid: string, code: Feature['code'], formData: SettingsFormData }) {
  const projectUuid = useSelector(selectProject);

  const url = '/_v/update-feature-settings';

  let body;

  if (code === 'abandoned_cart') {
    body = {
      "feature_uuid": agentUuid,
      "project_uuid": projectUuid,
      "integration_settings": {
        "message_time_restriction": {
          "is_active": formData?.messageTimeRestriction?.isActive || false,
          "periods": {
            "weekdays": {
              "from": formData?.messageTimeRestriction?.periods?.weekdays?.from || "",
              "to": formData?.messageTimeRestriction?.periods?.weekdays?.to || ""
            },
            "saturdays": {
              "from": formData?.messageTimeRestriction?.periods?.saturdays?.from || "",
              "to": formData?.messageTimeRestriction?.periods?.saturdays?.to || ""
            }
          }
        }
      }
    };
  } else if (code === 'order_status') {
    body = {
      "feature_uuid": agentUuid,
      "project_uuid": projectUuid,
      "integration_settings": {
        "order_status_restriction": {
          "is_active": formData?.order_status_restriction?.is_active || false,
          "phone_number": formData?.order_status_restriction?.phone_number || "",
          "sellers": formData?.order_status_restriction?.sellers || []
        }
      }
    };
  }

  const response = await VTEXFetch<AgentsSettingsUpdateResponse>(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return adapterAgentsSettingsUpdate(response);
}
