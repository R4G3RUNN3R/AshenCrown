import { ContentPanel } from "../layout/ContentPanel";
import { CIVIC_JOB_TRACKS } from "../../data/civicJobsData";

export default function CivicJobsBoard() {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      {CIVIC_JOB_TRACKS.map((track) => (
        <ContentPanel key={track.id} title={track.name}>
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ color: "#9fb0bf", fontSize: 13 }}>{track.subtitle}</div>
            <div style={{ display: "grid", gap: 6 }}>
              <strong>Interview Prompt</strong>
              <div style={{ fontSize: 13, opacity: 0.82 }}>{track.interviewPrompt}</div>
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              <strong>Entry Requirements</strong>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {track.entryRequirements.map((requirement) => <li key={requirement}>{requirement}</li>)}
              </ul>
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              <strong>Specialties</strong>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {track.specialties.map((specialty) => <li key={specialty}>{specialty}</li>)}
              </ul>
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              <strong>Rank Ladder</strong>
              {track.ranks.map((rank) => (
                <div key={`${track.id}-${rank.rank}`} style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: 10, background: "rgba(7, 13, 20, 0.55)", display: "grid", gap: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <strong>{rank.rank}. {rank.title}</strong>
                    <span style={{ color: "#d1b777" }}>{rank.dailyGold} gold / day</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#b7c3cf" }}>Requirement: {rank.requirementLabel}</div>
                  <div style={{ fontSize: 12, color: "#8ec8a7" }}>Daily Job Points: +{rank.dailyJobPoints}</div>
                  <div style={{ fontSize: 12, opacity: 0.82 }}>{rank.passiveSummary}</div>
                </div>
              ))}
            </div>
          </div>
        </ContentPanel>
      ))}
    </div>
  );
}
