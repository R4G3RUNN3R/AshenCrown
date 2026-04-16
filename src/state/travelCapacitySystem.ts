export const BASE_TRAVEL_GOODS_CAPACITY = 5;

export type TravelCapacityModifiers = {
  mountBonus?: number;
  vehicleBonus?: number;
  guildBonus?: number;
  consortiumBonus?: number;
};

export function getTravelGoodsCapacity(modifiers?: TravelCapacityModifiers) {
  return (
    BASE_TRAVEL_GOODS_CAPACITY +
    Math.max(0, modifiers?.mountBonus ?? 0) +
    Math.max(0, modifiers?.vehicleBonus ?? 0) +
    Math.max(0, modifiers?.guildBonus ?? 0) +
    Math.max(0, modifiers?.consortiumBonus ?? 0)
  );
}

export function canCarryTravelGoods(
  currentQuantity: number,
  incomingQuantity: number,
  modifiers?: TravelCapacityModifiers,
) {
  return currentQuantity + Math.max(0, incomingQuantity) <= getTravelGoodsCapacity(modifiers);
}
