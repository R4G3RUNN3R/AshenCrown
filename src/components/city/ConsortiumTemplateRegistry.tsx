import { consortiumTemplates } from "../../data/consortiumTemplateData";

export default function ConsortiumTemplateRegistry() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {consortiumTemplates.map((template) => (
        <div
          key={template.id}
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
            padding: 12,
            background: "rgba(7, 13, 20, 0.55)",
            display: "grid",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <strong>{template.name}</strong>
            <span style={{ fontSize: 12, color: "#b7c3cf" }}>{template.theme}</span>
          </div>
          <div style={{ fontSize: 13, opacity: 0.82 }}>{template.purpose}</div>
          <div style={{ fontSize: 12, color: "#b7c3cf" }}>{template.structure}</div>
          <div style={{ fontSize: 12, color: "#b7c3cf" }}>
            Creation Cost: {template.creationCostGold} gold · Member Cap: {template.memberCap}
          </div>
          <div style={{ fontSize: 12, color: "#b7c3cf" }}>
            Requirements: {template.requirements.join(", ")}
          </div>
          <div style={{ fontSize: 12, color: "#b7c3cf" }}>
            Passives: {template.passives.map((passive) => passive.name).join(", ")}
          </div>
          <div style={{ fontSize: 12, color: "#b7c3cf" }}>
            Actives: {template.actives.map((active) => active.name).join(", ")}
          </div>
          <div style={{ fontSize: 12, color: "#b7c3cf" }}>
            Future Hooks: {template.futureHooks.join(", ")}
          </div>
          <div style={{ fontSize: 12, color: "#b7c3cf" }}>
            Exclusions: {template.exclusions.join(", ")}
          </div>
        </div>
      ))}
    </div>
  );
}
