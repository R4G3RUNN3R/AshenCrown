import { useEffect, useMemo, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { usePlayer } from "../state/PlayerContext";
import { useAuth } from "../state/AuthContext";
import { allocatePublicNumericId, formatEntityPublicId } from "../lib/publicIds";
import {
  CONSORTIUM_STORAGE_PREFIX,
  collectExistingPublicIds,
  consortiumKey,
  formatDate,
  readConsortiumBoard,
  type ConsortiumBoard,
  writeJson,
} from "../lib/organizations";
import { readCachedRuntimeState } from "../lib/runtimeStateCache";
import "../styles/guild.css";

const CONSORTIUM_TYPES = [
  {
    id: "mercantile_house",
    name: "Mercantile House",
    summary: "Trade manifests, route profit, and respectable greed.",
    baseCost: 180_000,
    baseIncomePerShift: 240,
    startingVault: 2_500,
    roleSummary: "Roles: Director, Quartermaster, Trade Clerk",
  },
  {
    id: "security_contractor",
    name: "Security Contractor",
    summary: "Protection contracts, escorts, and expensive people with weapons.",
    baseCost: 220_000,
    baseIncomePerShift: 280,
    startingVault: 3_000,
    roleSummary: "Roles: Director, Operations Captain, Field Lead",
  },
  {
    id: "research_collective",
    name: "Research Collective",
    summary: "Study grants, commissioned analysis, and suspiciously polished reports.",
    baseCost: 260_000,
    baseIncomePerShift: 320,
    startingVault: 3_500,
    roleSummary: "Roles: Director, Archivist, Senior Researcher",
  },
] as const;

function StatusRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="info-row">
      <span className="info-row__label">{label}</span>
      <span className="info-row__value">{value}</span>
    </div>
  );
}

