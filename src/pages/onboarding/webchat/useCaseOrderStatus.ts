import { getTextByUseCase } from "./previewUseCases";

function getText(key: string) {
  return getTextByUseCase('order_status', key);
}

export const useCaseOrderStatusSteps = () => [{
  type: 'streaming-received',
  data: getText('agent_greeting_order'),
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'sent',
  data: getText('user_asks_order_status'),
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'streaming-received',
  data: getText('agent_confirms_carrier'),
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'streaming-received',
  data: getText('agent_provides_tracking_and_deadline'),
}];
