# Build image

FROM node:20.14.0-alpine AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .


RUN npm run build

# Production image

FROM node:20.14.0-alpine

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/dist ./dist

COPY --chown=node:node --from=build /usr/src/app/package*.json .

RUN npm ci --only=production && npm cache clean --force

RUN rm package*.json

USER node

CMD ["node", "dist/main.js"]