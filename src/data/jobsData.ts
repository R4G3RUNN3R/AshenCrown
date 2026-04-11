// ─────────────────────────────────────────────────────────────────────────────
// Nexis — Jobs Data
// Fantasy jobs with loot tables aligned to the live item catalogue.
// ─────────────────────────────────────────────────────────────────────────────

export type JobOutcome = "success" | "fail" | "criticalFail";
export type ConsequenceType = "none" | "hospital" | "jail";

export type ItemDrop = {
  itemId: string;
  itemName: string;
  dropChance: number;
  minQty: number;
  maxQty: number;
};

export type SubJob = {
  id: string;
  name: string;
  description: string;
  staminaCost: number;
  cooldownMs: number;
  baseGoldMin: number;
  baseGoldMax: number;
  xpPerSuccess: number;
  baseFailChance: number;
  baseCritFailChance: number;
  critConsequence: ConsequenceType;
  critHospitalMinutes?: number;
  critJailMinutes?: number;
  critFlavorText: string;
  itemDrops: ItemDrop[];
  primaryStat: "strength" | "dexterity" | "intelligence" | "endurance" | "charisma";
};

export type JobCategory = {
  id: string;
  name: string;
  icon: string;
  description: string;
  theme: string;
  isIllegal: boolean;
  subJobs: SubJob[];
};

