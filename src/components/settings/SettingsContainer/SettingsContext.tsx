import { createContext } from "react";

interface AbandonedCartActiveType {
  messageTimeRestriction: {
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

interface OrderStatusActiveType {
  order_status_restriction: {
    is_active: boolean;
    phone_numbers: string;
    sellers: string[];
  };
}

export interface SettingsFormData extends Partial<AbandonedCartActiveType>, Partial<OrderStatusActiveType> {}

export interface SettingsContextType {
  formData?: SettingsFormData;
  setFormData: (data: SettingsFormData) => void;
}

export const SettingsContext = createContext<SettingsContextType | null>(null);
