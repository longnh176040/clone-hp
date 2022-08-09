FROM node:14.20.0

ARG ENV_FILE

WORKDIR /backend

COPY ./frontend/package.json ./

RUN npm i

COPY ./frontend/server /backend/server

RUN cd /backend/server && echo "$ENV_FILE" > '.env'

EXPOSE 3200

CMD ["npm", "run", "server"]

