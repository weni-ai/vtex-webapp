import IconLocalMall from '../../assets/icons/local_mall.svg';
import IconCancellation from '../../assets/icons/cancellation.svg';
import IconOrderStatus from '../../assets/icons/order_status.svg';
import IconFaqAssistant from '../../assets/icons/faq_assistant.svg';

const AGENT_ICON_MAP: Record<string, string> = {
  catalog_concierge: IconLocalMall,
  cancellations: IconCancellation,
  order_status: IconOrderStatus,
  faq_assistant: IconFaqAssistant,
};

export function getAgentIcon(code: string): string {
  return AGENT_ICON_MAP[code] ?? IconOrderStatus;
}
