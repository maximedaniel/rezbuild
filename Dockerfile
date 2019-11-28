#
# MongoDB Dockerfile
#
# https://github.com/dockerfile/mongodb
#

# Pull base image.
FROM ubuntu:16.04

# Install MongoDB.
RUN \
  apt-get -y update && \
  apt-get -y install sudo gnupg && \
  apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 68818c72e52529d4 && \
  echo "deb [ arch=amd64 ] http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/4.0 multiverse" > /etc/apt/sources.list.d/mongodb-org-4.0.list && \
  apt-get -y update && \
  #apt-get -y dist-upgrade && \
  apt-get -y install curl && \
  curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash - && \
  echo exit 0 > /usr/sbin/policy-rc.d && \
  sudo touch /etc/init.d/mongod && \
  #touch /etc/init.d/mongod && \
  apt-get install -y mongodb-org=4.0.5 mongodb-org-server=4.0.5 mongodb-org-shell=4.0.5 mongodb-org-mongos=4.0.5 mongodb-org-tools=4.0.5 git nodejs && \
  rm -rf /var/lib/apt/lists/* \
  rm -rf /usr/src/data/db/*


# Define mountable directories.

VOLUME ["/usr/src/data/db", "/usr/src/api/src/files"]

RUN npm config set strict-ssl false
RUN npm cache clean --force

WORKDIR /usr/src/common
COPY common/package.json .
RUN npm install
RUN npm link
COPY common/ .

WORKDIR /usr/src/app
COPY app/package.json .
RUN npm install
RUN npm link common
COPY app/ .

WORKDIR /usr/src/api
COPY api/package.json .
RUN npm install
RUN npm link common
COPY api/ .


WORKDIR /usr/src/db
COPY db/package.json .
RUN npm install
RUN npm link common
COPY db/ .

EXPOSE 3000
EXPOSE 3001
EXPOSE 27017
EXPOSE 8081

WORKDIR /usr/src/

CMD mongod --dbpath=/usr/src/data/db  & (sleep 10 && cd api && npm start) & (sleep 20 && cd app && npm start) & (sleep 30 && cd db && npm start) 