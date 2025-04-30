import { createContext } from "react";

interface RestrictionType {
  is_active: boolean;
  phone_numbers: string;
  sellers: string[];
}

interface AbandonedCartActiveType {
  restriction: RestrictionType;
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
  restriction: RestrictionType;
}

export interface SettingsFormData extends Partial<AbandonedCartActiveType>, Partial<OrderStatusActiveType> {}

export interface SettingsContextType {
  formData?: SettingsFormData;
  setFormData: (data: SettingsFormData) => void;
}

export const SettingsContext = createContext<SettingsContextType | null>(null);
