import { useMemo, useState } from "react";
import { consortiumTemplates } from "../../data/consortiumTemplateData";
import {
  canCreateConsortium,
  getConsortiumCreationSummary,
  type ConsortiumCreationState,
} from "../../state/consortiumSystem";

const DEFAULT_CREATION_STATE: ConsortiumCreationState = {
  availableGold: 50000,
  existingConsortiumId: null,
};

export default function ConsortiumCreationPanel() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(consortiumTemplates[0]?.id ?? "");
  const [creationState, setCreationState] = useState<ConsortiumCreationState>(DEFAULT_CREATION_STATE);

  const summary = useMemo(
    () => getConsortiumCreationSummary(selectedTemplateId),
    [selectedTemplateId],
  );
  const check = useMemo(
    () => canCreateConsortium(selectedTemplateId, creationState),
    [selectedTemplateId, creationState],
  );

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <label style={{ display: "grid", gap: 6 }}>
        <span>Choose Consortium Template</span>
        <select value={selectedTemplateId} onChange={(e) => setSelectedTemplateId(e.target.value)}>
          {consortiumTemplates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Available Gold</span>
        <input
          type="number"
          min={0}
          value={creationState.availableGold}
          onChange={(e) =>
            setCreationState((current) => ({
              ...current,
              availableGold: Math.max(0, Number(e.target.value) || 0),
            }))
          }
        />
      </label>

      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="checkbox"
          checked={Boolean(creationState.existingConsortiumId)}
          onChange={(e) =>
            setCreationState((current) => ({
              ...current,
              existingConsortiumId: e.target.checked ? "existing_consortium" : null,
            }))
          }
        />
        <span>Already attached to a consortium</span>
      </label>

      {summary ? (
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
            padding: 12,
            background: "rgba(7, 13, 20, 0.55)",
            display: "grid",
            gap: 6,
          }}
        >
          <strong>{summary.name}</strong>
          <div style={{ fontSize: 12, color: "#b7c3cf" }}>
            Creation Cost: {summary.creationCostGold} gold · Member Cap: {summary.memberCap}
          </div>
          <div style={{ fontSize: 12, color: "#b7c3cf" }}>
            Requirements: {summary.requirements.join(", ")}
          </div>
          <div style={{ fontSize: 12, color: "#b7c3cf" }}>
            Passives: {summary.passives.join(", ")}
          </div>
          <div style={{ fontSize: 12, color: "#b7c3cf" }}>
            Actives: {summary.actives.join(", ")}
          </div>
        </div>
      ) : null}

      <div
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 8,
          padding: 12,
          background: check.ok ? "rgba(22, 78, 45, 0.35)" : "rgba(93, 35, 35, 0.35)",
          color: "#d7e1ea",
        }}
      >
        {check.ok ? "Creation requirements met." : check.reason ?? "Creation check failed."}
      </div>
    </div>
  );
}
