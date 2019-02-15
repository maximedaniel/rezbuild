# Sample Dockerfile for installing MongoDB on an Ubuntu 14.04 server
# https://github.com/atbaker/mongo-example
#FROM ubuntu:14.04
#RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
#RUN echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
#RUN apt-get update
#RUN apt-get install -y mongodb-org
#RUN mkdir -p /data/db



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

FROM mongo

WORKDIR /usr/src/
VOLUME ['./data/db']
EXPOSE 27017

CMD ["mongod" "&", "(cd /usr/src/server && npm start)", "&", "(cd /usr/src/client && npm start)" ]