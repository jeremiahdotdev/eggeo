# Eggeo

Eggeo is migrating from a single Nuxt/Vue app into an incremental React and future React Native monorepo.

## Workspace

```text
apps/
  vue/        # existing Nuxt/Vue app, kept functional during migration
  web/        # new React web app shell, no PWA/service-worker layer

packages/
  api-client/
  config/
  db/
  domain/
  types/
  ui/
  utils/
  validation/
```

## Commands

```sh
pnpm install
pnpm --filter @eggeo/vue dev
pnpm --filter @eggeo/web dev
pnpm typecheck
pnpm --filter @eggeo/vue build
pnpm --filter @eggeo/web build
```

Prisma lives in `packages/db`. Generate the client with:

```sh
pnpm db:generate
```

The React web app intentionally does not include PWA tooling. Mobile functionality should land in the future Expo/React Native app instead of a web service-worker layer.

Legacy PWA service-worker generation in the Vue app is disabled by default while the migration is underway:

```sh
ENABLE_PWA=true pnpm --filter @eggeo/vue build
```
