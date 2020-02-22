FROM node:10.19.0 as builder

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./

USER node
RUN npm install
COPY --chown=node:node . .
CMD ["npm", "start"]