FROM node:16

WORKDIR /app
RUN apt update && apt upgrade && apt install curl bash -y
RUN curl -sS https://webinstall.dev/watchexec | bash

COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./lerna.json ./
COPY ./packages/titumir ./packages/titumir
RUN npm install

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "production" ]; \
        then npm run build && rm -rf src && npm prune --production; \
        fi

EXPOSE 4000
CMD [ "node", "dist/src/main.js" ]