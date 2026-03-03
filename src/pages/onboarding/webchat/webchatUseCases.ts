import IconLocalMall from '../../../assets/icons/local_mall.svg';
import IconCancellation from '../../../assets/icons/cancellation.svg';
import IconOrderStatus from '../../../assets/icons/order_status.svg';
import IconFaqAssistant from '../../../assets/icons/faq_assistant.svg';

export const WEBCHAT_USE_CASES = [
  { id: 'catalog_concierge', titleKey: 'onboarding.onboard_setup.use_cases.catalog_concierge.title', icon: IconLocalMall },
  { id: 'cancellations', titleKey: 'onboarding.onboard_setup.use_cases.cancellations.title', icon: IconCancellation },
  { id: 'order_status', titleKey: 'onboarding.onboard_setup.use_cases.order_status.title', icon: IconOrderStatus },
  { id: 'faq_assistant', titleKey: 'onboarding.onboard_setup.use_cases.faq_assistant.title', icon: IconFaqAssistant },
] as const;

export type UseCaseId = typeof WEBCHAT_USE_CASES[number]['id'];
