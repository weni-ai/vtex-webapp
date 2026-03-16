import { SupervisorConversation, Resolution } from "../../interfaces/Supervisor";

const RESOLUTION_MAP: Record<string, Resolution> = {
  '0': 'ai_assisted',
  '1': 'other_conclusion',
  '2': 'in_progress',
  '3': 'unclassified',
  '4': 'transferred_to_human_support',
};

interface SupervisorApiResult {
  uuid: string;
  name: string | null;
  urn: string;
  created_on: string;
  start_date: string;
  end_date: string;
  resolution: string;
  csat: string | null;
  nps: string | null;
  topic: string | null;
  external_id: string | null;
  has_chats_room: boolean;
}

export interface SupervisorApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SupervisorApiResult[];
}

function parseResolution(value: string): Resolution {
  return RESOLUTION_MAP[value] ?? 'unclassified';
}

function parseCsat(value: string | null): number | null {
  if (value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function adaptSupervisorResponse(response: SupervisorApiResponse): SupervisorConversation[] {
  if (!response?.results) return [];

  return response.results.map((item) => ({
    uuid: item.uuid,
    name: item.name || null,
    urn: item.urn,
    createdOn: item.created_on,
    resolution: parseResolution(item.resolution),
    csat: parseCsat(item.csat),
  }));
}
