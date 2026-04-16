import { shopsV2, type ShopV2, type ShopInventoryItemV2 } from "../data/shopDataV2";

export function restockShopInventoryItem(item: ShopInventoryItemV2, cycles = 1): ShopInventoryItemV2 {
  const safeCycles = Math.max(0, Math.floor(cycles));
  if (safeCycles === 0) {
    return item;
  }

  return {
    ...item,
    stock: Math.min(item.maxStock, item.stock + item.restockRate * safeCycles),
  };
}

export function restockShop(shop: ShopV2, cycles = 1): ShopV2 {
  return {
    ...shop,
    inventory: shop.inventory.map((item) => restockShopInventoryItem(item, cycles)),
  };
}

export function restockAllShops(cycles = 1): ShopV2[] {
  return shopsV2.map((shop) => restockShop(shop, cycles));
}
