import { cursor, getTextByUseCase } from './previewUseCases';

function getText(key: string) {
  return getTextByUseCase('cancellations', key);
}

export const useCaseCancellationsSteps = () => [{
  type: 'streaming-received',
  data: getText('agent_greeting'),
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'sent',
  data: getText('user_requests_cancellation_wrong_voltage'),
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'streaming-received',
  data: getText('agent_asks_order_number'),
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'sent',
  data: getText('user_provides_order_number'),
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'streaming-received',
  data: getText('agent_check_stock'),
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'received',
  data: {
    text: getText('agent_offers_alternative_model'),
    interactive: {
      type: 'product_list',
      header: { text: 'Our Catalog' },
      footer: { text: 'Tap to view details' },
      action: {
        name: 'See Products',
        sections: [
          {
            title: 'Best Sellers',
            product_items: [{
              product_retailer_id: 'best-1',
              image: 'https://cdn.cloud.weni.ai/VTEXApp/webchat-preview/geladeira-inverse-frost-free-inverter-460-aco-escovado.png',
              name: getText('products.fridge_420l_inox.name'),
              price: '3999.90',
              currency: 'BRL',
              description: getText('products.fridge_420l_inox.description'),
              seller_id: 'seller-1',
            }],
          },
        ],
      },
    },
  },
}, {
  type: 'animate',
  function: async () => {
    cursor.create(document.querySelector('.weni-messages-list'));

    await new Promise(resolve => setTimeout(resolve, 800));

    await cursor.moveAndClick(document.querySelector('.weni-messages-list__direction-group:last-of-type .weni-button:last-of-type'));

    await new Promise(resolve => setTimeout(resolve, 1000));

    await cursor.moveAndClick(document.querySelector('.weni-view-product-catalog .weni-inline-product'));

    await new Promise(resolve => setTimeout(resolve, 1000));

    await cursor.moveAndClick(document.querySelector('.weni-chat-header button[aria-label="Back"]'));

    await new Promise(resolve => setTimeout(resolve, 1000));

    await cursor.click(document.querySelector('.weni-chat-header button[aria-label="Back"]'));

    await new Promise(resolve => setTimeout(resolve, 1000));

    await cursor.remove();
  },
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'sent',
  data: getText('user_declines_alternative_confirms_cancellation'),
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'streaming-received',
  data: getText('agent_confirms_cancellation_process'),
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'streaming-received',
  data: getText('agent_confirms_cancellation_process_confirmation'),
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'sent',
  data: getText('user_confirms_cancellation_process_confirmation'),
}];
