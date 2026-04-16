import { AppShell } from "../components/layout/AppShell";
import { ContentPanel } from "../components/layout/ContentPanel";
import { shopsV2 } from "../data/shopDataV2";
import { getItemByIdV2 } from "../data/itemDataV2";
import { formatCurrencyCompact } from "../data/economyData";

export default function BlackMarketV2Page() {
  const blackMarkets = shopsV2.filter((shop) => shop.type === "black_market");

  return (
    <AppShell title="Black Market">
      <div style={{ display: "grid", gap: "1rem" }}>
        <ContentPanel title="Black Market Rules">
          <div style={{ padding: "1rem", color: "var(--color-text-muted, #aaa)" }}>
            <p>Black market purchases are capped at 5 items per 24 hours.</p>
            <p>Illicit goods are intended for controlled import loops and player resale, not unlimited convenience buying.</p>
            <p>NPC shops may buy illicit imports, but margins are intentionally poor.</p>
          </div>
        </ContentPanel>

        <ContentPanel title="Known Black Market Stock">
          <div style={{ padding: "1rem", display: "grid", gap: "1rem" }}>
            {blackMarkets.map((shop) => (
              <div key={shop.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "0.75rem" }}>
                <div style={{ fontWeight: 700, marginBottom: "0.35rem" }}>{shop.name} · {shop.location}</div>
                <div style={{ color: "var(--color-text-muted, #aaa)", marginBottom: "0.5rem" }}>{shop.description}</div>
                <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                  {shop.inventory.map((entry) => {
                    const item = getItemByIdV2(entry.itemId);
                    if (!item) return null;
                    return (
                      <li key={entry.itemId}>
                        {item.name} · {formatCurrencyCompact({ copper: Math.ceil(item.baseValue * entry.priceMultiplier) })} · Stock {entry.stock}/{entry.maxStock}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </ContentPanel>
      </div>
    </AppShell>
  );
}
