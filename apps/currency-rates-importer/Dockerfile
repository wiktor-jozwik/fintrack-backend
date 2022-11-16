FROM node:alpine As development

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN pnpm i

COPY --chown=node:node . .

RUN pnpm run prisma:generate

RUN pnpm run build:currency-rates-importer

USER node


FROM node:alpine AS production

ENV NODE_ENV production

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN pnpm i --prod

#RUN pnpm run prisma:generate

COPY --chown=node:node --from=development /usr/src/app/dist ./dist

COPY --chown=node:node --from=development /usr/src/app/libs ./libs

COPY --chown=node:node --from=development /usr/src/app/database ./database

RUN mkdir upload

USER node

CMD ["node", "dist/apps/currency-rates-importer/main.js"]