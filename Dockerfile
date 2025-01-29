FROM node:alpine

EXPOSE 3100

WORKDIR /app

COPY package.json ./
COPY ./ ./
RUN yarn install
RUN yarn build

CMD ["node", "dist/app.js"]
