# Eggeo

Eggeo is a React web and Expo mobile monorepo for geolocation-based egg hunts.

## Workspace

```text
apps/
  web/        # React web app
  mobile/     # Expo/React Native app

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
pnpm --filter @eggeo/web dev
pnpm --filter @eggeo/mobile start
pnpm typecheck
pnpm --filter @eggeo/web build
```

Prisma lives in `packages/db`. Generate the client with:

```sh
pnpm db:generate
```

The React web app intentionally does not include PWA tooling. Mobile functionality lives in the Expo/React Native app instead of a web service-worker layer.
