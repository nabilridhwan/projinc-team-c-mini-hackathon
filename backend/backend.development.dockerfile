FROM node:alpine

WORKDIR /backend

RUN npm install nodemon -g

ENTRYPOINT [ "nodemon" ]