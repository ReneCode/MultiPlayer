FROM node:12

WORKDIR /user/src/app

COPY . .
RUN npm install
RUN npm run build
RUN ls -an
RUN ls -an dist

EXPOSE 8080

CMD ["node", "dist/index.js"]