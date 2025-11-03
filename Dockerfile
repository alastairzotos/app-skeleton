FROM node:24-alpine as builder

WORKDIR /app

ARG SCOPE
ARG PORT
ARG TURBO_TOKEN

COPY . .
RUN yarn global add turbo@2.1.1 && \
    turbo prune --scope=${SCOPE} && \
    test -f apps/${SCOPE}/.env && cp apps/${SCOPE}/.env out/apps/${SCOPE}/.env || true && \
    cd out && \
    yarn --frozen-lockfile && \
    TURBO_TOKEN=${TURBO_TOKEN} turbo run build --filter=${SCOPE} && \
    rm -rf node_modules/.cache .yarn/cache

FROM node:24-alpine as app

ARG SCOPE
ARG PORT

ENV NODE_ENV=production

WORKDIR /app
COPY --chown=node:node --from=builder /app/out .

WORKDIR /app/apps/${SCOPE}

EXPOSE ${PORT}
CMD yarn start