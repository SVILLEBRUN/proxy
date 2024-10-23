ARG NODE_VERSION=20.17.0

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app
EXPOSE 5000

FROM base AS development-stage
ENV NODE_ENV=development
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
USER node
CMD ["npm", "run", "dev"]

FROM base AS production-stage
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
USER node
COPY . .
CMD ["npm", "run", "start"]