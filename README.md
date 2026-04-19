# Investors Playground Web

Vite + React + TypeScript web app for [Investors Playground](https://investorsplayground.com) — a paper trading platform where users practise investing without risking real money.

## Stack

- **Vite + React + TypeScript**
- **Tailwind CSS** (green brand, matching financial aesthetic)
- **AWS Amplify Gen 2** (backend: `investorsplaygroundbackend`)
- **notistack** for toast notifications
- **react-router-dom v6** for routing
- **lucide-react** for icons

---

## Setup

### 1. Install dependencies

```bash
cd investorsplaygroundweb
npm install
```

### 2. Generate Amplify outputs

The backend outputs file (`amplify_outputs.json`) must be generated from the backend project:

```bash
cd ../investorsplaygroundbackend
npx ampx generate outputs --branch main --out-dir ../investorsplaygroundweb
```

Or use the sandbox for local development:

```bash
cd ../investorsplaygroundbackend
npx ampx sandbox --outputs-out-dir ../investorsplaygroundweb
```

### 3. Configure environment variables

Copy the example file and fill in values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `VITE_APP_URL` | Public URL of the app, e.g. `https://www.investorsplayground.com` |
| `VITE_APP_NAME` | App display name (optional, defaults to `Investors Playground`) |

### 4. Start development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + Vite production build |
| `npm run preview` | Preview production build locally |
| `npm run ts-check` | TypeScript type check only |

---

## Pages & routes

| Route | Description |
|---|---|
| `/` | Landing page (public) |
| `/login` | Sign in |
| `/signup` | Create account |
| `/confirm` | Confirm email code |
| `/forgot-password` | Request password reset |
| `/reset-password` | Enter reset code + new password |
| `/dashboard` | Portfolio overview & holdings summary |
| `/portfolios` | Create and manage portfolios |
| `/holdings` | Buy/sell stocks, refresh prices, reset portfolio |
| `/account` | Subscription status, sign out |
| `/settings` | Default currency preference |

---

## Backend integration

All backend operations go through `src/lib/api.ts`:

- `client.mutations.initializeUserProfile` — called after signup confirmation
- `client.mutations.createPortfolio` — enforces free/pro limits server-side
- `client.mutations.buyHolding` — validates cash + holding limits
- `client.mutations.sellHolding` — partial or full sell, restores cash
- `client.mutations.resetPortfolio` — wipes holdings, restores starting cash
- `client.mutations.refreshPrices` — updates `currentPrice` on all holdings in a portfolio
- `client.queries.fetchPrice` — fetch live price for a single stock code
- `client.models.Portfolio.list` / `client.models.Holding.listByPortfolio` — data reads

**Free plan limits** are enforced by the Lambda functions in the backend. The frontend shows a `ProModal` when it receives `errorCode: "limit_reached"` — it never bypasses backend enforcement.

---

## Amplify Hosting deployment

The included `amplify.yml` configures frontend-only Amplify Hosting:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
```

**Important:** The backend is NOT deployed from this project. Deploy the backend separately from `investorsplaygroundbackend`, then generate outputs for this project as described above.

Set `VITE_APP_URL` in Amplify Console → Environment variables with your deployed domain.

For React Router routes such as `/dashboard`, add an Amplify Hosting rewrite rule:

| Source address | Target address | Type |
|---|---|---|
| `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|map|json)$)([^.]+$)/>` | `/index.html` | `200 (Rewrite)` |

The Amplify app should be connected to this `investorsplaygroundweb` repository only. Do not point this frontend app at `investorsplaygroundbackend` as a full-stack Amplify app unless you intentionally want backend deployment from that repo.

---

## Architecture notes

- Auth is handled entirely by Cognito (via `aws-amplify/auth`)
- After signup confirmation, `initializeUserProfile` Lambda creates the `UserProfile` record
- Owner-scoped DynamoDB auth means users only ever see their own portfolios and holdings
- P&L is computed client-side in `src/lib/api.ts → computeHoldingPnL`
- No backend P&L stored — live prices come from `fetchPrice` / `refreshPrices` mutations
# investorsplaygroundweb
