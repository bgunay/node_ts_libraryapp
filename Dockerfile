FROM node:19-alpine as development

# Create app directory
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
RUN npm install -g ts-node
COPY . .

RUN npm run build

FROM node:19-alpine as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --only=production
COPY . .
COPY --from=development /app/build ./build
CMD npm run prod
