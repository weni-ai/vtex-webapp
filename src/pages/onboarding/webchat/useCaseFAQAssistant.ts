import { cursor } from './previewUseCases';

export const useCaseFAQAssistantSteps = [{
  type: 'streaming-received',
  data: 'Olá! Sou o especialista técnico da [Loja]. Como posso te ajudar com as especificações hoje?',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'sent',
  data: 'Oi. Tô vendo esse monitor de 34 polegadas aqui, mas meu notebook é um MacBook Air M1. O HDMI dele vai aguentar a resolução máxima ou vai ficar travado em 30Hz?',
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'streaming-received',
  data: 'Excelente pergunta, Bruno. O MacBook Air M1 via HDMI costuma limitar a taxa de atualização em telas Ultra-Wide. Para esse monitor de 144Hz, o ideal é usar a porta **USB-C com suporte a DisplayPort**.',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'sent',
  data: 'Ah, saquei. E esse monitor já vem com o cabo USB-C ou vou ter que comprar por fora?',
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'received',
  data: {
    text: 'Verifiquei aqui: na caixa desse modelo acompanham apenas os cabos HDMI e DisplayPort padrão. O cabo **USB-C de alta velocidade** precisa ser adquirido separadamente. Quer que eu te mostre um modelo compatível para você já receber tudo junto?',
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
              name: 'Cabo USB-C p/ DisplayPort 4K/144Hz',
              price: '59.90',
              currency: 'BRL',
              description: 'O CABO USB-C PARA DISPLAYPORT 8K é ideal para aumentar a resolução dos seus jogos e filmes.\n\nConecte seus equipamentos de alta resolução a este cabo e garanta uma experiência incrível com qualidade e velocidade extraordinária!',
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
  data: 'Boa, valeu pela explicação. Vou levar o cabo junto pra não ter erro.',
}];
