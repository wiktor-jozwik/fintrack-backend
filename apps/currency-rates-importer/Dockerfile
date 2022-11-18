FROM node:alpine AS dev

WORKDIR /usr/src/app

COPY --chown=node:node package.json yarn.lock tsconfig.json ./

COPY --chown=node:node ./libs/common/package.json ./libs/common/
COPY --chown=node:node ./apps/currency-rates-importer/package.json ./apps/currency-rates-importer/

RUN yarn install --pure-lockfile --non-interactive --cache-folder ./ycache

COPY --chown=node:node ./apps/currency-rates-importer ./apps/currency-rates-importer

COPY --chown=node:node ./libs/common ./libs/common

COPY --chown=node:node ./database ./database

RUN yarn prisma:generate

RUN yarn build:currency-rates-importer

USER node



FROM node:alpine AS prod

WORKDIR /usr/src/app

ENV NODE_ENV production

COPY package.json yarn.lock tsconfig.json ./

COPY --chown=node:node ./libs/common/package.json ./libs/common/
COPY --chown=node:node ./apps/currency-rates-importer/package.json ./apps/currency-rates-importer/

RUN yarn install --pure-lockfile --non-interactive --cache-folder ./ycache --prod

COPY --chown=node:node --from=dev /usr/src/app/dist ./dist

COPY --chown=node:node --from=dev /usr/src/app/database ./database

RUN yarn prisma:generate

USER node

CMD ["node", "dist/apps/currency-rates-importer/src/main.js"]


#WORKDIR /usr/src/app/database
#RUN yarn build

#WORKDIR /usr/src/app/apps/currency-rates-importer
#RUN yarn build:currency-rates-importer


#FROM node:alpine AS prod
#
#COPY package.json .
#COPY yarn.lock .
#
#COPY --from=build /usr/src/app/database/package.json /usr/src/app/database/package.json
#COPY --from=build /usr/src/app/database/dist /usr/src/app/database/dist
#
#COPY --from=build /usr/src/app/apps/currency-rates-importer/package.json /usr/src/app/apps/currency-rates-importer/package.json
#COPY --from=build /usr/src/app/apps/currency-rates-importer/build /usr/src/app/apps/currency-rates-importer/build
#
#ENV NODE_ENV production
#
#RUN yarn install --pure-lockfile --non-interactive --production
#
#WORKDIR /usr/src/app/apps/currency-rates-importer
#
#CMD ["npm", "start"]



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
#RUN pnpm run build:currency-rates-importer
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
#CMD ["node", "dist/apps/currency-rates-importer/main.js"]