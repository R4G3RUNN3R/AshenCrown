import { Link } from "react-router-dom";
import { ContentPanel } from "../layout/ContentPanel";
import { NEXIS_CITY_DISTRICTS } from "../../data/cityDistricts";

function routeFor(route: string) {
  if (route === "/guilds" || route === "/consortiums") return "/guild";
  return route;
}

export default function CityDistrictHub() {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        {NEXIS_CITY_DISTRICTS.map((district) => (
          <ContentPanel key={district.id} title={district.name}>
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ fontSize: 13, color: "#9fb0bf" }}>{district.summary}</div>
              {district.destinations.map((destination) => (
                <div key={destination.id} style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: 12, background: "rgba(7, 13, 20, 0.55)", display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                    <strong>{destination.name}</strong>
                    {destination.locked ? <span style={{ fontSize: 12, color: "#d98f8f" }}>Locked</span> : <Link className="inline-route-link" to={routeFor(destination.route)}>Open</Link>}
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.82 }}>{destination.description}</div>
                  {destination.locked ? <div style={{ fontSize: 12, color: "#b7c3cf" }}>{destination.lockReason}</div> : null}
                </div>
              ))}
            </div>
          </ContentPanel>
        ))}
      </div>
    </div>
  );
}
