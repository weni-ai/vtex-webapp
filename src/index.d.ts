interface AgentNext {
  uuid: string;
  name: string;
  description: string;
  notificationType: 'active' | 'passive';
  code: string;
  isAssigned: boolean;
  isInTest: boolean;
  origin: 'nexus' | 'commerce';
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
  code: 'order_status' | 'abandoned_cart';
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
