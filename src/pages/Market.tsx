// ─────────────────────────────────────────────────────────────────────────────
// Nexis — Market Page (UPDATED)
// Uses central itemData and respects sellable flag
// ─────────────────────────────────────────────────────────────────────────────

import { AppShell } from "../components/layout/AppShell";
import { ContentPanel } from "../components/layout/ContentPanel";
import { usePlayer } from "../state/PlayerContext";
import { ITEM_CATALOGUE, getCategoryColour } from "../data/itemData";

export default function MarketPage() {
  const { player, addGold, removeItem } = usePlayer();
  const inventory = player.inventory ?? {};

  const entries = Object.entries(inventory)
    .filter(([, qty]) => qty > 0)
    .map(([itemId, qty]) => {
      const info = ITEM_CATALOGUE[itemId];
      if (!info) return null;
      return { itemId, qty, ...info };
    })
    .filter(Boolean) as any[];

  const sellableEntries = entries.filter((e) => e.sellable);

  const totalSellValue = sellableEntries.reduce(
    (sum, entry) => sum + entry.qty * entry.sellPrice,
    0
  );

  return (
    <AppShell title="Market" hint="Sell goods. Some items cannot be sold.">
      <div className="nexis-grid">
        <div className="nexis-column nexis-column--wide">
          <ContentPanel title={`Sellable Items (${sellableEntries.length})`}>
            <div className="inv-grid">
              {sellableEntries.map((item) => {
                const total = item.qty * item.sellPrice;
                return (
                  <div key={item.itemId} className="inv-item">
                    <div className="inv-item__header">
                      <span className="inv-item__name">{item.name}</span>
                      <span style={{ color: getCategoryColour(item.category) }}>
                        {item.category}
                      </span>
                    </div>

                    <div className="inv-item__desc">{item.description}</div>

                    <div>Qty: {item.qty}</div>
                    <div>Value: {item.sellPrice} each</div>

                    <div style={{ marginTop: "0.5rem" }}>
                      <button
                        onClick={() => {
                          if (removeItem(item.itemId, 1)) {
                            addGold(item.sellPrice);
                          }
                        }}
                      >
                        Sell 1
                      </button>

                      <button
                        onClick={() => {
                          if (removeItem(item.itemId, item.qty)) {
                            addGold(total);
                          }
                        }}
                      >
                        Sell All
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ContentPanel>
        </div>

        <div className="nexis-column">
          <ContentPanel title="Summary">
            <div>Gold: {player.gold}</div>
            <div>Total Sell Value: {totalSellValue}</div>
          </ContentPanel>
        </div>
      </div>
    </AppShell>
  );
}
