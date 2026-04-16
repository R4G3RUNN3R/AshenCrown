export type ConsortiumPassive = {
  id: string;
  name: string;
  description: string;
};

export type ConsortiumType = {
  id: string;
  name: string;
  theme: string;
  description: string;
  passives: ConsortiumPassive[];
  actives?: ConsortiumPassive[];
};

export const consortiumTypes: ConsortiumType[] = [
  {
    id: "merchant_consortium",
    name: "Merchant Consortium",
    theme: "Trade and resale",
    description: "Focused on pricing discipline, legal trade, and improved margins across the city.",
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
      }
    ]
  },
  {
    id: "caravan_consortium",
    name: "Caravan Consortium",
    theme: "Transport and imports",
    description: "Built around hauling capacity, supply movement, and safer import logistics.",
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
      }
    ]
  },
  {
    id: "smithing_consortium",
    name: "Smithing Consortium",
    theme: "Crafting and materials",
    description: "Supports material handling, equipment work, and infrastructure-linked crafting progress.",
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
      }
    ]
  },
  {
    id: "healing_consortium",
    name: "Healing Consortium",
    theme: "Treatment and recovery",
    description: "Centers on medical supply handling, treatment support, and recovery improvements.",
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
      }
    ]
  },
  {
    id: "arcane_research_consortium",
    name: "Arcane Research Consortium",
    theme: "Research and restricted knowledge",
    description: "Focused on magical study, controlled materials, and advanced analysis.",
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
      }
    ]
  }
];

export function getConsortiumTypeById(id: string) {
  return consortiumTypes.find((consortium) => consortium.id === id);
}