const beginnerAdventurer: JobCategory = {
  id: "beginner_adventurer",
  name: "Beginner Adventurer",
  icon: "🗡️",
  description:
    "Entry-level fieldwork for those just starting out. Low risk, modest coin, and a solid source of practical materials.",
  theme: "Gather, explore, survive",
  isIllegal: false,
  subJobs: [
    {
      id: "gather_herbs",
      name: "Gather Herbs",
      description: "Pick wild herbs from the outskirts and sort the useful from the poisonous.",
      staminaCost: 3,
      cooldownMs: 0,
      baseGoldMin: 5,
      baseGoldMax: 15,
      xpPerSuccess: 12,
      baseFailChance: 0.25,
      baseCritFailChance: 0.02,
      critConsequence: "hospital",
      critHospitalMinutes: 5,
      critFlavorText: "You grabbed the wrong plant. Your hands burn and your vision swims.",
      primaryStat: "intelligence",
      itemDrops: [
        { itemId: "wild_herb", itemName: "Wild Herb", dropChance: 0.42, minQty: 1, maxQty: 3 },
        { itemId: "medicinal_herb", itemName: "Medicinal Herb", dropChance: 0.18, minQty: 1, maxQty: 2 },
        { itemId: "healing_root", itemName: "Healing Root", dropChance: 0.05, minQty: 1, maxQty: 1 },
      ],
    },
    {
      id: "collect_firewood",
      name: "Collect Firewood",
      description: "Split timber from the managed forest and bundle the good pieces.",
      staminaCost: 4,
      cooldownMs: 0,
      baseGoldMin: 8,
      baseGoldMax: 20,
      xpPerSuccess: 16,
      baseFailChance: 0.20,
      baseCritFailChance: 0.03,
      critConsequence: "hospital",
      critHospitalMinutes: 10,
      critFlavorText: "A dead branch swings loose and smashes across your shoulder.",
      primaryStat: "strength",
      itemDrops: [
        { itemId: "rough_wood", itemName: "Rough Wood", dropChance: 0.36, minQty: 1, maxQty: 4 },
        { itemId: "hardwood", itemName: "Hardwood", dropChance: 0.12, minQty: 1, maxQty: 2 },
        { itemId: "bent_nails", itemName: "Bent Nails", dropChance: 0.08, minQty: 1, maxQty: 3 },
      ],
    },
    {
      id: "mine_ore",
      name: "Mine Ore",
      description: "Work the shallow shafts for iron, coal, and anything salvageable.",
      staminaCost: 5,
      cooldownMs: 0,
      baseGoldMin: 10,
      baseGoldMax: 25,
      xpPerSuccess: 20,
      baseFailChance: 0.25,
      baseCritFailChance: 0.04,
      critConsequence: "hospital",
      critHospitalMinutes: 15,
      critFlavorText: "The tunnel groans and stone gives way around you.",
      primaryStat: "endurance",
      itemDrops: [
        { itemId: "iron_ore", itemName: "Iron Ore", dropChance: 0.30, minQty: 1, maxQty: 3 },
        { itemId: "coal", itemName: "Coal", dropChance: 0.18, minQty: 1, maxQty: 2 },
        { itemId: "scrap_metal", itemName: "Scrap Metal", dropChance: 0.20, minQty: 1, maxQty: 3 },
        { itemId: "stone_block", itemName: "Stone Block", dropChance: 0.10, minQty: 1, maxQty: 2 },
      ],
    },
    {
      id: "hunt_small_game",
      name: "Hunt Small Game",
      description: "Track rabbits, foxes, and other small animals along the tree line.",
      staminaCost: 4,
      cooldownMs: 0,
      baseGoldMin: 8,
      baseGoldMax: 18,
      xpPerSuccess: 14,
      baseFailChance: 0.30,
      baseCritFailChance: 0.02,
      critConsequence: "hospital",
      critHospitalMinutes: 5,
      critFlavorText: "Your prey bites back and your hand pays for it.",
      primaryStat: "dexterity",
      itemDrops: [
        { itemId: "leather_strip", itemName: "Leather Strip", dropChance: 0.28, minQty: 1, maxQty: 3 },
        { itemId: "rope", itemName: "Rope", dropChance: 0.14, minQty: 1, maxQty: 2 },
        { itemId: "torn_cloak", itemName: "Torn Cloak", dropChance: 0.05, minQty: 1, maxQty: 1 },
      ],
    },
    {
      id: "search_for_treasure",
      name: "Search for Treasure",
      description: "Comb old ruins and collapsed shrines for relics worth selling or keeping.",
      staminaCost: 6,
      cooldownMs: 0,
      baseGoldMin: 15,
      baseGoldMax: 40,
      xpPerSuccess: 25,
      baseFailChance: 0.35,
      baseCritFailChance: 0.05,
      critConsequence: "hospital",
      critHospitalMinutes: 10,
      critFlavorText: "The floor collapses and you vanish into old stone and dust.",
      primaryStat: "intelligence",
      itemDrops: [
        { itemId: "ancient_fragment", itemName: "Ancient Fragment", dropChance: 0.12, minQty: 1, maxQty: 2 },
        { itemId: "torn_map", itemName: "Tattered Map", dropChance: 0.08, minQty: 1, maxQty: 1 },
        { itemId: "runed_stone", itemName: "Runed Stone", dropChance: 0.03, minQty: 1, maxQty: 1 },
        { itemId: "foundation_keystone", itemName: "Foundation Keystone", dropChance: 0.01, minQty: 1, maxQty: 1 },
      ],
    },
  ],
};

