FROM node:24.15.0-alpine AS build
WORKDIR /app

ARG VITE_UNTITLED_BFF_URL
ARG VITE_LOGIN_URL
ENV VITE_UNTITLED_BFF_URL=$VITE_UNTITLED_BFF_URL
ENV VITE_LOGIN_URL=$VITE_LOGIN_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
