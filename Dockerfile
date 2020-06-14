FROM node:12
WORKDIR /usr/src/occurrence-api
COPY ./package.json .
RUN npm install --only=prod