export default function ConsortiumsPage() {
  const { player, spendGold } = usePlayer();
  const { activeAccount, authSource, syncServerRuntimeState } = useAuth();
  const [board, setBoard] = useState<ConsortiumBoard | null>(null);
  const [consortiumName, setConsortiumName] = useState("");
  const [consortiumTag, setConsortiumTag] = useState("");
  const [selectedTypeId, setSelectedTypeId] = useState<(typeof CONSORTIUM_TYPES)[number]["id"]>("mercantile_house");
  const [message, setMessage] = useState<string | null>(null);

  const displayName = player.lastName ? `${player.name} ${player.lastName}` : player.name || "Unknown";
  const hasConsortiumWrit = (player.inventory.consortium_writ ?? 0) > 0;
  const selectedType = CONSORTIUM_TYPES.find((type) => type.id === selectedTypeId) ?? CONSORTIUM_TYPES[0];
  const foundingCost = hasConsortiumWrit ? Math.max(75_000, selectedType.baseCost - 75_000) : selectedType.baseCost;

  useEffect(() => {
    setBoard(readConsortiumBoard(player.internalId));
  }, [player.internalId]);

  const consortiumBlockReason = useMemo(() => {
    if (board) return "You already operate a consortium on this character.";
    if (consortiumName.trim().length < 3) return "Consortium name must be at least 3 characters.";
    if (consortiumTag.trim().length < 2) return "Consortium tag must be at least 2 characters.";
    if (player.gold < foundingCost) return `You need ${(foundingCost - player.gold).toLocaleString("en-GB")} more gold.`;
    return null;
  }, [board, consortiumName, consortiumTag, player.gold, foundingCost]);

  const canCreateConsortium = consortiumBlockReason === null;

  function createConsortium() {
    if (!canCreateConsortium) return;

    const paid = spendGold(foundingCost);
    if (!paid) {
      setMessage("Not enough gold to found a consortium.");
      return;
    }

    const publicId = allocatePublicNumericId(
      "consortium",
      collectExistingPublicIds(CONSORTIUM_STORAGE_PREFIX),
    );

    const nextBoard: ConsortiumBoard = {
      kind: "consortium",
      publicId,
      name: consortiumName.trim(),
      tag: consortiumTag.trim().toUpperCase().slice(0, 6),
      companyTypeId: selectedType.id,
      companyTypeName: selectedType.name,
      founderPublicId: player.publicId,
      createdAt: Date.now(),
      vault: selectedType.startingVault,
      baseIncomePerShift: selectedType.baseIncomePerShift,
      stars: 1,
      employees: [
        {
          publicId: player.publicId,
          name: displayName,
          role: "Director",
          efficiency: 100,
        },
      ],
      applicantCount: 0,
      advertisingLevel: 1,
    };

    writeJson(consortiumKey(player.internalId), nextBoard);
    setBoard(nextBoard);
    setConsortiumName("");
    setConsortiumTag("");
    setMessage(
      `Consortium founded: ${nextBoard.name} [${formatEntityPublicId("consortium", nextBoard.publicId)}]`,
    );

    if (activeAccount && authSource === "server") {
      void syncServerRuntimeState(readCachedRuntimeState(activeAccount.email));
    }
  }

  return (
    <AppShell
      title="Consortiums"
      hint="Economic organizations now behave more like real player companies: pick a type, fund it properly, then run the board."
    >
      <div style={{ display: "grid", gap: 16 }}>
        {message ? (
          <section className="panel">
            <div className="panel__body">
              <strong>{message}</strong>
            </div>
          </section>
        ) : null}

        <section className="panel">
          <div className="panel__header">
            <h2>Consortium Board</h2>
          </div>
          <div className="panel__body" style={{ display: "grid", gap: 12 }}>
            {board ? (
              <>
                <div
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8,
                    padding: 12,
                    display: "grid",
                    gap: 8,
                  }}
                >
                  <strong>
                    {board.name} [{formatEntityPublicId("consortium", board.publicId)}]
                  </strong>
                  <div style={{ color: "#9fb0bf", fontSize: 13 }}>
                    Type: {board.companyTypeName} | Tag: {board.tag} | Founded: {formatDate(board.createdAt)}
                  </div>
                  <StatusRow label="Stars" value={board.stars} />
                  <StatusRow label="Vault" value={`${board.vault.toLocaleString("en-GB")} gold`} />
                  <StatusRow label="Base Shift Income" value={`${board.baseIncomePerShift.toLocaleString("en-GB")} gold`} />
                  <StatusRow label="Applicants" value={board.applicantCount} />
                  <StatusRow label="Advertising" value={`Level ${board.advertisingLevel}`} />
                </div>

                <div
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8,
                    padding: 12,
                    display: "grid",
                    gap: 8,
                  }}
                >
                  <strong>Employees</strong>
                  {board.employees.map((employee) => (
                    <div key={`${employee.name}-${employee.role}`} className="info-row">
                      <span className="info-row__label">{employee.role}</span>
                      <span className="info-row__value">
                        {employee.name} | Efficiency {employee.efficiency}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div style={{ color: "#9fb0bf", fontSize: 13 }}>
                  Consortiums are player companies. Choose a business type, create the company, and this board becomes its operating screen.
                </div>
                <StatusRow label="Requirement" value="Name, tag, company type, and founding funds" />
                <StatusRow label="Founding Cost" value={`${foundingCost.toLocaleString("en-GB")} gold`} />
                <StatusRow label="Consortium Writ" value={hasConsortiumWrit ? "Present" : "Missing"} />
                <div className="org-choices">
                  {CONSORTIUM_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      className={`org-choice${selectedTypeId === type.id ? " org-choice--active" : ""}`}
                      onClick={() => setSelectedTypeId(type.id)}
                    >
                      <strong>{type.name}</strong>
                      <span>{type.summary}</span>
                      <span>{type.roleSummary}</span>
                      <span>{type.baseIncomePerShift} gold / shift baseline</span>
                    </button>
                  ))}
                </div>
                <div className="org-form">
                  <input
                    className="org-input"
                    value={consortiumName}
                    onChange={(event) => setConsortiumName(event.target.value)}
                    placeholder="Consortium name"
                  />
                  <input
                    className="org-input"
                    value={consortiumTag}
                    onChange={(event) => setConsortiumTag(event.target.value)}
                    placeholder="Consortium tag"
                  />
                  <button type="button" className="org-button" disabled={!canCreateConsortium} onClick={createConsortium}>
                    Create Consortium
                  </button>
                </div>
                <div style={{ fontSize: 12, color: consortiumBlockReason ? "#d98f8f" : "#8ec8a7" }}>
                  {consortiumBlockReason ?? `${selectedType.name} selected. Founding this company will create your persistent board immediately.`}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
