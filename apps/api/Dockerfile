FROM node:alpine AS dev

WORKDIR /usr/src/app

COPY --chown=node:node package.json yarn.lock tsconfig.json ./

COPY --chown=node:node ./libs/common/package.json ./libs/common/
COPY --chown=node:node ./apps/api/package.json ./apps/api/

RUN yarn install --pure-lockfile --non-interactive --cache-folder ./ycache

COPY --chown=node:node ./apps/api ./apps/api

COPY --chown=node:node ./libs/common ./libs/common

COPY --chown=node:node ./database ./database

RUN yarn prisma:generate

RUN yarn build:api



FROM node:alpine AS prod

WORKDIR /usr/src/app

ENV NODE_ENV production

COPY --chown=node:node package.json yarn.lock tsconfig.json ./

COPY --chown=node:node ./libs/common/package.json ./libs/common/
COPY --chown=node:node ./apps/api/package.json ./apps/api/

RUN yarn install --pure-lockfile --non-interactive --cache-folder ./ycache --prod

COPY --chown=node:node --from=dev /usr/src/app/dist ./dist

COPY --chown=node:node --from=dev /usr/src/app/database ./database

RUN yarn prisma:generate

USER node

CMD ["node", "dist/apps/api/src/main.js"]




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
#RUN pnpm run build:api
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
#USER node
#
#CMD ["node", "dist/apps/api/main.js"]