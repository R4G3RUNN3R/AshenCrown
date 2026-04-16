import { addInventoryItem, type InventoryState } from "./inventorySystem";
import {
  applyShopPurchaseQuantity,
  canPurchaseShopQuantity,
  type ShopPurchaseWindow,
} from "./shopLimitSystem";
import {
  applyBlackMarketPurchaseQuantity,
  canPurchaseBlackMarketQuantity,
  type BlackMarketPurchaseWindow,
} from "./blackMarketLimitSystem";
import { canCarryTravelGoods, type TravelCapacityModifiers } from "./travelCapacitySystem";
import { getItemByIdV2 } from "../data/itemDataV2";
import { getShopByIdV2 } from "../data/shopDataV2";

export type ShopSystemState = {
  inventory: InventoryState;
  gold: number;
  standardShopWindow?: ShopPurchaseWindow;
  blackMarketWindow?: BlackMarketPurchaseWindow;
};

export type ShopPurchaseResult = {
  ok: boolean;
  reason?: string;
  nextState?: ShopSystemState;
  totalCostCopper?: number;
};

export function buyFromShop(
  state: ShopSystemState,
  shopId: string,
  itemId: string,
  quantity: number,
  options?: {
    currentTravelGoods?: number;
    travelCapacityModifiers?: TravelCapacityModifiers;
  },
): ShopPurchaseResult {
  const safeQuantity = Math.max(0, Math.floor(quantity));
  if (safeQuantity <= 0) {
    return { ok: false, reason: "Invalid quantity." };
  }

  const shop = getShopByIdV2(shopId);
  if (!shop) {
    return { ok: false, reason: "Shop not found." };
  }

  const shopItem = shop.inventory.find((entry) => entry.itemId === itemId);
  if (!shopItem) {
    return { ok: false, reason: "Item not sold here." };
  }

  if (shopItem.stock < safeQuantity) {
    return { ok: false, reason: "Insufficient shop stock." };
  }

  const item = getItemByIdV2(itemId);
  if (!item) {
    return { ok: false, reason: "Item data missing." };
  }

  if (shop.type === "black_market") {
    if (!canPurchaseBlackMarketQuantity(state.blackMarketWindow, safeQuantity)) {
      return { ok: false, reason: "Black market daily purchase limit reached." };
    }
  } else {
    if (!canPurchaseShopQuantity(state.standardShopWindow, safeQuantity)) {
      return { ok: false, reason: "Standard shop daily purchase limit reached." };
    }
  }

  if (item.isTravelGood) {
    const currentTravelGoods = options?.currentTravelGoods ?? 0;
    if (!canCarryTravelGoods(currentTravelGoods, safeQuantity, options?.travelCapacityModifiers)) {
      return { ok: false, reason: "Travel-goods carrying capacity exceeded." };
    }
  }

  const totalCostCopper = Math.ceil(item.baseValue * shopItem.priceMultiplier * safeQuantity);
  if (state.gold * 10000 < totalCostCopper) {
    return { ok: false, reason: "Insufficient funds." };
  }

  const nextInventory = addInventoryItem(state.inventory, itemId, safeQuantity);
  const nextGold = state.gold - totalCostCopper / 10000;

  const nextState: ShopSystemState = {
    ...state,
    inventory: nextInventory,
    gold: nextGold,
    standardShopWindow:
      shop.type === "black_market"
        ? state.standardShopWindow
        : applyShopPurchaseQuantity(state.standardShopWindow, safeQuantity),
    blackMarketWindow:
      shop.type === "black_market"
        ? applyBlackMarketPurchaseQuantity(state.blackMarketWindow, safeQuantity)
        : state.blackMarketWindow,
  };

  return {
    ok: true,
    nextState,
    totalCostCopper,
  };
}
