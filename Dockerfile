#
# MongoDB Dockerfile
#
# https://github.com/dockerfile/mongodb
#

# Pull base image.
FROM ubuntu:14.04

# Install MongoDB.
RUN \
  apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10 && \
  echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' > /etc/apt/sources.list.d/mongodb.list && \
  apt-get update && \
  apt-get -y install curl &&\
  curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash - && \
  echo exit 0 > /usr/sbin/policy-rc.d && \
  apt-get install -y mongodb-org git nodejs && \
  rm -rf /var/lib/apt/lists/*

# Define mountable directories.

VOLUME ["/usr/src/data/db"]

RUN npm config set strict-ssl false
RUN npm cache clean --force

WORKDIR /usr/src/client
COPY client/package.json .
RUN npm install
COPY client/ .

WORKDIR /usr/src/server
COPY server/package.json .
RUN npm install
COPY server/ .

EXPOSE 3000
EXPOSE 3001
EXPOSE 27017

WORKDIR /usr/src/

CMD mongod --dbpath=/usr/src/data/db & (cd server && npm start) & (cd client && npm start)