export const useCaseOrderStatusSteps = [{
  type: 'streaming-received',
  data: 'Olá, Bruno! Como posso te ajudar com seu pedido hoje?',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'sent',
  data: 'Oi. Queria saber onde está meu pedido #98754. O prazo está quase vencendo.',
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'streaming-received',
  data: 'Com certeza, Bruno. Localizei aqui: seu pedido já está com a transportadora parceira.\n\nPara acompanhar o trajeto detalhado passo a passo, você pode acessar o portal deles e informar o número do seu CPF. Vou deixar o link direto aqui para facilitar:',
}, {
  type: 'typing',
}, {
  type: 'delay',
  data: 3000,
}, {
  type: 'streaming-received',
  data: 'O prazo final de entrega continua sendo quinta-feira. Mais alguma dúvida sobre o envio?',
}];
