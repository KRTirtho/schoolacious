FROM node:14.17-alpine

WORKDIR /app

COPY ./package.json ./
RUN npm install

ARG NODE_ENV
COPY ./ ./
RUN if [ "$NODE_ENV" = "production" ]; \
        then npm run build && rm -rf src && npm prune --production; \
        fi

EXPOSE 4000
CMD [ "node", "dist/src/main.js" ]