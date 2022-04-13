FROM node:15

RUN apt-get update && apt-get upgrade -y && apt-get install curl bash build-essential -y
USER node
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
WORKDIR /home/node/app
RUN curl -sS https://webinstall.dev/watchexec | bash

COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./lerna.json ./
COPY ./packages/titumir ./packages/titumir

USER root
RUN chown -R node:node /home/node
USER node

RUN npm i -g npm@latest && npm config delete proxy && npm config delete https-proxy && npm install

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "production" ]; \
        then npm run build && rm -rf src && npm prune --production; \
        fi

EXPOSE 4000
CMD [ "npm run start" ]