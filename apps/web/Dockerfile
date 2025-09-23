FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY . .

RUN yarn dlx turbo prune --docker --out-dir /build @plott-life/web

WORKDIR /build/full

RUN cp /build/yarn.lock ./
RUN yarn install --immutable

ARG MODE=production
ENV MODE=${ENV}
ENV NODE_ENV=production

RUN yarn build

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /build/full/node_modules ./node_modules
COPY --from=builder /build/full/apps/web/dist ./apps/web/dist

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

EXPOSE 4321

CMD ["node", "apps/web/dist/server/entry.mjs"]
