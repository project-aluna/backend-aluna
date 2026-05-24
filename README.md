# Aluna Backend

Backend service for Aluna routinely planner application built with Bun, ElysiaJS, Drizzle ORM, and MySQL.

## Prerequisites

- [Bun](https://bun.sh) (v1.x or higher)
- MySQL Database

## Setup & Installation

1. Install dependencies:
   ```bash
   bun install
   ```

2. Configure environment variables:
   Copy `.env.example` to `.env` and adjust the variables accordingly:
   ```bash
   cp .env.example .env
   ```

## Development

To start the development server with hot-reloading:
```bash
bun run dev
```

The server will start running on `http://localhost:3000`. You can verify it's working by opening `http://localhost:3000/health`.

## Scripts

- `bun run dev`: Start the server in watch/development mode.
- `bun run build`: Build/bundle the project into `./build/`.
- `bun start`: Run the built server bundle.
- `bun run db:generate`: Generate migrations via Drizzle Kit.
- `bun run db:push`: Push local schema to database via Drizzle Kit.
