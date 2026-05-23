FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
ARG VITE_API_URL=/api/v1
ARG VITE_KIOSK_ID=1
ARG VITE_ACTIVE_HOTEL_ID=1
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_KIOSK_ID=${VITE_KIOSK_ID}
ENV VITE_ACTIVE_HOTEL_ID=${VITE_ACTIVE_HOTEL_ID}
RUN npm run build

FROM nginx:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
