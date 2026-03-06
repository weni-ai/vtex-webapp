export interface MetaPricingResponse {
  source: string;
  currency: string;
  rates: {
    marketing: string;
    utility: string;
    service: string;
    authentication: string;
  };
}

export interface MetaPricing {
  currency: string;
  rates: {
    marketing: number;
    utility: number;
    service: number;
    authentication: number;
  };
}

export function adaptMetaPricing(response: MetaPricingResponse): MetaPricing {
  return {
    currency: response.currency,
    rates: {
      marketing: Number(response.rates.marketing),
      utility: Number(response.rates.utility),
      service: Number(response.rates.service),
      authentication: Number(response.rates.authentication),
    },
  };
}
