import { GrowthBook } from "@growthbook/growthbook-react";
import getEnv from "../utils/env";

interface AppFeatures {
  agentDetailsPageAccess: boolean;
}

export const growthbook = new GrowthBook<AppFeatures>({
  apiHost: getEnv("VITE_APP_GROWTHBOOK_API_HOST"),
  clientKey: getEnv("VITE_APP_GROWTHBOOK_CLIENT_KEY"),
});

growthbook.init({
  streaming: true,
});
