FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Copia la config por defecto para SPAs o simplemente el nginx basico
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
