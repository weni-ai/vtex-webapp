import { createContext } from "react";

interface AbandonedCartActiveType {
  messageTimeRestriction: {
      "isActive": boolean;
      "periods": {
          "weekdays": {
              "from": string;
              "to": string
          },
          "saturdays": {
              "from": string;
              "to": string;
          }
      }
  }
}

export type SettingsFormData = AbandonedCartActiveType;

export interface SettingsContextType {
  setFormData: (data: SettingsFormData) => void;
}

export const SettingsContext = createContext<SettingsContextType | null>(null);
