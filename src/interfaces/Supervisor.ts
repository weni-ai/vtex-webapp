export type Resolution =
  | 'ai_assisted'
  | 'other_conclusion'
  | 'in_progress'
  | 'unclassified'
  | 'transferred_to_human_support';

export type CsatScore = 1 | 2 | 3 | 4 | 5;

export interface SupervisorConversation {
  uuid: string;
  name: string | null;
  urn: string;
  createdOn: string;
  resolution: Resolution;
  csat: number | null;
}
