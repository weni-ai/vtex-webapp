import { cursor, getTextByUseCase } from './previewUseCases';

function getText(key: string) {
  return getTextByUseCase('catalog_concierge', key);
}

export const useCaseCatalogConciergeSteps = () => [{
  type: 'streaming-received',
  data: getText('agent_greeting_and_offer_help'),
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'sent',
  data: getText('user_request_gift_ideas'),
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'streaming-received',
  data: getText('agent_profiling_question'),
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'sent',
  data: getText('user_answers_profiling'),
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'received',
  data: {
    text: getText('agent_suggests_initial_items'),
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
              image: 'https://cdn.cloud.weni.ai/VTEXApp/webchat-preview/kit-aromaterapia-com-difusor.png',
              name: getText('products.aromatherapy_kit.name'),
              price: '119.90',
              currency: 'BRL',
              description: getText('products.aromatherapy_kit.description'),
              seller_id: 'seller-1',
            }, {
              product_retailer_id: 'best-1',
              image: 'https://cdn.cloud.weni.ai/VTEXApp/webchat-preview/conjunto-de-tacas-forever.png',
              name: getText('products.forever_classic_set.name'),
              price: '199.90',
              currency: 'BRL',
              description: getText('products.forever_classic_set.description'),
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

    await cursor.moveAndClick(document.querySelector('.weni-view-product-catalog .weni-inline-product:nth-of-type(2)'));

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
  data: getText('user_rejects_and_asks_alternative'),
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'received',
  data: {
    text: getText('agent_suggests_hybrid_items'),
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
              image: 'https://cdn.cloud.weni.ai/VTEXApp/webchat-preview/abridor-de-vinho-eletrico-com-design-ergonomico.png',
              name: getText('products.wine_opener.name'),
              price: '99.90',
              currency: 'BRL',
              description: getText('products.wine_opener.description'),
              seller_id: 'seller-1',
            }, {
              product_retailer_id: 'best-1',
              image: 'https://cdn.cloud.weni.ai/VTEXApp/webchat-preview/manta-de-algodao-egipcio-para-meditacao.png',
              name: getText('products.meditation_blanket.name'),
              price: '259.90',
              currency: 'BRL',
              description: getText('products.meditation_blanket.description'),
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

    await cursor.moveAndClick(document.querySelector('.weni-view-product-catalog .weni-inline-product:nth-of-type(2)'));

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
  data: getText('user_shows_interest_asks_details'),
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'streaming-received',
  data: getText('agent_provides_product_details'),
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'sent',
  data: getText('user_confirms_choice'),
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'streaming-received',
  data: getText('agent_provides_checkout_link'),
}];
