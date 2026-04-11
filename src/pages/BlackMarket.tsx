import { AppShell } from "../components/layout/AppShell";
import { ContentPanel } from "../components/layout/ContentPanel";
import { useAcademyRuntime } from "../state/AcademyRuntimeContext";

export default function BlackMarketPage() {
  const { hasPassive, academyState } = useAcademyRuntime();
  const unlocked = hasPassive("blackMarketAccess");

  return (
    <AppShell
      title="Black Market"
      hint="Restricted trade network tied to Western Academy shadow progression."
    >
      <div className="nexis-grid">
        <div className="nexis-column nexis-column--wide">
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
