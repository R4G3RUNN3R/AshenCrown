// ─────────────────────────────────────────────────────────────────────────────
// Nexis — Market Page
// Sell inventory items for gold. This completes the first usable economy loop:
// Jobs → Inventory → Market → Gold → Housing
// ─────────────────────────────────────────────────────────────────────────────

import { AppShell } from "../components/layout/AppShell";
import { ContentPanel } from "../components/layout/ContentPanel";
import { usePlayer } from "../state/PlayerContext";

const ITEM_CATALOGUE: Record<
  string,
  { name: string; category: string; description: string; sellPrice: number }
> = {
  wild_herb:        { name: "Wild Herb",        category: "Herb",       description: "Common flora. Used in basic potion recipes.", sellPrice: 12 },
  medicinal_herb:   { name: "Medicinal Herb",   category: "Herb",       description: "Useful for healing compounds. Sought by alchemists.", sellPrice: 20 },
  healing_root:     { name: "Healing Root",     category: "Herb",       description: "Rare root with potent restorative properties.", sellPrice: 38 },
  rough_wood:       { name: "Rough Wood",       category: "Material",   description: "Unfinished timber. Useful for basic constructs.", sellPrice: 10 },
  hardwood:         { name: "Hardwood",         category: "Material",   description: "Dense, quality wood. Valued by carpenters.", sellPrice: 22 },
  iron_ore:         { name: "Iron Ore",         category: "Ore",        description: "Raw iron. Requires smelting before use.", sellPrice: 18 },
  coal:             { name: "Coal",             category: "Ore",        description: "Fuel source used in forges and furnaces.", sellPrice: 8 },
  scrap_metal:      { name: "Scrap Metal",      category: "Material",   description: "Salvaged metalwork. Can be repurposed.", sellPrice: 11 },
  leather_strip:    { name: "Leather Strip",    category: "Material",   description: "Cured hide. Used in armour and binding.", sellPrice: 14 },
  rope:             { name: "Rope",             category: "Material",   description: "Reliable cordage. Useful in a dozen trades.", sellPrice: 9 },
  ancient_fragment: { name: "Ancient Fragment", category: "Relic",      description: "Piece of a ruined inscription. Scholars pay well.", sellPrice: 55 },
  torn_map:         { name: "Tattered Map",     category: "Relic",      description: "Part of an old map. The rest is somewhere out there.", sellPrice: 44 },
  stolen_coin:      { name: "Stolen Coin",      category: "Valuables",  description: "Liberated from an inattentive pocket.", sellPrice: 16 },
  rare_gemstone:    { name: "Rare Gemstone",    category: "Valuables",  description: "Uncut gem. Fence it or keep it. Your call.", sellPrice: 90 },
  forged_document:  { name: "Forged Document",  category: "Relic",      description: "Convincingly fake. Useful for certain arrangements.", sellPrice: 36 },
  lockpick:         { name: "Lockpick",         category: "Tool",       description: "A good tool deserves a good cause.", sellPrice: 14 },
  rations:          { name: "Rations",          category: "Consumable", description: "Standard travel food. Better than nothing.", sellPrice: 7 },
  worn_boots:       { name: "Worn Boots",       category: "Equipment",  description: "Seen better days. Still keeps the feet dry.", sellPrice: 12 },
  stone_block:      { name: "Stone Block",      category: "Material",   description: "Cut stone. Essential for construction.", sellPrice: 13 },
  clay:             { name: "Clay",             category: "Material",   description: "Raw clay. Used in ceramics and construction.", sellPrice: 6 },
  vial_of_ink:      { name: "Vial of Ink",      category: "Consumable", description: "High-quality ink. Useful for scribes and forgers alike.", sellPrice: 17 },
  wax_seal:         { name: "Wax Seal",         category: "Tool",       description: "Official-looking seal. Almost official.", sellPrice: 15 },
};

