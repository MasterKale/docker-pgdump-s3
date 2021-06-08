FROM node:14.17-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
RUN apk add --no-cache postgresql=13.3-r0
CMD ["node", "index.js"]
