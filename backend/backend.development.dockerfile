FROM node:alpine

WORKDIR /backend

RUN npm install nodemon -g

ENTRYPOINT [ "npm", "run", "start:dev" ]