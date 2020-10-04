FROM node:alpine

WORKDIR /app
RUN mkdir /data

COPY ./src/package*.json ./
RUN npm install

COPY ./src/*.js ./

ENTRYPOINT [ "npm", "start" ]