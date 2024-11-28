FROM node:20.5.1-slim as builder
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --silent
COPY . .
RUN npm run build

# Production stage
FROM node:20.5.1-slim
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY package.json ./
RUN npm install --omit=dev --silent && npm cache clean --force
EXPOSE 4173
CMD ["npm", "run", "preview"]