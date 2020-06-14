FROM node:12
WORKDIR /usr/workspace/occurrence-api
COPY ./package.json .
RUN npm install --only=prod