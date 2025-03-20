
export interface AgentsSettingsUpdateResponse {
  message: string;
  error: string;
};

export function adapterAgentsSettingsUpdate(response: AgentsSettingsUpdateResponse) {
  return response;
}