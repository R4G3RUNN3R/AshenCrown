import { AppShell } from "../components/layout/AppShell";
import { ContentPanel } from "../components/layout/ContentPanel";
import { shopsV2 } from "../data/shopDataV2";
import { getItemByIdV2 } from "../data/itemDataV2";
import { formatCurrencyCompact } from "../data/economyData";

export default function MarketV2Page() {
  const nexisShops = shopsV2.filter((shop) => shop.region === "nexis");
  const abroadShops = shopsV2.filter((shop) => shop.region === "abroad");

  return (
    <AppShell title="Market">
      <div style={{ display: "grid", gap: "1rem" }}>
        <ContentPanel title="Market Overview">
          <div style={{ padding: "1rem", color: "var(--color-text-muted, #aaa)" }}>
            <p>Standard shop cap: 100 items per 24 hours.</p>
            <p>Black market cap: 5 items per 24 hours.</p>
            <p>Travel goods start with a carry cap of 5 and expand later through mounts, vehicles, guilds, and consortium bonuses.</p>
            <p>Imported illicit goods are intended to be sold to players for real profit. NPC resale is only a fallback.</p>
          </div>
        </ContentPanel>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <ContentPanel title="Nexis Shops">
            <div style={{ padding: "1rem", display: "grid", gap: "1rem" }}>
              {nexisShops.map((shop) => (
                <div key={shop.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "0.75rem" }}>
                  <div style={{ fontWeight: 700, marginBottom: "0.35rem" }}>{shop.name}</div>
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

          <ContentPanel title="Abroad Import Shops">
            <div style={{ padding: "1rem", display: "grid", gap: "1rem" }}>
              {abroadShops.map((shop) => (
                <div key={shop.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "0.75rem" }}>
                  <div style={{ fontWeight: 700, marginBottom: "0.35rem" }}>{shop.name} · {shop.location}</div>
                  <div style={{ color: "var(--color-text-muted, #aaa)", marginBottom: "0.5rem" }}>{shop.description}</div>
                  <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                    {shop.inventory.map((entry) => {
                      const item = getItemByIdV2(entry.itemId);
                      if (!item) return null;
                      return (
                        <li key={entry.itemId}>
                          {item.name}
                          {item.isIllicit ? " · Illicit" : item.isTravelGood ? " · Travel Good" : ""}
                          {` · ${formatCurrencyCompact({ copper: Math.ceil(item.baseValue * entry.priceMultiplier) })} · Stock ${entry.stock}/${entry.maxStock}`}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </ContentPanel>
        </div>
      </div>
    </AppShell>
  );
}
