FROM node:20.14.0-alpine AS build

USER node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20.14.0-alpine

USER node

WORKDIR /app

COPY --from=build /app/dist ./dist

COPY --from=build /app/package*.json ./

RUN npm install --only=production

CMD ["npm", "run", "start:prod"]