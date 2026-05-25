# docker/frontend/Dockerfile
FROM node:18-alpine AS build
WORKDIR /app

# Copiar package files
COPY frontend/package*.json ./
RUN npm ci

# Copiar código fonte
COPY frontend/ .

# Build
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]