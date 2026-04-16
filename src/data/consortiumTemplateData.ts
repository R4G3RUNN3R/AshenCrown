export type ConsortiumTemplatePassive = {
  id: string;
  name: string;
  description: string;
};

export type ConsortiumTemplateActive = {
  id: string;
  name: string;
  description: string;
  usageRule: string;
};

export type ConsortiumTemplate = {
  id: string;
  name: string;
  theme: string;
  purpose: string;
  structure: string;
  creationCostGold: number;
  memberCap: number;
  cityBoardRegistrationRequired: boolean;
  requirements: string[];
  passives: ConsortiumTemplatePassive[];
  actives: ConsortiumTemplateActive[];
  futureHooks: string[];
  exclusions: string[];
};

export const consortiumTemplates: ConsortiumTemplate[] = [
  {
    id: "merchant_consortium",
    name: "Merchant Consortium",
    theme: "Trade and resale",
    purpose: "Built for legal trade, stable margins, and efficient turnover of goods across Nexis.",
    structure: "Commercial trading consortium with emphasis on inventory movement, resale discipline, and merchant operations.",
    creationCostGold: 25000,
    memberCap: 10,
    cityBoardRegistrationRequired: true,
    requirements: [
      "City Board registration",
      "Minimum founder level or civic standing later",
      "Enough funds to cover startup registration and working float",
    ],
    passives: [
      {
        id: "merchant-margin",
        name: "Negotiated Margins",
        description: "Improves standard trade sale efficiency and merchant-facing resale value.",
      },
      {
        id: "merchant-ledgers",
        name: "Disciplined Ledgers",
        description: "Improves visibility into goods flow and supports more efficient commercial decisions.",
      },
    ],
    actives: [
      {
        id: "merchant-price-check",
        name: "Price Check",
        description: "Provides a clearer snapshot of favorable legal resale targets for standard trade goods.",
        usageRule: "Limited-use commercial action, cooldown or daily limit later.",
      },
    ],
    futureHooks: [
      "Improved legal market sale margins",
      "More efficient commercial listing support",
      "Expanded merchant reporting tools",
    ],
    exclusions: [
      "Does not increase black market daily purchase cap",
      "Does not function as a guild or faction tree",
    ],
  },
  {
    id: "caravan_consortium",
    name: "Caravan Consortium",
    theme: "Transport and imports",
    purpose: "Focused on hauling goods, managing risk on routes, and increasing travel-linked carrying value.",
    structure: "Logistics and transport consortium built around route movement, imported goods, and cargo management.",
    creationCostGold: 32000,
    memberCap: 12,
    cityBoardRegistrationRequired: true,
    requirements: [
      "City Board registration",
      "Access to basic trade or travel systems",
      "Sufficient startup gold",
    ],
    passives: [
      {
        id: "caravan-capacity",
        name: "Expanded Cargo Practice",
        description: "Increases travel-goods carrying capacity for members.",
      },
      {
        id: "caravan-losses",
        name: "Secured Loads",
        description: "Reduces losses and inefficiencies during trade and caravan jobs.",
      },
    ],
    actives: [
      {
        id: "caravan-priority-route",
        name: "Priority Route",
        description: "Improves the short-term efficiency of a selected caravan or trade run.",
        usageRule: "Triggered logistics action with cooldown or contract limit later.",
      },
    ],
    futureHooks: [
      "More travel-goods capacity",
      "Reduced route losses",
      "Better caravan contract access",
    ],
    exclusions: [
      "Does not change Guild skill trees",
      "Does not increase standard shop daily limit by default",
    ],
  },
  {
    id: "smithing_consortium",
    name: "Smithing Consortium",
    theme: "Crafting and materials",
    purpose: "Supports material handling, forging discipline, and construction-linked production efficiency.",
    structure: "Industrial craftsmanship consortium centered on materials, tools, and production throughput.",
    creationCostGold: 30000,
    memberCap: 10,
    cityBoardRegistrationRequired: true,
    requirements: [
      "City Board registration",
      "Basic access to crafting or materials systems later",
      "Sufficient startup gold",
    ],
    passives: [
      {
        id: "smithing-yield",
        name: "Material Discipline",
        description: "Improves efficiency when working with construction and metal materials.",
      },
      {
        id: "smithing-workflow",
        name: "Forge Workflow",
        description: "Supports faster crafting-related throughput in future production systems.",
      },
    ],
    actives: [
      {
        id: "smithing-batch-run",
        name: "Batch Run",
        description: "Temporarily improves throughput on a selected forging or materials task.",
        usageRule: "Triggered production action with limited use later.",
      },
    ],
    futureHooks: [
      "Better material efficiency",
      "Reduced crafting waste",
      "Improved production output consistency",
    ],
    exclusions: [
      "Does not serve as a guild combat specialization tree",
      "Does not grant unrestricted access to high-tier recipes",
    ],
  },
  {
    id: "healing_consortium",
    name: "Healing Consortium",
    theme: "Treatment and recovery",
    purpose: "Centers on medical supplies, better treatment flow, and cleaner recovery support for members.",
    structure: "Support and treatment consortium focused on healing logistics, recovery planning, and care operations.",
    creationCostGold: 28000,
    memberCap: 10,
    cityBoardRegistrationRequired: true,
    requirements: [
      "City Board registration",
      "Basic medical access later",
      "Sufficient startup gold",
    ],
    passives: [
      {
        id: "healing-recovery",
        name: "Steady Recovery",
        description: "Improves passive recovery support for members.",
      },
      {
        id: "healing-supplies",
        name: "Medical Stock Discipline",
        description: "Improves access efficiency for healing-oriented supplies and treatment logistics.",
      },
    ],
    actives: [
      {
        id: "healing-priority-care",
        name: "Priority Care",
        description: "Temporarily prioritizes treatment flow for a selected recovery action.",
        usageRule: "Triggered support action with cooldown or daily limit later.",
      },
    ],
    futureHooks: [
      "Better treatment throughput",
      "Improved healing supply efficiency",
      "Lower recovery friction in future systems",
    ],
    exclusions: [
      "Does not replace hospitals",
      "Does not function as a guild passive tree",
    ],
  },
  {
    id: "arcane_research_consortium",
    name: "Arcane Research Consortium",
    theme: "Research and restricted knowledge",
    purpose: "Focused on magical study, controlled materials, and stable handling of rarer research assets.",
    structure: "Research consortium concerned with analysis, containment, and disciplined magical progress.",
    creationCostGold: 40000,
    memberCap: 8,
    cityBoardRegistrationRequired: true,
    requirements: [
      "City Board registration",
      "Arcane access or education requirement later",
      "Sufficient startup gold",
    ],
    passives: [
      {
        id: "arcane-analysis",
        name: "Controlled Study",
        description: "Improves research-facing efficiency for magical and rare material systems.",
      },
      {
        id: "arcane-handling",
        name: "Stabilized Handling",
        description: "Supports safer management of rarer or more volatile imported materials.",
      },
    ],
    actives: [
      {
        id: "arcane-assay",
        name: "Arcane Assay",
        description: "Performs an intensified review of a chosen magical material or research target.",
        usageRule: "Triggered research action with cooldown or resource cost later.",
      },
    ],
    futureHooks: [
      "Improved magical research throughput",
      "Safer rare material handling",
      "Better analysis support for advanced crafting loops",
    ],
    exclusions: [
      "Does not grant a guild spell-tree",
      "Does not bypass material scarcity",
    ],
  },
  {
    id: "security_consortium",
    name: "Security Consortium",
    theme: "Protection and controlled force",
    purpose: "Organized around contracts, guarded movement, and defensive support for commerce and assets.",
    structure: "Protective service consortium supporting safer movement, guarded property, and controlled enforcement.",
    creationCostGold: 36000,
    memberCap: 10,
    cityBoardRegistrationRequired: true,
    requirements: [
      "City Board registration",
      "Minimum combat readiness later",
      "Sufficient startup gold",
    ],
    passives: [
      {
        id: "security-escorts",
        name: "Escorted Transit",
        description: "Improves safety and reliability for certain protected movements and civic contracts.",
      },
      {
        id: "security-watch",
        name: "Watch Discipline",
        description: "Improves protective readiness for assets and organized operations.",
      },
    ],
    actives: [
      {
        id: "security-lockdown",
        name: "Security Lockdown",
        description: "Temporarily increases protection on a selected controlled operation or holding.",
        usageRule: "Triggered defense action with limited uses later.",
      },
    ],
    futureHooks: [
      "Safer caravan movement",
      "Improved property protection later",
      "Better defensive support contracts",
    ],
    exclusions: [
      "Does not replace Guild war specialization",
      "Does not grant free combat dominance",
    ],
  },
  {
    id: "exploration_consortium",
    name: "Exploration Consortium",
    theme: "Discovery and route intelligence",
    purpose: "Built for scouting, mapping, discovery incentives, and unlocking efficient route knowledge.",
    structure: "Exploration and route-finding consortium focused on discovery loops and information advantage.",
    creationCostGold: 29000,
    memberCap: 10,
    cityBoardRegistrationRequired: true,
    requirements: [
      "City Board registration",
      "Basic travel access",
      "Sufficient startup gold",
    ],
    passives: [
      {
        id: "exploration-mapping",
        name: "Route Mapping",
        description: "Improves access to route knowledge and exploration efficiency.",
      },
      {
        id: "exploration-scouting",
        name: "Scout Discipline",
        description: "Supports better discovery outcomes in future exploration systems.",
      },
    ],
    actives: [
      {
        id: "exploration-survey",
        name: "Rapid Survey",
        description: "Performs a focused scouting effort on a chosen route or discovery target.",
        usageRule: "Triggered exploration action with limited use later.",
      },
    ],
    futureHooks: [
      "Improved exploration rewards",
      "Better route information",
      "Stronger travel discovery outcomes",
    ],
    exclusions: [
      "Does not replace travel capacity bonuses from transport systems",
      "Does not function as a guild strategy tree",
    ],
  },
];

export function getConsortiumTemplateById(id: string) {
  return consortiumTemplates.find((template) => template.id === id);
}