const thievery: JobCategory = {
  id: "thievery",
  name: "Thievery",
  icon: "🗝️",
  description:
    "Quick fingers, quiet feet, and the constant possibility of getting caught.",
  theme: "Quick fingers, quiet feet",
  isIllegal: true,
  subJobs: [
    {
      id: "pickpocket",
      name: "Pickpocket",
      description: "Lift coin and loose valuables from distracted targets.",
      staminaCost: 4,
      cooldownMs: 0,
      baseGoldMin: 15,
      baseGoldMax: 35,
      xpPerSuccess: 18,
      baseFailChance: 0.30,
      baseCritFailChance: 0.08,
      critConsequence: "jail",
      critJailMinutes: 15,
      critFlavorText: "A guard catches your wrist mid-lift.",
      primaryStat: "dexterity",
      itemDrops: [
        { itemId: "stolen_coin", itemName: "Stolen Coin", dropChance: 0.30, minQty: 1, maxQty: 3 },
        { itemId: "lockpick", itemName: "Lockpick", dropChance: 0.08, minQty: 1, maxQty: 1 },
      ],
    },
    {
      id: "lockpick_chest",
      name: "Lockpick a Chest",
      description: "Crack a strongbox before anyone notices.",
      staminaCost: 6,
      cooldownMs: 0,
      baseGoldMin: 25,
      baseGoldMax: 60,
      xpPerSuccess: 28,
      baseFailChance: 0.35,
      baseCritFailChance: 0.07,
      critConsequence: "jail",
      critJailMinutes: 20,
      critFlavorText: "The lock was trapped and the whole street hears it.",
      primaryStat: "dexterity",
      itemDrops: [
        { itemId: "rare_gemstone", itemName: "Rare Gemstone", dropChance: 0.06, minQty: 1, maxQty: 1 },
        { itemId: "scrap_metal", itemName: "Scrap Metal", dropChance: 0.10, minQty: 1, maxQty: 2 },
        { itemId: "black_market_ledger", itemName: "Black Market Ledger", dropChance: 0.01, minQty: 1, maxQty: 1 },
      ],
    },
    {
      id: "rob_a_stall",
      name: "Rob a Stall",
      description: "Snatch goods from an unattended market stall and vanish.",
      staminaCost: 5,
      cooldownMs: 0,
      baseGoldMin: 20,
      baseGoldMax: 45,
      xpPerSuccess: 22,
      baseFailChance: 0.30,
      baseCritFailChance: 0.10,
      critConsequence: "jail",
      critJailMinutes: 25,
      critFlavorText: "The stallkeeper returns early and the guard answers fast.",
      primaryStat: "dexterity",
      itemDrops: [
        { itemId: "rations", itemName: "Rations", dropChance: 0.18, minQty: 1, maxQty: 3 },
        { itemId: "vial_of_ink", itemName: "Vial of Ink", dropChance: 0.10, minQty: 1, maxQty: 2 },
        { itemId: "wax_seal", itemName: "Wax Seal", dropChance: 0.08, minQty: 1, maxQty: 2 },
      ],
    },
    {
      id: "forge_a_signet",
      name: "Forge a Signet",
      description: "Replicate a noble seal and pass counterfeit credentials.",
      staminaCost: 8,
      cooldownMs: 0,
      baseGoldMin: 40,
      baseGoldMax: 80,
      xpPerSuccess: 38,
      baseFailChance: 0.40,
      baseCritFailChance: 0.08,
      critConsequence: "jail",
      critJailMinutes: 30,
      critFlavorText: "A court scribe spots the fraud instantly.",
      primaryStat: "intelligence",
      itemDrops: [
        { itemId: "forged_document", itemName: "Forged Document", dropChance: 0.15, minQty: 1, maxQty: 2 },
        { itemId: "wax_seal", itemName: "Wax Seal", dropChance: 0.10, minQty: 1, maxQty: 2 },
      ],
    },
  ],
};

