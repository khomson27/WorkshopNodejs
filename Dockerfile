FROM node:12.18.1
 
WORKDIR /usr/src/app

COPY package.json ./
 
RUN npm install
 
COPY . .
 
CMD [ "node", "start" ]