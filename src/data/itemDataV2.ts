export type ItemCategory =
  | "consumable"
  | "weapon"
  | "armor"
  | "material"
  | "tool"
  | "trade_good"
  | "illicit"
  | "misc";

export type ItemRarity = "common" | "uncommon" | "rare" | "very_rare";

export type ItemSourceTag =
  | "shop"
  | "quest"
  | "adventure"
  | "guild_adventure"
  | "caravan_job"
  | "travel_discovery"
  | "travel_general_store"
  | "travel_arms_dealer"
  | "travel_black_market";

export type ItemV2 = {
  id: string;
  name: string;
  category: ItemCategory;
  description: string;
  baseValue: number; // copper value
  stackable: boolean;
  tradable: boolean;
  rarity: ItemRarity;
  isTravelGood?: boolean;
  isIllicit?: boolean;
  sourceTags: ItemSourceTag[];
};

export const itemsV2: ItemV2[] = [
  {
    id: "bread_loaf",
    name: "Loaf of Bread",
    category: "consumable",
    description: "Simple bread. Restores a small amount of energy.",
    baseValue: 50,
    stackable: true,
    tradable: true,
    rarity: "common",
    sourceTags: ["shop", "quest", "adventure"],
  },
  {
    id: "water_flask",
    name: "Water Flask",
    category: "consumable",
    description: "Clean drinking water.",
    baseValue: 25,
    stackable: true,
    tradable: true,
    rarity: "common",
    sourceTags: ["shop", "quest", "adventure"],
  },
  {
    id: "field_bandage",
    name: "Field Bandage",
    category: "consumable",
    description: "A simple medical wrap for minor wounds.",
    baseValue: 120,
    stackable: true,
    tradable: true,
    rarity: "common",
    sourceTags: ["shop", "quest", "guild_adventure"],
  },
  {
    id: "stamina_draught",
    name: "Stamina Draught",
    category: "consumable",
    description: "A bitter tonic that restores stamina for continued activity.",
    baseValue: 240,
    stackable: true,
    tradable: true,
    rarity: "uncommon",
    sourceTags: ["shop", "quest", "caravan_job"],
  },
  {
    id: "beer_mug",
    name: "Beer Mug",
    category: "consumable",
    description: "A cheap drink sold in bulk across taverns and stores.",
    baseValue: 90,
    stackable: true,
    tradable: true,
    rarity: "common",
    sourceTags: ["shop", "quest", "adventure"],
  },
  {
    id: "healing_herb",
    name: "Healing Herb",
    category: "material",
    description: "A common medicinal herb used in tonics and poultices.",
    baseValue: 70,
    stackable: true,
    tradable: true,
    rarity: "common",
    sourceTags: ["shop", "adventure", "travel_discovery"],
  },
  {
    id: "minor_potion",
    name: "Minor Potion",
    category: "consumable",
    description: "A simple restorative potion sold openly through legal channels.",
    baseValue: 180,
    stackable: true,
    tradable: true,
    rarity: "uncommon",
    sourceTags: ["shop", "quest"],
  },
  {
    id: "iron_sword",
    name: "Iron Sword",
    category: "weapon",
    description: "Standard issue iron blade.",
    baseValue: 5000,
    stackable: false,
    tradable: true,
    rarity: "common",
    sourceTags: ["shop", "adventure", "travel_arms_dealer"],
  },
  {
    id: "leather_armor",
    name: "Leather Armor",
    category: "armor",
    description: "Basic protective gear.",
    baseValue: 3500,
    stackable: false,
    tradable: true,
    rarity: "common",
    sourceTags: ["shop", "adventure", "travel_arms_dealer"],
  },
  {
    id: "timber_bundle",
    name: "Timber Bundle",
    category: "material",
    description: "Processed wood used for construction.",
    baseValue: 800,
    stackable: true,
    tradable: true,
    rarity: "common",
    sourceTags: ["shop", "caravan_job", "adventure"],
  },
  {
    id: "iron_ingot",
    name: "Iron Ingot",
    category: "material",
    description: "Refined iron for crafting.",
    baseValue: 1200,
    stackable: true,
    tradable: true,
    rarity: "common",
    sourceTags: ["shop", "caravan_job", "adventure"],
  },
  {
    id: "amber_spice",
    name: "Amber Spice",
    category: "trade_good",
    description: "A sought-after imported spice that sells best to players back in Nexis.",
    baseValue: 900,
    stackable: true,
    tradable: true,
    rarity: "uncommon",
    isTravelGood: true,
    sourceTags: ["travel_general_store"],
  },
  {
    id: "silk_bloom_tea",
    name: "Silk Bloom Tea",
    category: "trade_good",
    description: "A fragrant imported tea favored by collectors and merchants.",
    baseValue: 1150,
    stackable: true,
    tradable: true,
    rarity: "uncommon",
    isTravelGood: true,
    sourceTags: ["travel_general_store"],
  },
  {
    id: "smoked_skyfish",
    name: "Smoked Skyfish",
    category: "trade_good",
    description: "A preserved delicacy from distant trade routes.",
    baseValue: 1500,
    stackable: true,
    tradable: true,
    rarity: "uncommon",
    isTravelGood: true,
    sourceTags: ["travel_general_store", "caravan_job"],
  },
  {
    id: "ember_dust",
    name: "Ember Dust",
    category: "illicit",
    description: "A restricted alchemical powder sold through black markets.",
    baseValue: 4200,
    stackable: true,
    tradable: true,
    rarity: "rare",
    isTravelGood: true,
    isIllicit: true,
    sourceTags: ["travel_black_market"],
  },
  {
    id: "shadow_bloom_extract",
    name: "Shadow Bloom Extract",
    category: "illicit",
    description: "A contraband extract prized by smugglers and shady buyers.",
    baseValue: 5600,
    stackable: true,
    tradable: true,
    rarity: "rare",
    isTravelGood: true,
    isIllicit: true,
    sourceTags: ["travel_black_market"],
  },
  {
    id: "forged_waypass",
    name: "Forged Waypass",
    category: "illicit",
    description: "A falsified travel permit with obvious legal implications.",
    baseValue: 6800,
    stackable: true,
    tradable: true,
    rarity: "very_rare",
    isTravelGood: true,
    isIllicit: true,
    sourceTags: ["travel_black_market", "quest"],
  },
  {
    id: "smuggled_sigil_case",
    name: "Smuggled Sigil Case",
    category: "illicit",
    description: "An illegal sigil container used for moving restricted arcane markings.",
    baseValue: 7200,
    stackable: true,
    tradable: true,
    rarity: "very_rare",
    isTravelGood: true,
    isIllicit: true,
    sourceTags: ["travel_black_market"],
  }
];

export function getItemByIdV2(id: string) {
  return itemsV2.find((item) => item.id === id);
}

export function getTravelGoodsV2() {
  return itemsV2.filter((item) => item.isTravelGood);
}

export function getIllicitGoodsV2() {
  return itemsV2.filter((item) => item.isIllicit);
}
