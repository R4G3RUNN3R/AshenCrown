import { getConsortiumEffectsById } from "../data/consortiumEffectData";
import type { TravelCapacityModifiers } from "./travelCapacitySystem";

export function getConsortiumTravelCapacityModifiers(consortiumId?: string | null): TravelCapacityModifiers {
  if (!consortiumId) {
    return {};
  }

  const effects = getConsortiumEffectsById(consortiumId);
  return {
    consortiumBonus: effects.travelGoodsCapacityBonus ?? 0,
  };
}

export function getConsortiumTradeMarginBonus(consortiumId?: string | null) {
  if (!consortiumId) {
    return 0;
  }

  return getConsortiumEffectsById(consortiumId).standardTradeMarginBonus ?? 0;
}

export function getConsortiumCaravanLossReduction(consortiumId?: string | null) {
  if (!consortiumId) {
    return 0;
  }

  return getConsortiumEffectsById(consortiumId).caravanLossReduction ?? 0;
}

export function getConsortiumIllicitHandlingBonus(consortiumId?: string | null) {
  if (!consortiumId) {
    return 0;
  }

  return getConsortiumEffectsById(consortiumId).illicitHandlingBonus ?? 0;
}
