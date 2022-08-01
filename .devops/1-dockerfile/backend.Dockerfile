FROM node:14.20.0

WORKDIR /backend

COPY ./frontend/package.json ./

RUN npm i

COPY ./frontend/server /backend/server

EXPOSE 3200

CMD ["npm", "run", "server"]

