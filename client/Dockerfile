FROM node:10.15.0
WORKDIR /usr/src/client
COPY package*.json ./
ENV PATH /usr/src/client/node_modules/.bin:$PATH
RUN npm install
COPY . .
EXPOSE 3000
CMD npm start