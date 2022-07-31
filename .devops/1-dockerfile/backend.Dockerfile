FROM node:14.20.0

WORKDIR /backend

COPY package.json .

RUN npm i

COPY ./server /backend/server

RUN npm run build

EXPOSE 3200

CMD ["npm", "run", "server"]

