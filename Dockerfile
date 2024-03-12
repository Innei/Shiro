FROM node:18-alpine AS base

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
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ENV BASE_URL=${BASE_URL}
ENV NEXT_PUBLIC_API_URL=${BASE_URL}/api/v2
ENV NEXT_PUBLIC_GATEWAY_URL=${BASE_URL}
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
ENV CLERK_SECRET_KEY=${CLERK_SECRET_KEY}

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

CMD echo "Mix Space Web [Shiro] Image." &&  node server.js;