export const DAILY_BLACK_MARKET_ITEM_LIMIT = 5;
export const BLACK_MARKET_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;

export type BlackMarketPurchaseWindow = {
  purchasedCount: number;
  windowStartedAt: number;
};

export function createBlackMarketPurchaseWindow(now = Date.now()): BlackMarketPurchaseWindow {
  return {
    purchasedCount: 0,
    windowStartedAt: now,
  };
}

export function normalizeBlackMarketPurchaseWindow(
  current: BlackMarketPurchaseWindow | null | undefined,
  now = Date.now(),
): BlackMarketPurchaseWindow {
  if (!current) {
    return createBlackMarketPurchaseWindow(now);
  }

  if (now - current.windowStartedAt >= BLACK_MARKET_LIMIT_WINDOW_MS) {
    return createBlackMarketPurchaseWindow(now);
  }

  return current;
}

export function getRemainingDailyBlackMarketPurchases(
  current: BlackMarketPurchaseWindow | null | undefined,
  now = Date.now(),
) {
  const normalized = normalizeBlackMarketPurchaseWindow(current, now);
  return Math.max(0, DAILY_BLACK_MARKET_ITEM_LIMIT - normalized.purchasedCount);
}

export function canPurchaseBlackMarketQuantity(
  current: BlackMarketPurchaseWindow | null | undefined,
  quantity: number,
  now = Date.now(),
) {
  return getRemainingDailyBlackMarketPurchases(current, now) >= Math.max(0, quantity);
}

export function applyBlackMarketPurchaseQuantity(
  current: BlackMarketPurchaseWindow | null | undefined,
  quantity: number,
  now = Date.now(),
): BlackMarketPurchaseWindow {
  const normalized = normalizeBlackMarketPurchaseWindow(current, now);
  return {
    ...normalized,
    purchasedCount: Math.min(DAILY_BLACK_MARKET_ITEM_LIMIT, normalized.purchasedCount + Math.max(0, quantity)),
  };
}
