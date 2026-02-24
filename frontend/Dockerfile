FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG REACT_APP_API_URL=http://localhost:8000
ARG REACT_APP_TENANT_ID=public
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV REACT_APP_TENANT_ID=${REACT_APP_TENANT_ID}

RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