const courier: JobCategory = {
  id: "courier",
  name: "Courier",
  icon: "📜",
  description:
    "Fast feet, steady hands, and the occasional package you should not ask about.",
  theme: "Fast legs, steady nerves",
  isIllegal: false,
  subJobs: [
    {
      id: "deliver_a_letter",
      name: "Deliver a Letter",
      description: "Carry a sealed message across town quickly and intact.",
      staminaCost: 3,
      cooldownMs: 0,
      baseGoldMin: 10,
      baseGoldMax: 20,
      xpPerSuccess: 12,
      baseFailChance: 0.20,
      baseCritFailChance: 0.02,
      critConsequence: "hospital",
      critHospitalMinutes: 5,
      critFlavorText: "You trip on the cobbles at a full sprint.",
      primaryStat: "endurance",
      itemDrops: [
        { itemId: "rations", itemName: "Rations", dropChance: 0.10, minQty: 1, maxQty: 2 },
      ],
    },
    {
      id: "smuggle_herbs",
      name: "Smuggle Herbs",
      description: "Carry a restricted satchel of herbs through the checkpoint unnoticed.",
      staminaCost: 5,
      cooldownMs: 0,
      baseGoldMin: 20,
      baseGoldMax: 40,
      xpPerSuccess: 22,
      baseFailChance: 0.30,
      baseCritFailChance: 0.06,
      critConsequence: "hospital",
      critHospitalMinutes: 10,
      critFlavorText: "Bandits knew what you were carrying and took issue with it.",
      primaryStat: "charisma",
      itemDrops: [
        { itemId: "medicinal_herb", itemName: "Medicinal Herb", dropChance: 0.14, minQty: 1, maxQty: 3 },
        { itemId: "healing_root", itemName: "Healing Root", dropChance: 0.06, minQty: 1, maxQty: 2 },
        { itemId: "alchemical_powder", itemName: "Alchemical Powder", dropChance: 0.03, minQty: 1, maxQty: 1 },
      ],
    },
    {
      id: "escort_cargo",
      name: "Escort Cargo",
      description: "Guard a merchant wagon from warehouse to market.",
      staminaCost: 6,
      cooldownMs: 0,
      baseGoldMin: 25,
      baseGoldMax: 50,
      xpPerSuccess: 26,
      baseFailChance: 0.25,
      baseCritFailChance: 0.05,
      critConsequence: "hospital",
      critHospitalMinutes: 15,
      critFlavorText: "The wagon overturns and you go down with it.",
      primaryStat: "strength",
      itemDrops: [
        { itemId: "iron_ore", itemName: "Iron Ore", dropChance: 0.10, minQty: 1, maxQty: 3 },
        { itemId: "hardwood", itemName: "Hardwood", dropChance: 0.10, minQty: 1, maxQty: 2 },
        { itemId: "cracked_lantern", itemName: "Cracked Lantern", dropChance: 0.05, minQty: 1, maxQty: 1 },
      ],
    },
    {
      id: "cross_border_run",
      name: "Cross-Border Run",
      description: "Deliver a sealed parcel to a contact beyond the outer patrol line.",
      staminaCost: 8,
      cooldownMs: 0,
      baseGoldMin: 35,
      baseGoldMax: 70,
      xpPerSuccess: 34,
      baseFailChance: 0.35,
      baseCritFailChance: 0.07,
      critConsequence: "hospital",
      critHospitalMinutes: 20,
      critFlavorText: "Border patrol questions you until fists replace questions.",
      primaryStat: "endurance",
      itemDrops: [
        { itemId: "ancient_fragment", itemName: "Ancient Fragment", dropChance: 0.06, minQty: 1, maxQty: 1 },
        { itemId: "mana_crystal", itemName: "Mana Crystal", dropChance: 0.02, minQty: 1, maxQty: 1 },
      ],
    },
  ],
};

