FROM node:12

WORKDIR /user/src/app

COPY . .

RUN npm install
RUN npm run build

ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "dist/index.js"]