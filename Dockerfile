FROM node:22.18.0-alpine3.22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.28.0-alpine3.21
COPY --from=build --chown=101:101 /app/dist /usr/share/nginx/html
# O entrypoint oficial processa /etc/nginx/templates/*.template com envsubst
# e grava o resultado em /etc/nginx/conf.d/default.conf.
COPY --chown=101:101 nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --chown=101:101 proxy_params /etc/nginx/proxy_params
# Padroes para o Docker Compose local; no Railway PORT e API_UPSTREAM vem do servico.
ENV PORT=8080 \
    API_UPSTREAM=api-facilitei:8080 \
    NGINX_ENTRYPOINT_LOCAL_RESOLVERS=1
USER 101:101
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
