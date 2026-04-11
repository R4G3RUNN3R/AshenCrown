// ─────────────────────────────────────────────────────────────────────────────
// Nexis — Inventory Page
// Shows all items the player has accumulated from job drops.
// Items are stored in player.inventory (Record<itemId, qty>).
// ─────────────────────────────────────────────────────────────────────────────

import { AppShell } from "../components/layout/AppShell";
import { ContentPanel } from "../components/layout/ContentPanel";
import { usePlayer } from "../state/PlayerContext";
import { ITEM_CATALOGUE, getCategoryColour } from "../data/itemData";
import "../styles/inventory.css";

export default function InventoryPage() {
  const { player } = usePlayer();
  const inventory = player.inventory ?? {};

  const entries = Object.entries(inventory)
    .filter(([, qty]) => qty > 0)
    .map(([itemId, qty]) => {
      const info = ITEM_CATALOGUE[itemId] ?? {
        id: itemId,
        name: itemId.replace(/_/g, " "),
        category: "Junk" as const,
        description: "An item of uncertain origin.",
        sellPrice: 1,
        sellable: true,
      };
      return { itemId, qty, ...info };
    })
    .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

  const isEmpty = entries.length === 0;

  return (
    <AppShell title="Inventory" hint="Materials gained from jobs accumulate here. Valuable finds and key upgrade items are tracked here too.">
      <div className="nexis-grid">
        <div className="nexis-column nexis-column--wide">
          <ContentPanel title={`Items (${entries.length} types)`}>
            {isEmpty ? (
              <div className="inv-empty">
                <div className="inv-empty__icon">📦</div>
                <div className="inv-empty__title">Your inventory is empty.</div>
                <div className="inv-empty__sub">
                  Complete jobs to gather materials, salvage, valuables, and upgrade items.
                </div>
              </div>
            ) : (
              <div className="inv-grid">
                {entries.map(({ itemId, qty, name, category, description, rarity, usedFor, sellable }) => (
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
                        <span className="info-row__label">Rarity</span>
                        <span className="info-row__value">{rarity ?? "common"}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-row__label">Sellable</span>
                        <span className="info-row__value">{sellable ? "Yes" : "No"}</span>
                      </div>
                      {usedFor && usedFor.length > 0 && (
                        <div className="info-row">
                          <span className="info-row__label">Used for</span>
                          <span className="info-row__value">{usedFor.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ContentPanel>
        </div>

        <div className="nexis-column">
          <ContentPanel title="Summary">
            <div className="info-list">
              <div className="info-row">
                <span className="info-row__label">Item types</span>
                <span className="info-row__value">{entries.length}</span>
              </div>
              <div className="info-row">
                <span className="info-row__label">Total items</span>
                <span className="info-row__value">
                  {entries.reduce((sum, e) => sum + e.qty, 0)}
                </span>
              </div>
              <div className="info-row">
                <span className="info-row__label">Key items</span>
                <span className="info-row__value">
                  {entries.filter((e) => e.category === "Key").reduce((sum, e) => sum + e.qty, 0)}
                </span>
              </div>
            </div>

            <div className="inv-categories">
              <div className="inv-categories__title">By category</div>
              {Object.entries(
                entries.reduce<Record<string, number>>((acc, e) => {
                  acc[e.category] = (acc[e.category] ?? 0) + e.qty;
                  return acc;
                }, {})
              ).map(([cat, total]) => (
                <div key={cat} className="inv-cat-row">
                  <span
                    className="inv-cat-row__label"
                    style={{ color: getCategoryColour(cat) }}
                  >
                    {cat}
                  </span>
                  <span className="inv-cat-row__count">{total}</span>
                </div>
              ))}
              {isEmpty && (
                <div className="inv-cat-row inv-cat-row--empty">Nothing yet.</div>
              )}
            </div>
          </ContentPanel>
        </div>
      </div>
    </AppShell>
  );
}
