FROM node:22.18.0-alpine3.22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.28.0-alpine3.21
COPY --from=build --chown=101:101 /app/dist /usr/share/nginx/html
COPY --chown=101:101 nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=101:101 proxy_params /etc/nginx/proxy_params
USER 101:101
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
