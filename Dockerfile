FROM node:18-alpine AS base

FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY . .

RUN npm install -g pnpm
RUN pnpm install

FROM base AS builder

RUN apk update && apk add --no-cache git


WORKDIR /app
COPY --from=deps /app/ .
RUN npm install -g pnpm
RUN pnpm build

FROM base AS runner
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/server ./.next/server

EXPOSE 2323

CMD  node server.js;