# syntax = docker/dockerfile:1

ARG NODE_VERSION="20.19"
ARG BASE_VERSION="alpine3.21"

FROM node:${NODE_VERSION}-${BASE_VERSION} AS builder

WORKDIR /app

RUN apk add --no-cache git

COPY package.json yarn.lock ./

RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install

COPY . ./

RUN yarn build

FROM nginxinc/nginx-unprivileged:1.25-alpine

COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html/vtex-webapp/
COPY --chown=nginx:nginx docker/headers /usr/share/nginx/html/
COPY docker/docker-entrypoint.sh /

RUN mv /usr/share/nginx/html/vtex-webapp/index.html /usr/share/nginx/html/vtex-webapp/index.html.tmpl \
    && cd /usr/share/nginx/html/vtex-webapp/ \
    && ln -s /tmp/index.html

EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]
