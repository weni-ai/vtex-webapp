#!/bin/sh

export JSON_STRING='window.configs = { \
  "SENTRY_DSN":"'${SENTRY_DSN}'", \
  "SENTRY_ENVIRONMENT":"'${SENTRY_ENVIRONMENT}'", \
  "API_BASE_URL":"'${API_BASE_URL}'", \
  "VITE_APP_FACEBOOK_APP_ID":"'${VITE_APP_FACEBOOK_APP_ID}'", \
  "VITE_APP_WHATSAPP_FACEBOOK_APP_ID":"'${VITE_APP_WHATSAPP_FACEBOOK_APP_CONFIG_ID}'", \
  "VITE_APP_CLIENT_ID":"'${VITE_APP_CLIENT_ID}'", \
  "VITE_APP_CLIENT_SECRET":"'${VITE_APP_CLIENT_SECRET}'", \
  "VITE_APP_AUTH_URL":"'${VITE_APP_AUTH_URL}'", \
  
}'
sed "s|\/\/ CONFIGURATIONS_PLACEHOLDER|${JSON_STRING}|" /usr/share/nginx/html/vtex-webapp/index.html.tmpl > /tmp/index.html

exec "$@"