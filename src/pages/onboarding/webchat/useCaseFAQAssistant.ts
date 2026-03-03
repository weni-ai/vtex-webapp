import { cursor, getTextByUseCase } from './previewUseCases';

function getText(key: string) {
  return getTextByUseCase('faq_assistant', key);
}

export const useCaseFAQAssistantSteps = () => [{
  type: 'streaming-received',
  data: getText('agent_greeting_specs'),
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'sent',
  data: getText('user_asks_monitor_hdmi_specs'),
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'streaming-received',
  data: getText('agent_explains_limitation_suggests_cable'),
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'received',
  data: {
    text: getText('agent_checks_box_contents'),
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
              image: 'https://cdn.cloud.weni.ai/VTEXApp/webchat-preview/cabo-usb-c-p-display-port.png',
              name: getText('products.usb_c_to_displayport_cable.name'),
              price: '59.90',
              currency: 'BRL',
              description: getText('products.usb_c_to_displayport_cable.description'),
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
  data: getText('user_confirms_purchase'),
}];
