FROM node:20.5.1-slim as builder
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --silent
COPY . .
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "preview"]