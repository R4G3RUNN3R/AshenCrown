export type CurrencyBreakdown = {
  copper: number;
  silver: number;
  gold: number;
  platinum: number;
};

export const CURRENCY_CONVERSION = {
  copperPerSilver: 100,
  silverPerGold: 100,
  goldPerPlatinum: 100,
} as const;

export function copperValueFromBreakdown(currency: Partial<CurrencyBreakdown>): number {
  const copper = currency.copper ?? 0;
  const silver = currency.silver ?? 0;
  const gold = currency.gold ?? 0;
  const platinum = currency.platinum ?? 0;

  return copper
    + silver * CURRENCY_CONVERSION.copperPerSilver
    + gold * CURRENCY_CONVERSION.copperPerSilver * CURRENCY_CONVERSION.silverPerGold
    + platinum * CURRENCY_CONVERSION.copperPerSilver * CURRENCY_CONVERSION.silverPerGold * CURRENCY_CONVERSION.goldPerPlatinum;
}

export function breakdownFromCopperValue(totalCopper: number): CurrencyBreakdown {
  let remaining = Math.max(0, Math.floor(totalCopper));
  const platinumValue = CURRENCY_CONVERSION.copperPerSilver * CURRENCY_CONVERSION.silverPerGold * CURRENCY_CONVERSION.goldPerPlatinum;
  const goldValue = CURRENCY_CONVERSION.copperPerSilver * CURRENCY_CONVERSION.silverPerGold;
  const silverValue = CURRENCY_CONVERSION.copperPerSilver;

  const platinum = Math.floor(remaining / platinumValue);
  remaining -= platinum * platinumValue;

  const gold = Math.floor(remaining / goldValue);
  remaining -= gold * goldValue;

  const silver = Math.floor(remaining / silverValue);
  remaining -= silver * silverValue;

  const copper = remaining;

  return { copper, silver, gold, platinum };
}

export function formatCurrencyCompact(currency: Partial<CurrencyBreakdown>) {
  const normalized = breakdownFromCopperValue(copperValueFromBreakdown(currency));
  const parts: string[] = [];
  if (normalized.platinum) parts.push(`${normalized.platinum}p`);
  if (normalized.gold) parts.push(`${normalized.gold}g`);
  if (normalized.silver) parts.push(`${normalized.silver}s`);
  if (normalized.copper || parts.length === 0) parts.push(`${normalized.copper}c`);
  return parts.join(" ");
}

export function formatCurrencyLong(currency: Partial<CurrencyBreakdown>) {
  const normalized = breakdownFromCopperValue(copperValueFromBreakdown(currency));
  return `${normalized.platinum} platinum, ${normalized.gold} gold, ${normalized.silver} silver, ${normalized.copper} copper`;
}
