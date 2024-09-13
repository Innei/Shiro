FROM node:18-alpine AS base

RUN npm install -g --arch=x64 --platform=linux sharp

FROM base AS deps

RUN apk add --no-cache libc6-compat
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY . .

RUN npm install -g pnpm
RUN pnpm install

FROM base AS builder

RUN apk update && apk add --no-cache git

WORKDIR /app
COPY --from=deps /app/ .
RUN npm install -g pnpm

ENV NODE_ENV production
ARG BASE_URL

ARG S3_ACCESS_KEY
ARG S3_SECRET_KEY
ARG WEBHOOK_SECRET
ARG TMDB_API_KEY
ARG GH_TOKEN
ENV BASE_URL=${BASE_URL}
ENV NEXT_PUBLIC_API_URL=${BASE_URL}/api/v2
ENV NEXT_PUBLIC_GATEWAY_URL=${BASE_URL}

ENV S3_ACCESS_KEY=${S3_ACCESS_KEY}
ENV S3_SECRET_KEY=${S3_SECRET_KEY}
ENV TMDB_API_KEY=${TMDB_API_KEY}
ENV WEBHOOK_SECRET=${WEBHOOK_SECRET}
ENV GH_TOKEN=${GH_TOKEN}

RUN pnpm build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# and other docker env inject
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/server ./.next/server

EXPOSE 2323

ENV PORT 2323
ENV NEXT_SHARP_PATH=/usr/local/lib/node_modules/sharp
CMD echo "Mix Space Web [Shiro] Image." && node server.js
