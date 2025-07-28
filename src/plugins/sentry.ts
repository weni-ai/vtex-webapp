import * as Sentry from "@sentry/react";
import getEnv from "../utils/env";

Sentry.init({
  dsn: getEnv("SENTRY_DSN"),
  environment: getEnv("SENTRY_ENVIRONMENT"),
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration()
  ],
});
