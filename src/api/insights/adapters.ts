export interface ConversationTotalsResponse {
  total_conversations: {
    value: number;
    percentage: number;
  };
  resolved: {
    value: number;
    percentage: number;
  };
  unresolved: {
    value: number;
    percentage: number;
  };
  transferred_to_human: {
    value: number;
    percentage: number;
  };
}

export interface ConversationTotals {
  totalConversations: {
    value: number;
    percentage: number;
  };
  resolved: {
    value: number;
    percentage: number;
  };
}

export function adaptConversationTotals(
  response: ConversationTotalsResponse,
): ConversationTotals {
  return {
    totalConversations: {
      value: response.total_conversations.value,
      percentage: response.total_conversations.percentage,
    },
    resolved: {
      value: response.resolved.value,
      percentage: response.resolved.percentage,
    },
  };
}

export interface RevenueResponse {
  revenue: {
    value: number;
    currency_code: string;
    increase_percentage: number;
    orders_placed: {
      value: number;
      increase_percentage: number;
    };
  };
}

export interface Revenue {
  value: number;
  currencyCode: string;
  increasePercentage: number;
  ordersPlaced: {
    value: number;
    increasePercentage: number;
  };
}

export function adaptRevenue(response: RevenueResponse): Revenue {
  return {
    value: response.revenue.value,
    currencyCode: response.revenue.currency_code,
    increasePercentage: response.revenue.increase_percentage,
    ordersPlaced: {
      value: response.revenue.orders_placed.value,
      increasePercentage: response.revenue.orders_placed.increase_percentage,
    },
  };
}

export interface CSATResultItem {
  label: string;
  value: number;
  full_value: number;
}

export interface CSATResponse {
  results: CSATResultItem[];
}

export interface CSATData {
  highestLabelScore: number;
  totalRatings: number;
}

export function adaptCSAT(response: CSATResponse): CSATData {
  if (response.results.length === 0) {
    return { highestLabelScore: 0, totalRatings: 0 };
  }

  const highestLabel = response.results.reduce((max, item) =>
    Number(item.label) > Number(max.label) ? item : max,
  );

  const totalRatings = response.results.reduce(
    (sum, item) => sum + item.full_value,
    0,
  );

  return {
    highestLabelScore: highestLabel.value,
    totalRatings,
  };
}

export interface MessagesAnalyticsResponse {
  status_count: {
    sent: { value: number };
    delivered: { value: number };
    read: { value: number };
    clicked: { value: number };
  };
}

export interface MessagesAnalytics {
  sent: number;
  delivered: number;
  read: number;
  clicked: number;
}

export function adaptMessagesAnalytics(
  response: MessagesAnalyticsResponse,
): MessagesAnalytics {
  return {
    sent: response.status_count.sent.value,
    delivered: response.status_count.delivered.value,
    read: response.status_count.read.value,
    clicked: response.status_count.clicked.value,
  };
}
