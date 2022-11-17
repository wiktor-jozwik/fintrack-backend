FROM node:alpine As development

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN pnpm i

COPY --chown=node:node . .

RUN pnpm run prisma:generate

RUN pnpm run build:operations-importer-handler

USER node


FROM node:alpine AS production

ENV NODE_ENV production

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN pnpm i --prod

COPY --chown=node:node --from=development /usr/src/app/dist ./dist

COPY --chown=node:node --from=development /usr/src/app/libs ./libs

COPY --chown=node:node --from=development /usr/src/app/database ./database

RUN pnpm run prisma:generate

RUN mkdir upload

USER node

CMD ["node", "dist/apps/operations-importer-handler/main.js"]