import { consortiumBoardPreviews } from "../../data/consortiumBoardPreviewData";

export default function ConsortiumPreviewPanel() {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {consortiumBoardPreviews.map((consortium) => (
        <div
          key={consortium.id}
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
            padding: 10,
            background: "rgba(255,255,255,0.02)",
            display: "grid",
            gap: 5,
          }}
        >
          <strong>{consortium.name}</strong>
          <div style={{ fontSize: 12, color: "#b7c3cf" }}>{consortium.theme}</div>
          <div style={{ fontSize: 13, opacity: 0.82 }}>{consortium.description}</div>
          <div style={{ fontSize: 12, color: "#b7c3cf" }}>
            Passives: {consortium.passiveNames.join(", ")}
          </div>
        </div>
      ))}
    </div>
  );
}
