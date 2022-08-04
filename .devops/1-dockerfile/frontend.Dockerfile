FROM node:14.20.0 as builder

WORKDIR /frontend

COPY ./frontend/package.json ./

RUN npm i

COPY ./frontend/ .

RUN npm run build

FROM nginx:1.18-alpine as release

WORKDIR /frontend

COPY ./.devops/conf.d/ /etc/nginx/conf.d/

COPY --from=builder /frontend/dist/frontend/browser/ /usr/share/nginx/html/

CMD ["nginx", "-g", "daemon off;"]

