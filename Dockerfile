FROM node:16-alpine as base  

WORKDIR /app

COPY package*.json .

EXPOSE 3000

RUN npm install

COPY . .

RUN npm run build

FROM base as dev

COPY --from=base /app/src  ./src

RUN npm install -g nodemon

CMD ["npm", "run", "start:dev"]

FROM base as production 

RUN npm ci --only=production

COPY --from=base /app/dist ./dist

CMD ["node", "./dist/src/server.js"]