const labor: JobCategory = {
  id: "labor",
  name: "Labor",
  icon: "⚒️",
  description:
    "Honest muscle-work that keeps Nexis standing one stone at a time.",
  theme: "Sweat, stone, and timber",
  isIllegal: false,
  subJobs: [
    {
      id: "haul_stone",
      name: "Haul Stone",
      description: "Move heavy building blocks from quarry cart to construction yard.",
      staminaCost: 5,
      cooldownMs: 0,
      baseGoldMin: 12,
      baseGoldMax: 25,
      xpPerSuccess: 18,
      baseFailChance: 0.15,
      baseCritFailChance: 0.03,
      critConsequence: "hospital",
      critHospitalMinutes: 10,
      critFlavorText: "A block slips loose and crushes your foot.",
      primaryStat: "strength",
      itemDrops: [
        { itemId: "stone_block", itemName: "Stone Block", dropChance: 0.26, minQty: 1, maxQty: 3 },
        { itemId: "clay", itemName: "Clay", dropChance: 0.18, minQty: 1, maxQty: 3 },
      ],
    },
    {
      id: "dig_a_trench",
      name: "Dig a Trench",
      description: "Excavation work for drainage and foundations.",
      staminaCost: 4,
      cooldownMs: 0,
      baseGoldMin: 10,
      baseGoldMax: 22,
      xpPerSuccess: 16,
      baseFailChance: 0.15,
      baseCritFailChance: 0.02,
      critConsequence: "hospital",
      critHospitalMinutes: 5,
      critFlavorText: "Your shovel snaps and the handle cracks across your face.",
      primaryStat: "endurance",
      itemDrops: [
        { itemId: "clay", itemName: "Clay", dropChance: 0.24, minQty: 1, maxQty: 3 },
        { itemId: "scrap_metal", itemName: "Scrap Metal", dropChance: 0.10, minQty: 1, maxQty: 2 },
      ],
    },
    {
      id: "fell_timber",
      name: "Fell Timber",
      description: "Professional lumberjack work in the managed forest.",
      staminaCost: 5,
      cooldownMs: 0,
      baseGoldMin: 15,
      baseGoldMax: 30,
      xpPerSuccess: 20,
      baseFailChance: 0.20,
      baseCritFailChance: 0.04,
      critConsequence: "hospital",
      critHospitalMinutes: 15,
      critFlavorText: "The tree falls in entirely the wrong direction.",
      primaryStat: "strength",
      itemDrops: [
        { itemId: "rough_wood", itemName: "Rough Wood", dropChance: 0.30, minQty: 2, maxQty: 5 },
        { itemId: "hardwood", itemName: "Hardwood", dropChance: 0.14, minQty: 1, maxQty: 2 },
        { itemId: "broken_dagger", itemName: "Broken Dagger", dropChance: 0.03, minQty: 1, maxQty: 1 },
      ],
    },
    {
      id: "work_the_forge",
      name: "Work the Forge",
      description: "Assist the smith with bellows, shaping, and quenching.",
      staminaCost: 6,
      cooldownMs: 0,
      baseGoldMin: 18,
      baseGoldMax: 35,
      xpPerSuccess: 24,
      baseFailChance: 0.20,
      baseCritFailChance: 0.03,
      critConsequence: "hospital",
      critHospitalMinutes: 10,
      critFlavorText: "Molten spray catches your arm and leaves a hard lesson.",
      primaryStat: "endurance",
      itemDrops: [
        { itemId: "iron_ore", itemName: "Iron Ore", dropChance: 0.18, minQty: 1, maxQty: 3 },
        { itemId: "refined_iron", itemName: "Refined Iron", dropChance: 0.06, minQty: 1, maxQty: 2 },
        { itemId: "rusted_gear", itemName: "Rusted Gear", dropChance: 0.06, minQty: 1, maxQty: 2 },
      ],
    },
    {
      id: "tend_the_fields",
      name: "Tend the Fields",
      description: "Sow, weed, and harvest the outer farms.",
      staminaCost: 3,
      cooldownMs: 0,
      baseGoldMin: 8,
      baseGoldMax: 18,
      xpPerSuccess: 12,
      baseFailChance: 0.10,
      baseCritFailChance: 0.01,
      critConsequence: "hospital",
      critHospitalMinutes: 5,
      critFlavorText: "The bees object violently to your presence.",
      primaryStat: "endurance",
      itemDrops: [
        { itemId: "wild_herb", itemName: "Wild Herb", dropChance: 0.30, minQty: 1, maxQty: 3 },
        { itemId: "medicinal_herb", itemName: "Medicinal Herb", dropChance: 0.10, minQty: 1, maxQty: 2 },
      ],
    },
  ],
};

