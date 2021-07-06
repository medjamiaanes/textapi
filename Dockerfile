FROM node:12.4-alpine

WORKDIR /usr/src/textapi

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 80

CMD ["node", "./build/main.js"]