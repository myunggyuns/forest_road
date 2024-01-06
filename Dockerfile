FROM node:16-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPN_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
COPY pnpm-lock.yaml /app/pnpm-lock.yaml 
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /dist
EXPOSE 8080

USER node

CMD ["node", "dist/main.js"]