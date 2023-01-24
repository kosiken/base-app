FROM node:16-alpine as base

WORKDIR /usr/src/app
# RUN npm install -g yarn
COPY package*.json /
EXPOSE 3003

FROM base as production
ENV NODE_ENV=production
RUN npm install
COPY . /
RUN npm run build
CMD ["npm", "run", "start"]

FROM base as dev
ENV NODE_ENV=development
RUN npm install
COPY . /
CMD ["npm", "run", "dev"]
