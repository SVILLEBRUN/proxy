FROM node:26-alpine AS base
RUN npm install -g pnpm@12
WORKDIR /app
EXPOSE 5000

FROM base AS development-stage
ENV NODE_ENV=development
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
USER node
CMD ["pnpm", "run", "dev"]

FROM base AS production-stage
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
USER node
COPY . .
CMD ["pnpm", "run", "start"]
