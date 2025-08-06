FROM node:18 AS build

WORKDIR /app
COPY . .

RUN npm install --include=dev \
  && chmod -R +x node_modules/.bin \
  && npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]