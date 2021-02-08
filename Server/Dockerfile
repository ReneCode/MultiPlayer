FROM node:14

WORKDIR /user/src/app

COPY . .

RUN npm install
RUN npm run test
RUN npm run build


EXPOSE 8080

CMD ["node", "dist/index.js"]