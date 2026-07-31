# Nexora

Nexora is a fullstack crypto trading platform built with Next.js. It connects to real exchange APIs (starting with Binance) for balances, orders, and market data, while streaming public ticker and order book updates over WebSockets.

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui**
- **Better Auth** (email/password sessions)
- **Neon PostgreSQL** + **Drizzle ORM**
- **CCXT** (server-side exchange integration)
- **TanStack Query** + **Zustand**
- **TradingView Lightweight Charts**
- **Binance public WebSockets** (client-side market data)

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Random secret (32+ characters) |
| `BETTER_AUTH_URL` | App URL for auth callbacks |
| `ENCRYPTION_KEY` | 64-character hex string (32 bytes) |
| `NEXT_PUBLIC_APP_URL` | Public app URL |

Generate an encryption key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Set up the database

Create a Neon project at [neon.tech](https://neon.tech), copy the connection string into `DATABASE_URL`, then push the schema:

```bash
pnpm db:push
```

### 4. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login & register
│   ├── (dashboard)/     # Protected trading UI
│   └── api/             # Auth + exchange + market routes
├── components/
│   ├── layout/          # Sidebar, header, shell
│   ├── trading/         # Chart, order book, order form
│   └── ui/              # shadcn primitives
├── hooks/               # WebSocket market data hooks
├── lib/
│   ├── auth/            # Better Auth config
│   ├── db/              # Drizzle schema + client
│   ├── exchange/        # CCXT + encryption
│   └── websocket/       # Binance WebSocket manager
└── stores/              # Zustand trading UI state
```

## Features (Phase 1)

- User registration and login with protected routes
- Live BTC/USDT (and other pairs) ticker + order book via Binance WebSocket
- Candlestick chart with historical OHLCV data
- Encrypted Binance API key storage in PostgreSQL
- Server-side CCXT integration for balances, orders, and order placement
- Trading terminal UI shell with buy/sell form and confirmation modal
- Settings page to connect/disconnect exchange accounts

## Deploy on Vercel

1. Push the repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Deploy

Vercel will run `next build` automatically. Run `pnpm db:push` against your production Neon database before first use.

## Security Notes

- Exchange API keys are encrypted at rest with AES-256-GCM
- CCXT calls run only on the server — keys never reach the client
- All `/api/exchange/*` routes require authentication
- Public market data uses Binance public streams (no keys required)

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm db:push` | Push Drizzle schema to database |
| `pnpm db:generate` | Generate SQL migrations |
| `pnpm db:studio` | Open Drizzle Studio |

## Next Steps

- Trade history and fill notifications
- Multi-exchange support beyond Binance
- Advanced order types (OCO, trailing stop)
- Rate limiting with Upstash Redis
- Portfolio analytics and P&L tracking
