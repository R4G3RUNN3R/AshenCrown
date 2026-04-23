import { Link, useParams } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { getMapView, mapViews } from "../data/mapSchema";
import "../styles/world-map-ui.css";

export default function WorldMapPage() {
  const params = useParams();
  const activeMap = getMapView(params.mapId ?? "world") ?? mapViews[0];
  const visibleNodes = activeMap.nodes.filter((node) => node.visibility === "visible");
  const hiddenCount = activeMap.nodes.filter((node) => node.visibility !== "visible").length;

  return (
    <AppShell
      title={activeMap.label}
      hint="Maps are now data-backed surfaces for routes, districts, service anchors, hidden nodes, and future territorial nonsense with paperwork."
    >
      <div className="nexis-grid">
        <div className="nexis-column">
          <section className="panel">
            <div className="panel__header">
              <h2>Map Registry</h2>
            </div>
            <div className="panel__body">
              <div className="info-list">
                {mapViews.map((view) => (
                  <div key={view.id} className="info-row">
                    <span className="info-row__label">{view.label}</span>
                    <span className="info-row__value info-row__value--accent">
                      <Link className="inline-route-link" to={view.id === "world" ? "/world-map" : `/maps/${view.id}`}>
                        Open
                      </Link>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel__header">
              <h2>Visible Nodes</h2>
            </div>
            <div className="panel__body">
              <div className="info-list">
                {visibleNodes.map((node) => (
                  <div key={node.id} className="info-row">
                    <span className="info-row__label">{node.label}</span>
                    <span className="info-row__value">{node.kind}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="nexis-column">
          <section className="panel">
            <div className="panel__header">
              <h2>Map Summary</h2>
            </div>
            <div className="panel__body">
              <p style={{ marginTop: 0 }}>{activeMap.summary}</p>
              <div className="stat-table">
                <div className="stat-row">
                  <span className="stat-row__label">Map Kind</span>
                  <strong className="stat-row__value">{activeMap.kind}</strong>
                </div>
                <div className="stat-row">
                  <span className="stat-row__label">Visible Nodes</span>
                  <strong className="stat-row__value">{visibleNodes.length}</strong>
                </div>
                <div className="stat-row">
                  <span className="stat-row__label">Hidden / Locked</span>
                  <strong className="stat-row__value">{hiddenCount}</strong>
                </div>
                <div className="stat-row">
                  <span className="stat-row__label">Connections</span>
                  <strong className="stat-row__value">{activeMap.edges.length}</strong>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="nexis-column">
          <section className="panel">
            <div className="panel__header">
              <h2>Expansion Hooks</h2>
            </div>
            <div className="panel__body">
              <div className="info-list">
                <div className="info-row">
                  <span className="info-row__label">Guild Influence</span>
                  <span className="info-row__value">Ready</span>
                </div>
                <div className="info-row">
                  <span className="info-row__label">Consortium Presence</span>
                  <span className="info-row__value">Ready</span>
                </div>
                <div className="info-row">
                  <span className="info-row__label">Hidden Nodes</span>
                  <span className="info-row__value">Modeled</span>
                </div>
                <div className="info-row">
                  <span className="info-row__label">Keeps / Strongholds</span>
                  <span className="info-row__value">Scaffolded</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