const CATEGORY_COLOUR: Record<string, string> = {
  Herb: "#4caf50",
  Ore: "#9e9e9e",
  Material: "#8d6e63",
  Relic: "#ab47bc",
  Valuables: "#ffd740",
  Consumable: "#26c6da",
  Tool: "#ff9800",
  Equipment: "#78909c",
};

function getCategoryColour(category: string): string {
  return CATEGORY_COLOUR[category] ?? "#546e7a";
}

export default function MarketPage() {
  const { player, addGold } = usePlayer();
  const inventory = player.inventory ?? {};

  const entries = Object.entries(inventory)
    .filter(([, qty]) => qty > 0)
    .map(([itemId, qty]) => {
      const info = ITEM_CATALOGUE[itemId] ?? {
        name: itemId.replace(/_/g, " "),
        category: "Unknown",
        description: "An item of uncertain origin.",
        sellPrice: 5,
      };
      return { itemId, qty, ...info };
    })
    .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

  const totalSellValue = entries.reduce((sum, entry) => sum + entry.qty * entry.sellPrice, 0);
  const isEmpty = entries.length === 0;

  return (
    <AppShell
      title="Market"
      hint="Sell gathered goods for gold. This is the first active economy layer."
    >
      <div className="nexis-grid">
        <div className="nexis-column nexis-column--wide">
          <ContentPanel title={`Sell Goods (${entries.length} types)`}>
            {isEmpty ? (
              <div style={{ padding: "1rem", color: "var(--color-text-muted, #aaa)" }}>
                You have nothing worth selling yet. Go run jobs and come back with bags full of questionable goods.
              </div>
            ) : (
              <div className="inv-grid">
                {entries.map(({ itemId, qty, name, category, description, sellPrice }) => {
                  const total = qty * sellPrice;
                  return (
                    <div key={itemId} className="inv-item">
                      <div className="inv-item__header">
                        <span className="inv-item__name">{name}</span>
                        <span
                          className="inv-item__category"
                          style={{ color: getCategoryColour(category) }}
                        >
                          {category}
                        </span>
                      </div>

                      <div className="inv-item__desc">{description}</div>

                      <div className="inv-item__qty">
                        <span className="inv-item__qty-label">In possession:</span>
                        <span className="inv-item__qty-value">× {qty}</span>
                      </div>

                      <div className="info-list" style={{ marginTop: "0.75rem" }}>
                        <div className="info-row">
                          <span className="info-row__label">Unit value</span>
                          <span className="info-row__value">{sellPrice} gold</span>
                        </div>
                        <div className="info-row">
                          <span className="info-row__label">Stack value</span>
                          <span className="info-row__value">{total} gold</span>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.9rem" }}>
                        <button
                          type="button"
                          className="edu-action-button edu-action-button--primary"
                          onClick={() => {
                            addGold(sellPrice);
                            inventory[itemId] = Math.max(0, (inventory[itemId] ?? 0) - 1);
                          }}
                        >
                          Sell 1
                        </button>
                        <button
                          type="button"
                          className="edu-action-button"
                          onClick={() => {
                            addGold(total);
                            inventory[itemId] = 0;
                          }}
                        >
                          Sell All
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ContentPanel>
        </div>

        <div className="nexis-column">
          <ContentPanel title="Market Summary">
            <div className="info-list">
              <div className="info-row">
                <span className="info-row__label">Current gold</span>
                <span className="info-row__value">{player.gold.toLocaleString()}</span>
              </div>
              <div className="info-row">
                <span className="info-row__label">Sellable item types</span>
                <span className="info-row__value">{entries.length}</span>
              </div>
              <div className="info-row">
                <span className="info-row__label">Total stock</span>
                <span className="info-row__value">
                  {entries.reduce((sum, entry) => sum + entry.qty, 0)}
                </span>
              </div>
              <div className="info-row">
                <span className="info-row__label">Total sell value</span>
                <span className="info-row__value">{totalSellValue.toLocaleString()} gold</span>
              </div>
            </div>
          </ContentPanel>
        </div>
      </div>
    </AppShell>
  );
}
