FROM node:18-alpine3.16 AS dev

WORKDIR /usr/src/app

COPY --chown=node:node package.json yarn.lock tsconfig.json ./

COPY --chown=node:node ./libs/common/package.json ./libs/common/
COPY --chown=node:node ./libs/rmq/package.json ./libs/rmq/
COPY --chown=node:node ./libs/azure-blob-storage/package.json ./libs/azure-blob-storage/
COPY --chown=node:node ./apps/api/package.json ./apps/api/

RUN yarn install --pure-lockfile --non-interactive --cache-folder ./ycache

COPY --chown=node:node ./database ./database

RUN yarn prisma:generate

USER node


FROM node:18-alpine AS prod-build

WORKDIR /usr/src/app

COPY --chown=node:node package.json yarn.lock tsconfig.json ./
COPY --chown=node:node ./libs/common/package.json ./libs/common/
COPY --chown=node:node ./libs/rmq/package.json ./libs/rmq/
COPY --chown=node:node ./libs/azure-blob-storage/package.json ./libs/azure-blob-storage/

COPY --chown=node:node --from=dev /usr/src/app/node_modules ./node_modules

COPY --chown=node:node ./apps/api ./apps/api
COPY --chown=node:node ./libs ./libs

COPY --chown=node:node ./database ./database

RUN yarn prisma:generate

RUN yarn build:api

RUN cp -R apps/api/src/modules/email/templates/ dist/apps/api/src/modules/email

RUN yarn install --pure-lockfile --non-interactive --cache-folder ./ycache --prod


FROM node:18-alpine AS prod

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --chown=node:node --from=prod-build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=prod-build /usr/src/app/dist ./dist

USER node

CMD ["node", "dist/apps/api/src/main.js"]