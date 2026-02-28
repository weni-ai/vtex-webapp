import { cursor } from './previewUseCases';

export const useCaseCancellationsSteps = [{
  type: 'streaming-received',
  data: 'Olá! Tudo bem? Sou o assistente da [Loja]. Antes de começarmos: posso te ajudar hoje Marcos?',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'sent',
  data: 'Aqui é o Marcos. Quero cancelar o pedido da geladeira que fiz ontem. Comprei a voltagem errada, peguei 110v e aqui em casa é tudo 220v.',
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'streaming-received',
  data: 'Entendo perfeitamente, Marcos. Acontece muito! Para eu localizar sua compra e te ajudar com isso, você poderia me informar o **número do pedido**?',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'sent',
  data: 'É o pedido #98754.',
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'streaming-received',
  data: 'Localizei aqui: Geladeira Inverse 420L Inox (110v). Antes de seguirmos com o cancelamento e você ter que esperar o estorno, eu posso **trocar a voltagem no seu pedido** agora mesmo, se tivermos em estoque. Deixa eu checar...',
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'received',
  data: {
    text: 'Marcos, infelizmente o modelo 420L está esgotado em 220v. Tenho um modelo de 460L da mesma linha disponível em 220v para entrega imediata. Gostaria de considerar essa troca?',
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
              name: 'Geladeira Inverse Frost Free Inverter 460L Aço Escovado',
              price: '3999.90',
              currency: 'BRL',
              description: 'Máxima classificação em economia de energia e performance\n\nAs geladeiras Panasonic estão entre as mais eficientes do Brasil, com classificação A na nova tabela de eficiência energética do Inmetro, garantindo mais economia e ajudando a reduzir o valor da conta de luz.\n\nGeladeira econômica, silenciosa e com o congelamento mais rápido com Inverter\n\nAlém de economizar energia, a tecnologia Inverter torna a geladeira mais silenciosa e acelera o congelamento por meio da regulagem do compressor, proporcionando maior eficiência',
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
  data: 'Putz, não. Eu pesquisei muito sobre essa de 420L e ela encaixa perfeito no meu armário. Se não tem ela em 220v, prefiro cancelar mesmo.',
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'streaming-received',
  data: 'Compreendo, Marcos. Quando o móvel é sob medida, a precisão é tudo. Já que a troca não atende, vou priorizar o cancelamento do pedido #98754 agora mesmo. Aguarde um momento por favor.',
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'streaming-received',
  data: 'Tudo certo, Marcos. O estorno deve aparecer na sua próxima fatura. Posso te ajudar em algo mais?',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'sent',
  data: 'Não, era só isso mesmo obrigado.',
}];
