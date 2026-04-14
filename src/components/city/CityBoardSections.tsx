import { Link } from "react-router-dom";
import { ContentPanel } from "../layout/ContentPanel";
import { groupCityBoardListings, type CityBoardCategory } from "../../data/cityBoardData";

const CATEGORY_TITLES: Record<CityBoardCategory, string> = {
  civic_jobs: "Civic Jobs",
  notices: "Notices",
  opportunities: "Opportunities",
  bounties: "Bounties",
  personals: "Personals",
  properties: "Properties",
};

export default function CityBoardSections() {
  const groups = groupCityBoardListings();
  const ordered: CityBoardCategory[] = ["civic_jobs", "notices", "opportunities", "bounties", "personals", "properties"];

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {ordered.map((category) => (
        <ContentPanel key={category} title={CATEGORY_TITLES[category]}>
          <div style={{ display: "grid", gap: 10 }}>
            {groups[category].map((listing) => (
              <div key={listing.id} style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: 12, background: "rgba(7, 13, 20, 0.55)", display: "grid", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                  <strong>{listing.title}</strong>
                  {listing.route ? <Link className="inline-route-link" to={listing.route}>Open</Link> : null}
                </div>
                <div style={{ fontSize: 13, opacity: 0.82 }}>{listing.summary}</div>
                {listing.rewardLabel ? <div style={{ fontSize: 12, color: "#b7c3cf" }}>Reward: {listing.rewardLabel}</div> : null}
                {listing.requirementLabel ? <div style={{ fontSize: 12, color: "#b7c3cf" }}>Requires: {listing.requirementLabel}</div> : null}
              </div>
            ))}
          </div>
        </ContentPanel>
      ))}
    </div>
  );
}
