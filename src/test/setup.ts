import { vi } from "vitest";
import "@vtex/shoreline"; 
import "@vtex/shoreline/css";


vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
}));

global.t = (key: string) => key;
