import { useMemo, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { ContentPanel } from "../components/layout/ContentPanel";
import { useAcademyRuntime } from "../state/AcademyRuntimeContext";
import { usePlayer } from "../state/PlayerContext";
import { blackMarketListings } from "../data/blackMarketData";

const CATEGORY_LABELS: Record<string, string> = {
  contraband: "Contraband",
  fenced_goods: "Fenced Goods",
  rare_material: "Rare Materials",
  restricted_tool: "Restricted Tools",
};

export default function BlackMarketPage() {
  const { hasPassive, academyState } = useAcademyRuntime();
  const { player, spendGold, addItem } = usePlayer();
  const unlocked = hasPassive("blackMarketAccess");
  const [stockState, setStockState] = useState<Record<string, number>>(() =>
    Object.fromEntries(blackMarketListings.map((listing) => [listing.id, listing.stock]))
  );
  const [toast, setToast] = useState<string | null>(null);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  }

  const groupedListings = useMemo(() => {
    return blackMarketListings.reduce<Record<string, typeof blackMarketListings>>((acc, listing) => {
      const key = listing.category;
      if (!acc[key]) acc[key] = [];
      acc[key].push(listing);
      return acc;
    }, {});
  }, []);

  function handleBuy(listingId: string) {
    const listing = blackMarketListings.find((entry) => entry.id === listingId);
    if (!listing || !listing.itemId) return;

    const stock = stockState[listingId] ?? 0;
    if (stock <= 0) {
      showToast("Sold out.");
      return;
    }

    const paid = spendGold(listing.price);
    if (!paid) {
      showToast("Not enough gold.");
      return;
    }

    addItem(listing.itemId, 1);
    setStockState((prev) => ({
      ...prev,
      [listingId]: Math.max(0, (prev[listingId] ?? 0) - 1),
    }));
    showToast(`${listing.name} acquired.`);
  }

  return (
    <AppShell
      title="Black Market"
      hint="Restricted trade network tied to Western Academy shadow progression."
    >
      <div className="nexis-grid">
        <div className="nexis-column nexis-column--wide">
          {toast && (
            <div style={{ marginBottom: "0.75rem", padding: "0.75rem 1rem", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px" }}>
              {toast}
            </div>
          )}

          <ContentPanel title="Access Status">
            {unlocked ? (
              <div style={{ padding: "1rem" }}>
                <div style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>
                  Access Granted
                </div>
                <div style={{ color: "var(--color-text-muted, #aaa)", marginBottom: "1rem" }}>
                  Your standing within the Western Shadow path is sufficient. Hidden traders and fenced networks now recognise your name.
                </div>
                <div className="info-list">
                  <div className="info-row">
                    <span className="info-row__label">Status</span>
                    <span className="info-row__value">Unlocked</span>
                  </div>
                  <div className="info-row">
                    <span className="info-row__label">Western Branch</span>
                    <span className="info-row__value">{academyState.westernBranch ?? "Unchosen"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-row__label">Western Rank</span>
                    <span className="info-row__value">{academyState.rankProgress.western ?? 0}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-row__label">Available Gold</span>
                    <span className="info-row__value">{player.gold.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: "1rem" }}>
                <div style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>
                  Access Denied
                </div>
                <div style={{ color: "var(--color-text-muted, #aaa)", marginBottom: "1rem" }}>
                  The Black Market is not public. Entry is tied to the Shadow path of the Western Academy and opens later in that progression.
                </div>
                <div className="info-list">
                  <div className="info-row">
                    <span className="info-row__label">Required path</span>
                    <span className="info-row__value">Western Academy → Shadow</span>
                  </div>
                  <div className="info-row">
                    <span className="info-row__label">Required milestone</span>
                    <span className="info-row__value">Rank 5</span>
                  </div>
                  <div className="info-row">
                    <span className="info-row__label">Current branch</span>
                    <span className="info-row__value">{academyState.westernBranch ?? "Unchosen"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-row__label">Current western rank</span>
                    <span className="info-row__value">{academyState.rankProgress.western ?? 0}</span>
                  </div>
                </div>
              </div>
            )}
          </ContentPanel>

          {unlocked && (
            <ContentPanel title="Available Listings">
              <div className="inv-grid">
                {Object.entries(groupedListings).map(([category, listings]) => (
                  <div key={category} style={{ gridColumn: "1 / -1" }}>
                    <div style={{ fontWeight: 700, margin: "0.5rem 0 0.75rem" }}>
                      {CATEGORY_LABELS[category] ?? category}
                    </div>
                    <div className="inv-grid">
                      {listings.map((listing) => {
                        const stock = stockState[listing.id] ?? 0;
                        const canAfford = player.gold >= listing.price;
                        return (
                          <div key={listing.id} className="inv-item">
                            <div className="inv-item__header">
                              <span className="inv-item__name">{listing.name}</span>
                              <span>{CATEGORY_LABELS[listing.category]}</span>
                            </div>
                            <div className="inv-item__desc">{listing.description}</div>
                            <div className="info-list" style={{ marginTop: "0.75rem" }}>
                              <div className="info-row">
                                <span className="info-row__label">Price</span>
                                <span className="info-row__value">{listing.price.toLocaleString()} gold</span>
                              </div>
                              <div className="info-row">
                                <span className="info-row__label">Stock</span>
                                <span className="info-row__value">{stock}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="housing-upgrade__btn"
                              style={{ marginTop: "0.9rem" }}
                              disabled={stock <= 0 || !canAfford}
                              onClick={() => handleBuy(listing.id)}
                            >
                              {stock <= 0 ? "Sold Out" : canAfford ? "Buy" : "Insufficient Gold"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </ContentPanel>
          )}
        </div>

        <div className="nexis-column">
          <ContentPanel title="Network Notes">
            <div className="info-list">
              <div className="info-row">
                <span className="info-row__label">Trade class</span>
                <span className="info-row__value">Illicit</span>
              </div>
              <div className="info-row">
                <span className="info-row__label">Source</span>
                <span className="info-row__value">Western Shadow progression</span>
              </div>
              <div className="info-row">
                <span className="info-row__label">Future purpose</span>
                <span className="info-row__value">Restricted items, fenced goods, covert contracts</span>
              </div>
            </div>
          </ContentPanel>
        </div>
      </div>
    </AppShell>
  );
}
