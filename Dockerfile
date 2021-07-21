FROM node:14

WORKDIR /usr/src/app

COPY . .

RUN curl -f https://get.pnpm.io/v6.7.js | node - add --global pnpm

RUN pnpm install

RUN pnpm build

EXPOSE 3000
CMD [ "node", "dist/server.js" ]