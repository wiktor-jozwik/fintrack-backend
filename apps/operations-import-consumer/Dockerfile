FROM node:alpine AS dev

WORKDIR /usr/src/app

COPY --chown=node:node package.json yarn.lock tsconfig.json ./

COPY --chown=node:node ./libs/common/package.json ./libs/common/
COPY --chown=node:node ./apps/operations-import-consumer/package.json ./apps/operations-import-consumer/

RUN yarn install --pure-lockfile --non-interactive --cache-folder ./ycache

COPY --chown=node:node ./apps/operations-import-consumer ./apps/operations-import-consumer
COPY --chown=node:node ./libs ./libs

COPY --chown=node:node ./database ./database

RUN yarn prisma:generate

RUN yarn build:operations-import-consumer

USER node


FROM node:alpine AS prod

WORKDIR /usr/src/app

ENV NODE_ENV production

COPY --chown=node:node package.json yarn.lock tsconfig.json ./

COPY ./apps/operations-import-consumer/package.json ./apps/operations-import-consumer/

RUN yarn install --pure-lockfile --non-interactive --cache-folder ./ycache --prod

COPY --chown=node:node --from=dev /usr/src/app/dist ./dist

COPY --chown=node:node --from=dev /usr/src/app/database ./database

RUN yarn prisma:generate

USER node

CMD ["node", "dist/apps/operations-import-consumer/src/main.js"]