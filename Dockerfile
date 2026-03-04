FROM node:20-alpine as build-step

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine as production-step

WORKDIR /app

COPY --from=build-step /app/dist ./dist
COPY --from=build-step /app/package*.json ./

RUN npm install --production

EXPOSE 3000

CMD ["node", "dist/main.js"]

