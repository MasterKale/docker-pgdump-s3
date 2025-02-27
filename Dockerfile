FROM node:14.17-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./app package.json package-lock.json /usr/src/app
COPY ./apk-repositories /etc/apk/repositories
RUN npm ci
RUN apk add --no-cache postgresql=13.3-r0
CMD ["node", "index.js"]
