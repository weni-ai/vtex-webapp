import { cursor } from './previewUseCases';

export const useCaseCatalogConciergeSteps = [{
  type: 'streaming-received',
  data: 'Olá! Tudo bem? Sou o consultor assistente da [Loja]. Antes de começarmos: como posso te chamar e como posso te ajudar hoje?',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'sent',
  data: 'Oi, sou o Bruno e quero sugestões de presentes de aniversário pra minha mãe. Ela é bem exigente e eu não queria dar o básico, tipo flores.',
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'streaming-received',
  data: 'Entendo perfeitamente, Bruno. Presentes para mães exigentes pedem algo mais personalizado. Para eu te dar uma sugestão certeira: como ela gosta de aproveitar o tempo livre? Ela prefere momentos de autocuidado e bem-estar ou faz o perfil que adora tecnologia e praticidade?',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'sent',
  data: 'Ela está em uma fase de se cuidar mais, começou a fazer yoga agora. Mas também gosta muito de vinhos e de receber os amigos em casa.',
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'received',
  data: {
    text: 'Excelentes referências. Nesse caso, tenho dois caminhos interessantes: um é o **Kit de Aromaterapia com Difusor** para as sessões de yoga, ou um **Conjunto de Taças Forever Classic**, que é super exclusivo para receber visitas. Qual dessas opções parece combinar mais com o estilo dela hoje?',
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
              name: 'Kit de Aromaterapia com Difusor',
              price: '119.90',
              currency: 'BRL',
              description: 'Transforme qualquer ambiente da sua casa ou espaço profissional em um verdadeiro refúgio de paz, aconchego e sofisticação com Aromatizador em Porcelana.\n\nMuito mais que um aromatizador, este item une beleza artesanal e funcionalidade, sendo uma peça decorativa que promove bem-estar físico, emocional e sensorial através da aromaterapia.',
              seller_id: 'seller-1',
            }, {
              product_retailer_id: 'best-1',
              image: 'https://cdn.cloud.weni.ai/VTEXApp/webchat-preview/conjunto-de-tacas-forever.png',
              name: 'Conjunto de Taças Forever Classic',
              price: '199.90',
              currency: 'BRL',
              description: 'As peças da coleção Forever Classic possuem um formato mais clássico. O modelo perfeito para quem já está acostumado com o mundo dos vinhos e busca a taça ideal para o tipo de uva e de bebida.\n\nO Conjunto com 06 Taças de Cristal Forever Classic contém peças versáteis que podem ser usadas para a degustação de vinhos brancos ou água.',
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
  data: 'Pois é, o kit de aromaterapia é legal, mas não sei se ela ia usar tanto assim. E as taças... ela já tem muita coisa de cozinha, acho que não seria o caso agora. Teria algo diferente, que junte um pouco desses dois mundos?',
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'streaming-received',
  data: 'Entendo perfeitamente, Bruno. Queremos algo que seja útil, mas que tenha aquele impacto de novidade. Pensando que ela gosta de Yoga (relaxamento) e também de vinhos, o que você acha de seguirmos para a linha de **Decoração Sensorial**?',
}, {
  type: 'received',
  data: {
    text: 'Temos um **Abridor de Vinho Elétrico com Design Ergonômico** que é extremamente compacto, ou — o que eu acho que seria o \'tiro certo\' — uma **Manta de Algodão Egípcio para Meditação**. Ela é leve, não ocupa espaço e pode ser usada tanto no momento do Yoga quanto para relaxar no sofá com uma taça de vinho. É um item de conforto que dura a vida toda.',
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
              name: 'Abridor de Vinho Elétrico com Design Ergonômico',
              price: '99.90',
              currency: 'BRL',
              description: 'Imagine abrir sua garrafa de vinho favorita com um simples toque, sem esforço, em segundos – como um verdadeiro sommelier. Com o Kit Abridor de Vinho Elétrico, você transforma cada ocasião em uma experiência memorável, seja num jantar romântico, uma celebração entre amigos ou aquele momento só seu.\n\nEste não é apenas um abridor. É um convite ao prazer, à elegância e ao ritual de saborear cada taça com mais estilo e menos complicação.',
              seller_id: 'seller-1',
            }, {
              product_retailer_id: 'best-1',
              image: 'https://cdn.cloud.weni.ai/VTEXApp/webchat-preview/manta-de-algodao-egipcio-para-meditacao.png',
              name: 'Manta de Algodão Egípcio para Meditação',
              price: '259.90',
              currency: 'BRL',
              description: 'A manta de algodão egípcio para meditação oferece conforto superior, maciez extrema e alta respirabilidade, ideal para manter o equilíbrio térmico durante a prática. Com fibras longas e resistentes, essas mantas proporcionam um toque luxuoso, suavidade e durabilidade, sendo ótimas para cobrir-se ou usar como suporte, garantindo relaxamento e tranquilidade no momento de meditação.',
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
  data: 'Essa manta de algodão egípcio me interessou. Parece ser o tipo de coisa que ela não compraria pra ela mesma, mas ia adorar ganhar. Ela é muito grande?',
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'streaming-received',
  data: 'Ela tem o tamanho ideal para uma pessoa (1,50m x 1,20m), mas o tecido é tão nobre que dobrada ela fica do tamanho de uma almofada pequena. Inclusive, Bruno, esse item faz parte da nossa \'Coleção Casa\' e está com uma avaliação 5 estrelas. Sugiro a cor **Areia** ela é nossa favorita para presentes por ser neutra e sofisticada.',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'sent',
  data: 'Legal, acho que vou escolher ela então, obrigado.',
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'streaming-received',
  data: 'Você pode finalizar a compra pelo link abaixo. É só clicar e escolher a forma de pagamento:\n\nhttps://link.checkout.com',
}];
