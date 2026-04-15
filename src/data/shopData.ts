import { items } from "./itemData";

export type Shop = {
  id: string;
  name: string;
  description: string;
  inventory: { itemId: string; stock: number }[];
};

export const shops: Shop[] = [
  {
    id: "general_store",
    name: "General Store",
    description: "Basic supplies for everyday needs.",
    inventory: [
      { itemId: "bread_loaf", stock: 999 },
      { itemId: "water_flask", stock: 999 },
    ],
  },
  {
    id: "blacksmith",
    name: "Blacksmith",
    description: "Weapons, armor, and metalwork.",
    inventory: [
      { itemId: "iron_sword", stock: 10 },
      { itemId: "iron_ingot", stock: 100 },
    ],
  },
  {
    id: "armorer",
    name: "Armorer",
    description: "Protective gear and armor.",
    inventory: [
      { itemId: "leather_armor", stock: 10 },
    ],
  },
  {
    id: "lumber_yard",
    name: "Lumber Yard",
    description: "Construction materials and timber.",
    inventory: [
      { itemId: "timber_bundle", stock: 200 },
    ],
  }
];

export function getShopById(id: string) {
  return shops.find((s) => s.id === id);
}
