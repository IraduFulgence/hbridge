# HBridge

Closed-loop chronic-care and mental-health engine for community health workers
in Rwanda.

## Prerequisites

- Node.js 20 or newer
- pnpm 12 or newer
- Docker and Docker Compose

The repository pins pnpm through `packageManager` in the root
`package.json`.

## Install

Run from the repository root:

```bash
pnpm install
```

The API reads environment variables from `apps/api/.env`. Create a local
environment file from the template:

```bash
cp apps/api/.env.example apps/api/.env
```

For the Docker database supplied by this repository, set this value in
`apps/api/.env`:

```dotenv
DATABASE_URL=postgresql://hbridge:Myhandle12@localhost:5433/hbridge_db
```

The API defaults to port `3001`. Optional configuration includes `API_PORT`,
`REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, JWT settings, and Africa's
Talking settings (`AT_USERNAME`, `AT_API_KEY`, and `AT_SENDER_ID`).

## Start Infrastructure

Run from the repository root:

```bash
pnpm db:up
pnpm db:logs
pnpm db:down
```

The Docker services expose:

- PostgreSQL/TimescaleDB: `localhost:5433`
- Redis: `localhost:6379`
- pgAdmin: <http://localhost:5050>

pgAdmin credentials are `admin@hbridge.rw` / `admin`.

## Database Commands

The API workspace is named `api`, so use `--filter api` for Prisma commands:

```bash
pnpm --filter api prisma generate
pnpm --filter api prisma migrate dev
pnpm --filter api prisma migrate deploy
pnpm --filter api prisma migrate reset --force
pnpm --filter api prisma studio
pnpm --filter api prisma db seed
pnpm --filter api contract:emit
```

`migrate reset --force` deletes local database data. No seed script is
currently configured, so `prisma db seed` will only work after one is added.

The root `db:migrate`, `db:generate`, `db:seed`, `db:studio`, and `db:reset`
shortcuts currently reference the old `@hbridge/api` package name. Use the
explicit commands above until those filters are updated.

## Development

Run all workspace development tasks from the repository root:

```bash
pnpm dev
```

Run only the API from the repository root:

```bash
pnpm --filter api start
pnpm --filter api start:dev
pnpm --filter api start:debug
```

The API is available at <http://localhost:3001> and uses the global `/api/v1`
prefix. The health endpoint is:

<http://localhost:3001/api/v1/health>

## Build and Production Start

```bash
pnpm build
pnpm --filter api deploy
pnpm --filter api start:prod
```

`deploy` runs the Nest deployment command. `start:prod` requires a successful
build first.

## Tests, Linting, and Formatting

Run workspace tests and linting from the repository root:

```bash
pnpm test
pnpm lint
```

Run API-specific checks:

```bash
pnpm --filter api test
pnpm --filter api test:watch
pnpm --filter api test:cov
pnpm --filter api test:debug
pnpm --filter api test:e2e
pnpm --filter api lint
pnpm --filter api format
```

## Maintenance

```bash
pnpm clean
```

This removes Turbo outputs and the root `node_modules` directory. Run
`pnpm install` again afterward.