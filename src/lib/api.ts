/**
 * Typed Amplify Data client for Investors Playground.
 * Uses explicit casts rather than importing the Schema type to avoid
 * backend/frontend type-drift issues.
 */
import { generateClient } from 'aws-amplify/data';

/* eslint-disable @typescript-eslint/no-explicit-any */
const _client = generateClient();

// ── Domain types ─────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  owner?: string | null;
  email: string;
  subscriptionStatus: string;
  subscriptionEndDate?: string | null;
  subscriptionProvider?: string | null;
  subscriptionProductId?: string | null;
  revenueCatAppUserId?: string | null;
  currency: string;
  activePortfolioId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface Portfolio {
  id: string;
  owner?: string | null;
  name: string;
  cash: number;
  startingCash: number;
  currency: string;
  currentDay?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface Holding {
  id: string;
  owner?: string | null;
  portfolioId: string;
  code: string;
  buyPrice: number;
  quantity: number;
  currentPrice?: number | null;
  priceCurrency: string;
  purchasedOn: string;
  volatility?: number | null;
  momentumBias?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface HoldingWithPnL extends Holding {
  currentValue: number;
  cost: number;
  gainLoss: number;
  gainLossPct: number;
  daysHeld: number;
}

export interface PortfolioStats {
  totalValue: number;
  holdingsValue: number;
  cash: number;
  gainLoss: number;
  gainLossPct: number;
  holdingCount: number;
}

export function isPro(profile: Pick<UserProfile, 'subscriptionStatus'>): boolean {
  return profile.subscriptionStatus === 'active';
}

export function computeHoldingPnL(h: Holding): HoldingWithPnL {
  const price = h.currentPrice ?? h.buyPrice;
  const currentValue = price * h.quantity;
  const cost = h.buyPrice * h.quantity;
  const gainLoss = currentValue - cost;
  const gainLossPct = cost > 0 ? (gainLoss / cost) * 100 : 0;
  const daysHeld = Math.floor((Date.now() - new Date(h.purchasedOn).getTime()) / 86_400_000);
  return { ...h, currentValue, cost, gainLoss, gainLossPct, daysHeld };
}

export function computePortfolioStats(portfolio: Portfolio, holdings: Holding[]): PortfolioStats {
  const withPnL = holdings.map(computeHoldingPnL);
  const holdingsValue = withPnL.reduce((s, h) => s + h.currentValue, 0);
  const totalValue = portfolio.cash + holdingsValue;
  const totalCost = withPnL.reduce((s, h) => s + h.cost, 0);
  const gainLoss = holdingsValue - totalCost;
  const gainLossPct = portfolio.startingCash > 0
    ? ((totalValue - portfolio.startingCash) / portfolio.startingCash) * 100
    : 0;
  return {
    totalValue,
    holdingsValue,
    cash: portfolio.cash,
    gainLoss,
    gainLossPct,
    holdingCount: holdings.length,
  };
}

// ── Result helpers ────────────────────────────────────────────────────────────

type ListResult<T> = { data: T[] | null };
type ItemResult<T> = { data: T | null };

// ── Typed client ─────────────────────────────────────────────────────────────

const models = {
  UserProfile: {
    list: () => (_client as any).models.UserProfile.list() as Promise<ListResult<UserProfile>>,
    update: (input: Partial<UserProfile> & { id: string }) =>
      (_client as any).models.UserProfile.update(input) as Promise<ItemResult<UserProfile>>,
    delete: (input: { id: string }) =>
      (_client as any).models.UserProfile.delete(input) as Promise<ItemResult<UserProfile>>,
  },
  Portfolio: {
    list: () => (_client as any).models.Portfolio.list() as Promise<ListResult<Portfolio>>,
    delete: (input: { id: string }) =>
      (_client as any).models.Portfolio.delete(input) as Promise<ItemResult<Portfolio>>,
  },
  Holding: {
    list: () => (_client as any).models.Holding.list() as Promise<ListResult<Holding>>,
    listByPortfolio: (portfolioId: string) =>
      (_client as any).models.Holding.listHoldingByPortfolioId({ portfolioId }) as Promise<ListResult<Holding>>,
    delete: (input: { id: string }) =>
      (_client as any).models.Holding.delete(input) as Promise<ItemResult<Holding>>,
  },
};

const mutations = {
  initializeUserProfile: (args: { email: string; currency?: string }) =>
    (_client as any).mutations.initializeUserProfile(args) as Promise<{
      data: { id: string | null; subscriptionStatus: string | null; currency: string | null; error: string | null } | null;
    }>,
  createPortfolio: (args: { name?: string; currency?: string; startingCash?: number }) =>
    (_client as any).mutations.createPortfolioWithLimits(args) as Promise<{
      data: { id: string | null; error: string | null; errorCode: string | null } | null;
    }>,
  buyHolding: (args: {
    portfolioId: string;
    code: string;
    buyPrice: number;
    quantity: number;
    purchasedOn?: string;
    volatility?: number;
    momentumBias?: number;
  }) =>
    (_client as any).mutations.buyHolding(args) as Promise<{
      data: { id: string | null; error: string | null; errorCode: string | null } | null;
    }>,
  sellHolding: (args: { holdingId: string; quantity?: number }) =>
    (_client as any).mutations.sellHolding(args) as Promise<{
      data: { ok: boolean | null; cashRestored: number | null; gainLossPct: number | null; error: string | null } | null;
    }>,
  resetPortfolio: (args: { portfolioId: string }) =>
    (_client as any).mutations.resetPortfolio(args) as Promise<{
      data: { ok: boolean | null; error: string | null } | null;
    }>,
  refreshPrices: (args: { portfolioId: string }) =>
    (_client as any).mutations.refreshPrices(args) as Promise<{
      data: { ok: boolean | null; updatedCount: number | null; error: string | null } | null;
    }>,
};

const queries = {
  fetchPrice: (args: { code: string }) =>
    (_client as any).queries.fetchPrice(args) as Promise<{
      data: { code: string | null; price: number | null; currency: string | null; cached: boolean | null; error: string | null } | null;
    }>,
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export const client = { models, mutations, queries };
