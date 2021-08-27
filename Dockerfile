FROM node:16

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./lerna.json ./
RUN npm install

ARG NODE_ENV
COPY ./ ./
RUN npm run bootstrap
RUN if [ "$NODE_ENV" = "production" ]; \
        then npm run build && rm -rf src && npm prune --production; \
        fi

EXPOSE 4000
CMD [ "node", "dist/src/main.js" ]