const deception: JobCategory = {
  id: "deception",
  name: "Deception",
  icon: "🎭",
  description:
    "Schemes, forged identities, and the confidence to lie with style.",
  theme: "Words are weapons",
  isIllegal: true,
  subJobs: [
    {
      id: "sell_fake_relics",
      name: "Sell Fake Relics",
      description: "Peddle counterfeit antiquities to the gullible and hopeful.",
      staminaCost: 5,
      cooldownMs: 0,
      baseGoldMin: 20,
      baseGoldMax: 45,
      xpPerSuccess: 22,
      baseFailChance: 0.35,
      baseCritFailChance: 0.08,
      critConsequence: "jail",
      critJailMinutes: 15,
      critFlavorText: "Your buyer knows enough history to ruin your day.",
      primaryStat: "charisma",
      itemDrops: [
        { itemId: "ancient_fragment", itemName: "Ancient Fragment", dropChance: 0.08, minQty: 1, maxQty: 1 },
        { itemId: "stolen_coin", itemName: "Stolen Coin", dropChance: 0.14, minQty: 1, maxQty: 3 },
      ],
    },
    {
      id: "forge_documents",
      name: "Forge Documents",
      description: "Produce convincing travel papers and permits.",
      staminaCost: 7,
      cooldownMs: 0,
      baseGoldMin: 30,
      baseGoldMax: 60,
      xpPerSuccess: 32,
      baseFailChance: 0.35,
      baseCritFailChance: 0.07,
      critConsequence: "jail",
      critJailMinutes: 20,
      critFlavorText: "The clerk recognises the forgery at a glance.",
      primaryStat: "intelligence",
      itemDrops: [
        { itemId: "forged_document", itemName: "Forged Document", dropChance: 0.16, minQty: 1, maxQty: 2 },
        { itemId: "vial_of_ink", itemName: "Vial of Ink", dropChance: 0.10, minQty: 1, maxQty: 2 },
      ],
    },
    {
      id: "impersonate_noble",
      name: "Impersonate a Noble",
      description: "Dress the part, bluff the part, and stay ahead of exposure.",
      staminaCost: 8,
      cooldownMs: 0,
      baseGoldMin: 40,
      baseGoldMax: 80,
      xpPerSuccess: 40,
      baseFailChance: 0.40,
      baseCritFailChance: 0.10,
      critConsequence: "jail",
      critJailMinutes: 30,
      critFlavorText: "The real noble is much closer than expected.",
      primaryStat: "charisma",
      itemDrops: [
        { itemId: "rare_gemstone", itemName: "Rare Gemstone", dropChance: 0.04, minQty: 1, maxQty: 1 },
        { itemId: "wax_seal", itemName: "Wax Seal", dropChance: 0.10, minQty: 1, maxQty: 2 },
      ],
    },
    {
      id: "run_a_con",
      name: "Run a Con",
      description: "Execute a full confidence scheme and hope your mark stays fooled.",
      staminaCost: 10,
      cooldownMs: 0,
      baseGoldMin: 50,
      baseGoldMax: 100,
      xpPerSuccess: 50,
      baseFailChance: 0.45,
      baseCritFailChance: 0.08,
      critConsequence: "jail",
      critJailMinutes: 25,
      critFlavorText: "Your mark had guards waiting from the start.",
      primaryStat: "charisma",
      itemDrops: [
        { itemId: "rare_gemstone", itemName: "Rare Gemstone", dropChance: 0.05, minQty: 1, maxQty: 1 },
        { itemId: "mana_crystal", itemName: "Mana Crystal", dropChance: 0.02, minQty: 1, maxQty: 1 },
        { itemId: "arcane_anchor", itemName: "Arcane Anchor", dropChance: 0.005, minQty: 1, maxQty: 1 },
      ],
    },
  ],
};

export const jobCategories: JobCategory[] = [
  beginnerAdventurer,
  thievery,
  courier,
  labor,
  deception,
];

export function getCategory(id: string): JobCategory | undefined {
  return jobCategories.find((c) => c.id === id);
}

export function getSubJob(categoryId: string, subJobId: string): SubJob | undefined {
  return getCategory(categoryId)?.subJobs.find((s) => s.id === subJobId);
}
