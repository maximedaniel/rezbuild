FROM node:10.15.0

WORKDIR /usr/src/client
COPY client/package.json ./
RUN npm install
COPY client/ .
EXPOSE 3000

WORKDIR /usr/src/server
COPY server/package.json ./
RUN npm install
COPY server/ .
EXPOSE 3001

WORKDIR /usr/src
COPY package.json ./
CMD (cd server && npm start) & (cd client && npm start)