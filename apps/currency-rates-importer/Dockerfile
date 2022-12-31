FROM node:18-alpine3.16 AS dev

WORKDIR /usr/src/app

COPY --chown=node:node package.json yarn.lock tsconfig.json ./

COPY --chown=node:node ./libs/common/package.json ./libs/common/
COPY --chown=node:node ./apps/currency-rates-importer/package.json ./apps/currency-rates-importer/

RUN yarn install --pure-lockfile --non-interactive --cache-folder ./ycache

COPY --chown=node:node ./database ./database

RUN yarn prisma:generate

USER node


FROM node:18-alpine3.16 AS prod-build

WORKDIR /usr/src/app

COPY --chown=node:node package.json yarn.lock tsconfig.json ./
COPY --chown=node:node ./libs/common/package.json ./libs/common/

COPY --chown=node:node --from=dev /usr/src/app/node_modules ./node_modules

COPY --chown=node:node ./apps/currency-rates-importer ./apps/currency-rates-importer
COPY --chown=node:node ./libs/common ./libs/common

COPY --chown=node:node ./database ./database

RUN yarn prisma:generate

RUN yarn build:currency-rates-importer

RUN yarn install --pure-lockfile --non-interactive --cache-folder ./ycache --prod


FROM node:18-alpine3.16 AS prod

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --chown=node:node --from=prod-build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=prod-build /usr/src/app/dist ./dist

USER node

CMD ["node", "dist/apps/currency-rates-importer/src/main.js"]