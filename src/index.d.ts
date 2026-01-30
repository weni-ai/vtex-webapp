enum ABANDONED_CART_CODES {
  LEGACY = 'abandoned_cart',
  ACTIVE = 'active_cart_abandonment',
}

interface AgentNext {
  uuid: string;
  name: string;
  description: string;
  notificationType: 'active' | 'passive';
  code: string;
  isAssigned: boolean;
  isInTest: boolean;
  origin: 'nexus' | 'commerce';
  isOfficial: boolean;
  isConfiguring?: boolean;
  skills?: string[];
  templateSynchronizationStatus?: string;
  restrictTestContact?: {
    isActive: boolean;
    phoneNumber: string;
  };
  restrictMessageTime?: {
    isActive: boolean;
    periods: {
      weekdays: {
        from: string;
        to: string;
      };
      saturdays: {
        from: string;
        to: string;
      };
    };
  };
}

interface AgentCommerce extends AgentNext {
  code: 'order_status' | ABANDONED_CART_CODES.LEGACY;
  origin: 'commerce';
  notificationType: 'active';
  isConfiguring: boolean;
  templateSynchronizationStatus: 'unset' | 'pending' | 'rejected' | 'approved';
  restrictTestContact?: {
    isActive: boolean;
    phoneNumber: string;
  };
  restrictMessageTime?: {
    isActive: boolean;
    periods: {
      weekdays: {
        from: string;
        to: string;
      };
      saturdays: {
        from: string;
        to: string;
      };
    };
  };
}

interface AgentNexus extends AgentNext {
  origin: 'nexus';
  notificationType: 'passive';
  skills: string[];
}

interface AgentCLI extends AgentNext {
  origin: 'CLI';
  assignedAgentUuid: string;
  notificationType: 'active';
  templates: {
    uuid: string;
    name: string;
    startCondition: string;
    metadata: object;
  }[];
  credentials: {
    [key: string]: {
      label: string;
      placeholder: string;
    };
  };
}
