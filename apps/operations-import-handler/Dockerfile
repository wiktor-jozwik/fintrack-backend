FROM node:alpine AS dev

WORKDIR /usr/src/app

COPY --chown=node:node package.json yarn.lock tsconfig.json ./

COPY --chown=node:node ./libs/common/package.json ./libs/common/
COPY --chown=node:node ./apps/operations-import-handler/package.json ./apps/operations-import-handler/

RUN yarn install --pure-lockfile --non-interactive --cache-folder ./ycache

COPY --chown=node:node ./apps/operations-import-handler ./apps/operations-import-handler

COPY --chown=node:node ./libs/common ./libs/common

COPY --chown=node:node ./database ./database

RUN yarn prisma:generate

RUN yarn build:operations-import-handler

USER node


FROM node:alpine AS prod

WORKDIR /usr/src/app

ENV NODE_ENV production

COPY --chown=node:node package.json yarn.lock tsconfig.json ./

COPY ./libs/common/package.json ./libs/common/
COPY ./apps/operations-import-handler/package.json ./apps/operations-import-handler/

RUN yarn install --pure-lockfile --non-interactive --cache-folder ./ycache --prod

COPY --chown=node:node --from=dev /usr/src/app/dist ./dist

COPY --chown=node:node --from=dev /usr/src/app/database ./database

RUN yarn prisma:generate

RUN mkdir upload

USER node

CMD ["node", "dist/apps/operations-import-handler/src/main.js"]
#
#
#
#
#FROM node:alpine As development
#
#RUN npm install -g pnpm
#
#WORKDIR /usr/src/app
#
#COPY --chown=node:node package*.json ./
#
#RUN pnpm i
#
#COPY --chown=node:node . .
#
#RUN pnpm run prisma:generate
#
#RUN pnpm run build:operations-importer-handler
#
#USER node
#
#
#FROM node:alpine AS production
#
#ENV NODE_ENV production
#
#RUN npm install -g pnpm
#
#WORKDIR /usr/src/app
#
#COPY --chown=node:node package*.json ./
#
#RUN pnpm i --prod
#
#COPY --chown=node:node --from=development /usr/src/app/dist ./dist
#
#COPY --chown=node:node --from=development /usr/src/app/libs ./libs
#
#COPY --chown=node:node --from=development /usr/src/app/database ./database
#
#RUN pnpm run prisma:generate
#
#RUN mkdir upload
#
#USER node
#
#CMD ["node", "dist/apps/operations-importer-handler/main.js"]