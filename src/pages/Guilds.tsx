import { useEffect, useMemo, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { ContentPanel } from "../components/layout/ContentPanel";
import { usePlayer } from "../state/PlayerContext";
import { useAuth } from "../state/AuthContext";
import { mergeServerStateIntoCache } from "../lib/runtimeStateCache";
import { formatEntityPublicId } from "../lib/publicIds";
import {
  assignGuildQuestMember,
  cancelGuildQuest,
  createOrganization,
  depositGuildArmory,
  getMyOrganization,
  initiateGuildQuest,
  planGuildQuest,
  replanGuildQuest,
  recruitGuildMember,
  unlockGuildSkill,
  updateGuildSettings,
  withdrawGuildArmory,
} from "../lib/organizationApi";
import { formatDate, readGuildBoard, type GuildBoard } from "../lib/organizations";
import { cielPageCopy } from "../data/cielPageCopy";
import "../styles/guild.css";

type GuildView = GuildBoard & Record<string, any>;
type GuildTab = "public" | "members" | "wars" | "adventuring" | "passives" | "armory" | "settings";

function getSkillBranch(skillKey: string) {
  if (skillKey.includes("banner") || skillKey.includes("war") || skillKey.includes("sovereign")) return "Command";
  if (skillKey.includes("quartermaster") || skillKey.includes("logistics")) return "Logistics";
  return "Adventuring";
}

function StatusRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="info-row">
      <span className="info-row__label">{label}</span>
      <span className="info-row__value">{value}</span>
    </div>
  );
}

function formatHoursLabel(hours: number) {
  if (hours % 24 === 0) return `${hours / 24}d`;
  return `${hours}h`;
}

function formatCountdown(targetAt: number) {
  const diff = Math.max(0, targetAt - Date.now());
  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function refreshPlayerCache(
  email: string,
  user: { internalPlayerId: string; publicId: number; firstName: string; lastName: string },
  playerState: Parameters<typeof mergeServerStateIntoCache>[0]["playerState"],
) {
  mergeServerStateIntoCache({ email, user, playerState });
  window.dispatchEvent(new CustomEvent("nexis:player-refresh"));
}

export default function GuildsPage() {
  const { player } = usePlayer();
  const { activeAccount, authSource, serverSessionToken } = useAuth();
  const [board, setBoard] = useState<GuildView | null>(null);
  const [guildName, setGuildName] = useState("");
  const [guildTag, setGuildTag] = useState("");
  const [recruitPublicId, setRecruitPublicId] = useState("");
  const [armoryItemId, setArmoryItemId] = useState("");
  const [armoryQty, setArmoryQty] = useState("1");
  const [withdrawItemId, setWithdrawItemId] = useState("");
  const [withdrawQty, setWithdrawQty] = useState("1");
  const [activeTab, setActiveTab] = useState<GuildTab>("public");
  const [settingsDraft, setSettingsDraft] = useState({
    headline: "",
    recruitmentStatus: "",
    doctrine: "",
    territory: "",
    diplomacy: "",
    publicNotice: "",
    invitePolicy: "",
    warDoctrine: "",
  });
  const [questAssignments, setQuestAssignments] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const hasGuildCharter = (player.inventory.guild_charter ?? 0) > 0;
  const foundingCost = hasGuildCharter ? 50000 : 150000;
  const pageCopy = cielPageCopy.guilds;

  useEffect(() => {
    if (authSource === "server" && serverSessionToken) {
      void getMyOrganization(serverSessionToken, "guild").then((result) => {
        if ("ok" in result && result.ok === false) {
          setMessage(result.error);
          return;
        }
        setBoard((result as { organization: GuildView | null }).organization);
      });
      return;
    }
    setBoard(readGuildBoard(player.internalId) as GuildView | null);
  }, [authSource, player.internalId, serverSessionToken]);

  useEffect(() => {
    if (!board?.settingsView) return;
    setSettingsDraft({
      headline: board.settingsView.publicProfile?.headline ?? "",
      recruitmentStatus: board.settingsView.publicProfile?.recruitmentStatus ?? "",
      doctrine: board.settingsView.publicProfile?.doctrine ?? "",
      territory: board.settingsView.publicProfile?.territory ?? "",
      diplomacy: board.settingsView.publicProfile?.diplomacy ?? "",
      publicNotice: board.settingsView.publicProfile?.publicNotice ?? "",
      invitePolicy: board.settingsView.invitePolicy ?? "",
      warDoctrine: board.settingsView.warDoctrine ?? "",
    });
  }, [board?.internalId, board?.settingsView]);

  useEffect(() => {
    const currentPlan = board?.guildQuestBoard?.currentPlan;
    if (!currentPlan) {
      setQuestAssignments({});
      return;
    }
    setQuestAssignments(Object.fromEntries(currentPlan.slots.map((slot: any) => [slot.slotKey, slot.assignedMember?.publicId ? String(slot.assignedMember.publicId) : ""])));
  }, [board?.guildQuestBoard?.currentPlan]);

  const guildBlockReason = useMemo(() => {
    if (board) return "You already run a guild on this character.";
    if (guildName.trim().length < 3) return "Guild name must be at least 3 characters.";
    if (guildTag.trim().length < 2) return "Guild tag must be at least 2 characters.";
    if (player.gold < foundingCost) return `You need ${(foundingCost - player.gold).toLocaleString("en-GB")} more gold.`;
    return null;
  }, [board, guildName, guildTag, player.gold, foundingCost]);

  const canManageMembers = !!board?.viewerPermissions?.includes("recruit_members");
  const canManageDoctrine = !!board?.viewerPermissions?.includes("declare_operations");
  const canManageTreasury = !!board?.viewerPermissions?.includes("manage_treasury");
  const inventoryOptions = useMemo(
    () => Object.entries(player.inventory).filter(([, qty]) => Number(qty) > 0).map(([itemId, qty]) => ({ itemId, quantity: Number(qty) })),
    [player.inventory],
  );
  const recentWarHistory = board?.warRoom?.recentHistory ?? [];
  const activeWars = board?.warRoom?.activeWars ?? [];
  const armoryItems = board?.armory?.items ?? [];
  const skillTree = board?.skillTree ?? [];
  const skillColumns = useMemo(() => {
    const grouped = new Map<number, any[]>();
    skillTree.forEach((skill: any) => {
      const tier = Number(skill.tier ?? 1);
      const current = grouped.get(tier) ?? [];
      current.push(skill);
      grouped.set(tier, current);
    });
    return Array.from(grouped.entries())
      .sort((left, right) => left[0] - right[0])
      .map(([tier, skills]) => ({ tier, skills }));
  }, [skillTree]);

  async function reloadGuild() {
    if (authSource !== "server" || !serverSessionToken) return;
    const result = await getMyOrganization(serverSessionToken, "guild");
    if ("ok" in result && result.ok === false) {
      setMessage(result.error);
      return;
    }
    setBoard((result as { organization: GuildView | null }).organization);
  }

  async function createGuild() {
    if (guildBlockReason || authSource !== "server" || !activeAccount || !serverSessionToken) return;
    const result = await createOrganization(serverSessionToken, {
      type: "guild",
      name: guildName.trim(),
      tag: guildTag.trim(),
    });
    if ("ok" in result && result.ok === false) {
      setMessage(result.error);
      return;
    }
    const payload = result as {
      organization: GuildView;
      playerState: Parameters<typeof mergeServerStateIntoCache>[0]["playerState"];
    };
    setBoard(payload.organization);
    setGuildName("");
    setGuildTag("");
    setActiveTab("public");
    refreshPlayerCache(
      activeAccount.email,
      {
        internalPlayerId: activeAccount.internalPlayerId,
        publicId: activeAccount.publicId,
        firstName: activeAccount.firstName,
        lastName: activeAccount.lastName,
      },
      payload.playerState,
    );
    setMessage(`Guild founded: ${payload.organization.name} [${formatEntityPublicId("guild", payload.organization.publicId)}]`);
  }

  async function runGuildAction(
    runner: () => Promise<any>,
    options?: { message?: (payload: any) => string; refreshPlayerState?: boolean },
  ) {
    if (!activeAccount || !serverSessionToken) return;
    const result = await runner();
    if ("ok" in result && result.ok === false) {
      setMessage(result.error);
      return;
    }
    const payload = result as { organization?: GuildView; playerState?: Parameters<typeof mergeServerStateIntoCache>[0]["playerState"] };
    if (payload.organization) setBoard(payload.organization);
    if (payload.playerState && options?.refreshPlayerState) {
      refreshPlayerCache(
        activeAccount.email,
        {
          internalPlayerId: activeAccount.internalPlayerId,
          publicId: activeAccount.publicId,
          firstName: activeAccount.firstName,
          lastName: activeAccount.lastName,
        },
        payload.playerState,
      );
    }
    if (options?.message) setMessage(options.message(payload));
  }

  const commandCards = board
    ? [
        {
          label: "Reputation",
          value: `${board.guildPassives?.reputation?.toLocaleString("en-GB") ?? 0}`,
          note: `${board.guildPassives?.availablePoints ?? 0} skill points ready`,
        },
        {
          label: "Members",
          value: `${board.memberDetails?.length ?? board.members.length}`,
          note: board.settingsView?.invitePolicy ?? "Officer Approval",
        },
        {
          label: "War Readiness",
          value: `${board.warRoom?.readiness ?? 0}`,
          note: `${board.warRoom?.warRating ?? 0} war rating`,
        },
        {
          label: "Armory",
          value: `${board.armory?.items?.reduce((sum: number, entry: { quantity: number }) => sum + entry.quantity, 0) ?? 0} items`,
          note: `${board.treasury.gold.toLocaleString("en-GB")} gold in treasury`,
        },
      ]
    : [
        {
          label: "Founding Cost",
          value: `${foundingCost.toLocaleString("en-GB")} gold`,
          note: hasGuildCharter ? "Charter present, so the paperwork only mildly resents you." : "No charter filed. Treasury brute force remains fashionable.",
        },
        {
          label: "Requirement",
          value: "Name + tag",
          note: "Guilds keep their banner mark. Consortiums got the tag exemption instead.",
        },
        {
          label: "Interior",
          value: "Public + internal",
          note: "Public dossier, members, wars, adventuring, passives, armory, and settings live inside the same guild spine.",
        },
        {
          label: "Current Standing",
          value: "Unaffiliated",
          note: "No active guild record tied to this character yet.",
        },
      ];

  const tabs: Array<{ key: GuildTab; label: string }> = [
    { key: "public", label: "Public Profile" },
    { key: "members", label: "Members" },
    { key: "wars", label: "Wars" },
    { key: "adventuring", label: "Adventuring" },
    { key: "passives", label: "Passives" },
    { key: "armory", label: "Armory" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <AppShell title="Guilds" hint={pageCopy.flavor}>
      <div className="page-intro-grid">
        <ContentPanel title="Guildhall Brief">
          <p className="page-intro__lead">{pageCopy.flavor}</p>
          <p className="page-intro__body">{pageCopy.alt}</p>
        </ContentPanel>
        <ContentPanel title="CIEL">
          <p className="page-intro__body">{pageCopy.ciel}</p>
        </ContentPanel>
      </div>

      <div className="guild-command-strip">
        {commandCards.map((card) => (
          <section key={card.label} className="guild-command-card">
            <div className="guild-command-card__label">{card.label}</div>
            <div className="guild-command-card__value">{card.value}</div>
            <div className="guild-command-card__note">{card.note}</div>
          </section>
        ))}
      </div>

      {message ? (
        <section className="panel guild-message-panel">
          <div className="panel__body">
            <strong>{message}</strong>
          </div>
        </section>
      ) : null}

      {!board ? (
        <div className="guild-layout">
          <div className="guild-column guild-column--wide">
            <ContentPanel title="Found a Guild">
              <div className="guild-stack">
                <section className="guild-card guild-card--hero">
                  <div className="guild-card__eyebrow">Guild formation</div>
                  <div className="guild-card__title">Raise a banner that actually means something</div>
                  <div className="guild-card__body">
                    Guilds now run as public-facing charters with an internal command structure, dungeon board, passives, and armory. Which is considerably more useful than our earlier habit of stopping at “you made one, anyway good luck.”
                  </div>
                </section>

                <section className="guild-card">
                  <div className="guild-card__section-title">Founding Requirements</div>
                  <StatusRow label="Guild Charter" value={hasGuildCharter ? "Filed" : "Missing"} />
                  <StatusRow label="Founding Cost" value={`${foundingCost.toLocaleString("en-GB")} gold`} />
                  <StatusRow label="Banner Mark" value="Guild tag required" />
                </section>

                <section className="guild-card">
                  <div className="guild-card__section-title">Formation Ledger</div>
                  <div className="org-form">
                    <input className="org-input" value={guildName} onChange={(event) => setGuildName(event.target.value)} placeholder="Guild name" />
                    <input className="org-input" value={guildTag} onChange={(event) => setGuildTag(event.target.value)} placeholder="Guild tag" />
                    <button type="button" className="org-button" disabled={guildBlockReason !== null} onClick={createGuild}>
                      Create Guild
                    </button>
                  </div>
                  <div className={`guild-inline-note${guildBlockReason ? " guild-inline-note--warning" : ""}`}>
                    {guildBlockReason ?? "Founding this guild creates the real live guild command board immediately."}
                  </div>
                </section>
              </div>
            </ContentPanel>
          </div>

          <div className="guild-column">
            <ContentPanel title="What changes after founding">
              <div className="guild-stack">
                <section className="guild-card">
                  <div className="guild-card__section-title">Public dossier</div>
                  <div className="guild-card__body guild-card__body--small">
                    The guild master controls what outsiders read: doctrine, territory, recruitment status, and the public notice pinned to the charter.
                  </div>
                </section>
                <section className="guild-card">
                  <div className="guild-card__section-title">Internal sections</div>
                  <div className="guild-card__body guild-card__body--small">
                    Members, wars, adventuring dungeons, passives, armory, and settings all live under one internal guild shell instead of being scattered like confetti after a regrettable parade.
                  </div>
                </section>
              </div>
            </ContentPanel>
          </div>
        </div>
      ) : (
        <div className="guild-stack">
          <ContentPanel title="Guild Interior">
            <div className="guild-card guild-card--hero">
              <div className="guild-card__eyebrow">Internal command</div>
              <div className="guild-card__title">
                {board.name} <span>[{formatEntityPublicId("guild", board.publicId)}]</span>
              </div>
              <div className="guild-card__subline">
                Tag {board.tag} | Founded {formatDate(board.createdAt)} | {board.statusText}
              </div>
              <div className="guild-card__body">{board.publicProfile?.headline ?? board.description}</div>
            </div>

            <div className="guild-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`guild-tab${activeTab === tab.key ? " guild-tab--active" : ""}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </ContentPanel>

          {activeTab === "public" ? (
            <div className="guild-layout">
              <div className="guild-column guild-column--wide">
                <ContentPanel title="Public Guild Dossier">
                  <div className="guild-stack">
                    <section className="guild-card">
                      <div className="guild-card__section-title">What outsiders see</div>
                      <StatusRow label="Headline" value={board.publicProfile?.headline ?? "No headline set"} />
                      <StatusRow label="Recruitment" value={board.publicProfile?.recruitmentStatus ?? "Unlisted"} />
                      <StatusRow label="Doctrine" value={board.publicProfile?.doctrine ?? "Unrecorded"} />
                      <StatusRow label="Territory" value={board.publicProfile?.territory ?? "Unknown"} />
                      <StatusRow label="Diplomacy" value={board.publicProfile?.diplomacy ?? "Unrecorded"} />
                    </section>
                    <section className="guild-card">
                      <div className="guild-card__section-title">Public Notice</div>
                      <div className="guild-card__body">{board.publicProfile?.publicNotice ?? "No public notice recorded."}</div>
                    </section>
                  </div>
                </ContentPanel>
              </div>
              <div className="guild-column">
                <ContentPanel title="Standing">
                  <div className="guild-stack">
                    <section className="guild-card">
                      <div className="guild-card__section-title">Guild Standing</div>
                      <StatusRow label="Reputation" value={board.guildPassives?.reputation ?? 0} />
                      <StatusRow label="Members" value={board.memberDetails?.length ?? 0} />
                      <StatusRow label="War Readiness" value={board.warRoom?.readiness ?? 0} />
                    </section>
                  </div>
                </ContentPanel>
              </div>
            </div>
          ) : null}

          {activeTab === "members" ? (
            <div className="guild-layout">
              <div className="guild-column guild-column--wide">
                <ContentPanel title="Member Ledger">
                  <div className="guild-roster guild-roster--detailed">
                    {(board.memberDetails ?? []).map((member: any) => (
                      <div key={member.userInternalId} className="guild-roster__card">
                        <div>
                          <div className="guild-roster__name">{member.displayName}</div>
                          <div className="guild-roster__meta">{member.roleDisplayName} | Level {member.level} | {member.title ?? "Untitled"}</div>
                        </div>
                        <div className="guild-roster__stats">
                          <span>{member.location}</span>
                          <span>{member.status}</span>
                          <span>{member.life.current} / {member.life.max} life</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ContentPanel>
              </div>
              <div className="guild-column">
                <ContentPanel title="Recruitment">
                  <div className="guild-stack">
                    <section className="guild-card">
                      <div className="guild-card__section-title">Invite by Public ID</div>
                      <div className="org-form">
                        <input className="org-input" value={recruitPublicId} onChange={(event) => setRecruitPublicId(event.target.value)} placeholder="P1000000" />
                        <button type="button" className="org-button" disabled={!canManageMembers || recruitPublicId.trim().length < 7} onClick={() => runGuildAction(() => recruitGuildMember(serverSessionToken!, board.internalId, recruitPublicId.trim()), { message: () => "Guild member recruited. The roster just became less lonely." })}>
                          Recruit Member
                        </button>
                      </div>
                      <div className={`guild-inline-note${canManageMembers ? "" : " guild-inline-note--warning"}`}>
                        {canManageMembers ? "Use this for direct guild invitations while proper public applications are still warming up." : "Only guild leadership can recruit members."}
                      </div>
                    </section>
                  </div>
                </ContentPanel>
              </div>
            </div>
          ) : null}

          {activeTab === "wars" ? (
            <div className="guild-layout">
              <div className="guild-column guild-column--wide">
                <ContentPanel title="War Room">
                  <div className="guild-stack">
                    <section className="guild-card">
                      <div className="guild-card__section-title">Operational Readiness</div>
                      <StatusRow label="Doctrine" value={board.warRoom?.doctrine ?? "No doctrine set"} />
                      <StatusRow label="Readiness" value={board.warRoom?.readiness ?? 0} />
                      <StatusRow label="War Rating" value={board.warRoom?.warRating ?? 0} />
                    </section>
                    <section className="guild-card">
                      <div className="guild-card__section-title">Campaign History</div>
                      <div className="guild-history">
                        {recentWarHistory.length ? (recentWarHistory as any[]).map((entry) => (
                          <div key={`${entry.createdAt}-${entry.summary}`} className="guild-history__row">
                            <span>{entry.summary}</span>
                            <span>{formatDate(entry.createdAt)}</span>
                          </div>
                        )) : <div className="guild-card__body guild-card__body--small">No declared wars yet. Which is probably wise, given how many people still confuse planning with vibes.</div>}
                      </div>
                    </section>
                  </div>
                </ContentPanel>
              </div>
              <div className="guild-column">
                <ContentPanel title="Current Conflicts">
                  <div className="guild-stack">
                    {activeWars.length ? (activeWars as any[]).map((entry) => (
                      <section key={`${entry.target}-${entry.startedAt}`} className="guild-card">
                        <StatusRow label="Target" value={entry.target} />
                        <StatusRow label="Status" value={entry.status} />
                        <StatusRow label="Started" value={formatDate(entry.startedAt)} />
                      </section>
                    )) : (
                      <section className="guild-card">
                        <div className="guild-card__section-title">No active wars</div>
                        <div className="guild-card__body guild-card__body--small">The war room is live, the ledgers are ready, and the guild is not yet stupid enough to be in three conflicts at once.</div>
                      </section>
                    )}
                  </div>
                </ContentPanel>
              </div>
            </div>
          ) : null}

          {activeTab === "adventuring" ? (
            <div className="guild-layout">
              <div className="guild-column guild-column--wide">
                <ContentPanel title="Guild Quests">
                  <div className="guild-stack">
                    {board.guildQuestBoard?.currentPlan ? (
                      <section className="guild-card guild-card--hero">
                        <div className="guild-card__eyebrow">Planning phase</div>
                        <div className="guild-card__title">{board.guildQuestBoard.currentPlan.displayName}</div>
                        <div className="guild-card__subline">
                          Ready in {formatCountdown(board.guildQuestBoard.currentPlan.readyAt)} | Planned by {board.guildQuestBoard.currentPlan.plannedBy.displayName}
                        </div>
                        <div className="guild-card__body">{board.guildQuestBoard.currentPlan.summary}</div>
                        <div className="guild-quest-actions">
                          <button type="button" className="org-button" disabled={!canManageDoctrine || !board.guildQuestBoard.currentPlan.canInitiate} onClick={() => runGuildAction(() => initiateGuildQuest(serverSessionToken!, board.internalId), { message: () => `${board.guildQuestBoard?.currentPlan?.displayName ?? "Guild quest"} initiated.` })}>
                            Initiate Quest
                          </button>
                          <button type="button" className="org-button" disabled={!canManageDoctrine} onClick={() => runGuildAction(() => cancelGuildQuest(serverSessionToken!, board.internalId), { message: () => "Quest plan cancelled." })}>
                            Cancel Plan
                          </button>
                        </div>
                        <div className={`guild-inline-note${board.guildQuestBoard.currentPlan.blockedReason ? " guild-inline-note--warning" : ""}`}>
                          {board.guildQuestBoard.currentPlan.blockedReason ?? "All members are assigned and the quest is ready to initiate once planning finishes."}
                        </div>
                      </section>
                    ) : (
                      <section className="guild-card">
                        <div className="guild-card__section-title">Quest planning board</div>
                        <div className="guild-card__body guild-card__body--small">
                          This now follows the organized-operation spine: plan a quest, staff every slot, wait out the preparation timer, then initiate when all members are okay. Bureaucracy, but with better loot.
                        </div>
                        <button type="button" className="org-button" disabled={!canManageDoctrine || !(board.guildQuestBoard?.history ?? []).length} onClick={() => runGuildAction(() => replanGuildQuest(serverSessionToken!, board.internalId), { message: () => "Previous crew submitted for planning again." })}>
                          Plan Last Crew Again
                        </button>
                      </section>
                    )}

                    {board.guildQuestBoard?.currentPlan ? (
                      <section className="guild-card">
                        <div className="guild-card__section-title">Assigned roles</div>
                        <div className="guild-quest-slot-list">
                          {board.guildQuestBoard.currentPlan.slots.map((slot: any) => {
                            const currentAssignedId = questAssignments[slot.slotKey] ?? "";
                            const currentAssigned = slot.assignedMember ? [{ publicId: slot.assignedMember.publicId, displayName: slot.assignedMember.displayName, level: slot.assignedMember.level, status: slot.assignedMember.status, location: slot.assignedMember.location, isQuestReady: slot.assignedMember.isOkay, questBlockReason: slot.assignedMember.unavailableReason }] : [];
                            const pool = [...currentAssigned, ...((board.questMemberPool ?? []).filter((member: any) => member.publicId !== slot.assignedMember?.publicId))];
                            return (
                              <div key={slot.slotKey} className="guild-quest-slot">
                                <div className="guild-quest-slot__meta">
                                  <strong>{slot.label}</strong>
                                  <span>{slot.focus}</span>
                                </div>
                                <div className="guild-quest-slot__body">
                                  <select className="org-input" value={currentAssignedId} onChange={(event) => setQuestAssignments((current) => ({ ...current, [slot.slotKey]: event.target.value }))}>
                                    <option value="">Assign guild member</option>
                                    {pool.map((member: any) => (
                                      <option key={`${slot.slotKey}-${member.publicId}`} value={member.publicId}>
                                        {member.displayName} | Lv {member.level} | {member.status}
                                      </option>
                                    ))}
                                  </select>
                                  <button type="button" className="org-button" disabled={!canManageDoctrine || !questAssignments[slot.slotKey]} onClick={() => runGuildAction(() => assignGuildQuestMember(serverSessionToken!, board.internalId, slot.slotKey, questAssignments[slot.slotKey]), { message: () => `${slot.label} assigned.` })}>
                                    Assign
                                  </button>
                                </div>
                                <div className={`guild-inline-note${slot.assignedMember && !slot.assignedMember.isOkay ? " guild-inline-note--warning" : ""}`}>
                                  {slot.assignedMember ? `${slot.assignedMember.displayName} | ${slot.assignedMember.location}${slot.assignedMember.unavailableReason ? ` | ${slot.assignedMember.unavailableReason}` : ""}` : "No one assigned yet."}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    ) : null}

                    <section className="guild-card">
                      <div className="guild-card__section-title">Available guild quests</div>
                      <div className="guild-grid">
                        {(board.guildQuestBoard?.templates ?? []).map((quest: any) => (
                          <section key={quest.key} className="guild-card guild-card--nested">
                            <div className="guild-card__title">{quest.displayName}</div>
                            <div className="guild-card__body guild-card__body--small">{quest.summary}</div>
                            <StatusRow label="Planning Time" value={formatHoursLabel(quest.planningHours)} />
                            <StatusRow label="Members Required" value={quest.requiredMembers} />
                            <StatusRow label="Guild Rewards" value={`${quest.reputationReward} rep, ${quest.treasuryGoldReward.toLocaleString("en-GB")} gold`} />
                            <StatusRow label="Member Cut" value={`${quest.memberGoldReward.toLocaleString("en-GB")} gold each`} />
                            <button type="button" className="org-button" disabled={!canManageDoctrine || !quest.canPlan} onClick={() => runGuildAction(() => planGuildQuest(serverSessionToken!, board.internalId, quest.key), { message: () => `${quest.displayName} entered planning.` })}>
                              Plan Quest
                            </button>
                            <div className={`guild-inline-note${quest.blockedReason ? " guild-inline-note--warning" : ""}`}>
                              {quest.blockedReason ?? "Ready to enter planning."}
                            </div>
                          </section>
                        ))}
                      </div>
                    </section>
                  </div>
                </ContentPanel>
              </div>
              <div className="guild-column">
                <ContentPanel title="Quest History">
                  <div className="guild-stack">
                    {(board.guildQuestBoard?.history ?? []).length ? (board.guildQuestBoard?.history ?? []).map((entry: any) => (
                      <section key={`${entry.questKey}-${entry.createdAt}`} className="guild-card">
                        <div className="guild-card__section-title">{entry.outcome === "success" ? "Successful run" : "Failed run"}</div>
                        <div className="guild-card__title">{entry.displayName}</div>
                        <div className="guild-card__body guild-card__body--small">{entry.summary}</div>
                        <StatusRow label="Guild Reputation" value={entry.reputationGain} />
                        <StatusRow label="Treasury Gold" value={entry.treasuryGoldGain.toLocaleString("en-GB")} />
                        <StatusRow label="Completed" value={formatDate(entry.createdAt)} />
                      </section>
                    )) : (
                      <section className="guild-card">
                        <div className="guild-card__section-title">No operations logged</div>
                        <div className="guild-card__body guild-card__body--small">
                          Plan a guild quest, let the timer mature, then initiate it. The guild log will keep the outcome so you can re-run crews instead of assembling them from memory like an exhausted quartermaster.
                        </div>
                      </section>
                    )}
                  </div>
                </ContentPanel>
              </div>
            </div>
          ) : null}

          {activeTab === "passives" ? (
            <div className="guild-layout">
              <div className="guild-column guild-column--wide">
                <ContentPanel title="Guild Passives">
                  <div className="guild-stack">
                    <section className="guild-card">
                      <div className="guild-card__section-title">Accumulation</div>
                      <StatusRow label="Reputation" value={board.guildPassives?.reputation ?? 0} />
                      <StatusRow label="Daily Renown" value={board.guildPassives?.dailyRenown ?? 0} />
                      <StatusRow label="Skill Points Available" value={board.guildPassives?.availablePoints ?? 0} />
                    </section>
                    <section className="guild-card">
                      <div className="guild-card__section-title">Skill Tree</div>
                      <div className="guild-skill-board">
                        {skillColumns.map((column) => (
                          <div key={column.tier} className="guild-skill-column">
                            <div className="guild-skill-column__header">Tier {column.tier}</div>
                            <div className="guild-skill-column__stack">
                              {column.skills.map((skill: any) => (
                                <div key={skill.key} className={`guild-skill-node${skill.unlocked ? " guild-skill-node--unlocked" : ""}`}>
                                  <div className="guild-skill-node__branch">{getSkillBranch(skill.key)}</div>
                                  <div className="guild-skill-node__topline">
                                    <strong>{skill.displayName}</strong>
                                    <span>{skill.pointCost} pt</span>
                                  </div>
                                  <div className="guild-card__body guild-card__body--small">{skill.effectSummary}</div>
                                  <div className="guild-skill-node__requirements">
                                    {skill.prerequisites?.length ? `Requires ${skill.prerequisites.join(" / ").replace(/_/g, " ")}.` : "Foundation node."}
                                  </div>
                                  <div className="guild-skill-node__footer">
                                    <span className={`guild-skill-node__status${skill.unlocked ? " guild-skill-node__status--unlocked" : ""}`}>
                                      {skill.unlocked ? "Unlocked" : "Locked"}
                                    </span>
                                    <button type="button" className="org-button" disabled={!canManageDoctrine || skill.unlocked} onClick={() => runGuildAction(() => unlockGuildSkill(serverSessionToken!, board.internalId, skill.key), { message: () => `${skill.displayName} unlocked for the guild.` })}>
                                      {skill.unlocked ? "Owned" : "Unlock"}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </ContentPanel>
              </div>
              <div className="guild-column">
                <ContentPanel title="Current Bonuses">
                  <div className="guild-stack">
                    <section className="guild-card">
                      <div className="guild-card__section-title">Passive Summary</div>
                      <div className="guild-card__body guild-card__body--small">
                        {board.passiveBonusSummary || "No guild skills unlocked yet."}
                      </div>
                    </section>
                    <section className="guild-card guild-card--hero">
                      <div className="guild-card__section-title">Faction Skill Ledger</div>
                      <StatusRow label="Available Points" value={board.guildPassives?.availablePoints ?? 0} />
                      <StatusRow label="Unlocked Nodes" value={skillTree.filter((skill: any) => skill.unlocked).length} />
                      <div className="guild-card__body guild-card__body--small">
                        Built to read like a real faction progression board now, instead of a stack of admin memos pretending to be strategy.
                      </div>
                    </section>
                  </div>
                </ContentPanel>
              </div>
            </div>
          ) : null}

          {activeTab === "armory" ? (
            <div className="guild-layout">
              <div className="guild-column guild-column--wide">
                <ContentPanel title="Guild Armory">
                  <div className="guild-stack">
                    <section className="guild-card">
                      <div className="guild-card__section-title">Stored Equipment</div>
                      <div className="guild-history">
                        {armoryItems.length ? (armoryItems as any[]).map((entry) => (
                          <div key={entry.itemId} className="guild-history__row">
                            <span>{entry.label}</span>
                            <span>x{entry.quantity}</span>
                          </div>
                        )) : <div className="guild-card__body guild-card__body--small">Armory is empty. A majestic sentence for a deeply unimpressive state of affairs.</div>}
                      </div>
                    </section>
                  </div>
                </ContentPanel>
              </div>
              <div className="guild-column">
                <ContentPanel title="Armory Controls">
                  <div className="guild-stack">
                    <section className="guild-card">
                      <div className="guild-card__section-title">Deposit Item</div>
                      <div className="org-form">
                        <select className="org-input" value={armoryItemId} onChange={(event) => setArmoryItemId(event.target.value)}>
                          <option value="">Select inventory item</option>
                          {inventoryOptions.map((entry) => (
                            <option key={entry.itemId} value={entry.itemId}>{entry.itemId} x{entry.quantity}</option>
                          ))}
                        </select>
                        <input className="org-input" value={armoryQty} onChange={(event) => setArmoryQty(event.target.value)} placeholder="Quantity" />
                        <button type="button" className="org-button" disabled={!armoryItemId} onClick={() => runGuildAction(() => depositGuildArmory(serverSessionToken!, board.internalId, armoryItemId, Number(armoryQty || 1)), { refreshPlayerState: true, message: () => "Item deposited into the guild armory." })}>
                          Deposit
                        </button>
                      </div>
                    </section>
                    <section className="guild-card">
                      <div className="guild-card__section-title">Withdraw Item</div>
                      <div className="org-form">
                        <select className="org-input" value={withdrawItemId} onChange={(event) => setWithdrawItemId(event.target.value)}>
                          <option value="">Select armory item</option>
                          {(board.armory?.items ?? []).map((entry: any) => (
                            <option key={entry.itemId} value={entry.itemId}>{entry.label} x{entry.quantity}</option>
                          ))}
                        </select>
                        <input className="org-input" value={withdrawQty} onChange={(event) => setWithdrawQty(event.target.value)} placeholder="Quantity" />
                        <button type="button" className="org-button" disabled={!canManageTreasury || !withdrawItemId} onClick={() => runGuildAction(() => withdrawGuildArmory(serverSessionToken!, board.internalId, withdrawItemId, Number(withdrawQty || 1)), { refreshPlayerState: true, message: () => "Item withdrawn from the guild armory." })}>
                          Withdraw
                        </button>
                      </div>
                      <div className={`guild-inline-note${canManageTreasury ? "" : " guild-inline-note--warning"}`}>
                        {canManageTreasury ? "Treasury-ranked members can issue armory withdrawals." : "Only guildmaster and officers may withdraw from the armory."}
                      </div>
                    </section>
                  </div>
                </ContentPanel>
              </div>
            </div>
          ) : null}

          {activeTab === "settings" ? (
            <ContentPanel title="Guild Settings">
              <div className="guild-layout">
                <div className="guild-column guild-column--wide">
                  <div className="guild-card">
                    <div className="guild-card__section-title">Public Charter Settings</div>
                    <div className="org-form">
                      <input className="org-input" value={settingsDraft.headline} onChange={(event) => setSettingsDraft((current) => ({ ...current, headline: event.target.value }))} placeholder="Headline" />
                      <input className="org-input" value={settingsDraft.recruitmentStatus} onChange={(event) => setSettingsDraft((current) => ({ ...current, recruitmentStatus: event.target.value }))} placeholder="Recruitment status" />
                      <input className="org-input" value={settingsDraft.doctrine} onChange={(event) => setSettingsDraft((current) => ({ ...current, doctrine: event.target.value }))} placeholder="Doctrine" />
                      <input className="org-input" value={settingsDraft.territory} onChange={(event) => setSettingsDraft((current) => ({ ...current, territory: event.target.value }))} placeholder="Territory" />
                      <input className="org-input" value={settingsDraft.diplomacy} onChange={(event) => setSettingsDraft((current) => ({ ...current, diplomacy: event.target.value }))} placeholder="Diplomacy" />
                      <textarea className="org-input guild-textarea" value={settingsDraft.publicNotice} onChange={(event) => setSettingsDraft((current) => ({ ...current, publicNotice: event.target.value }))} placeholder="Public notice" />
                    </div>
                  </div>
                </div>
                <div className="guild-column">
                  <div className="guild-card">
                    <div className="guild-card__section-title">Command Settings</div>
                    <div className="org-form">
                      <input className="org-input" value={settingsDraft.invitePolicy} onChange={(event) => setSettingsDraft((current) => ({ ...current, invitePolicy: event.target.value }))} placeholder="Invite policy" />
                      <input className="org-input" value={settingsDraft.warDoctrine} onChange={(event) => setSettingsDraft((current) => ({ ...current, warDoctrine: event.target.value }))} placeholder="War doctrine" />
                      <button type="button" className="org-button" disabled={!canManageDoctrine} onClick={() => runGuildAction(() => updateGuildSettings(serverSessionToken!, board.internalId, settingsDraft), { message: () => "Guild settings updated. Outsiders will now read the revised doctrine instead of the old one." })}>
                        Save Settings
                      </button>
                    </div>
                    <div className={`guild-inline-note${canManageDoctrine ? "" : " guild-inline-note--warning"}`}>
                      {canManageDoctrine ? "Guildmaster-only command settings. Because anarchy is rarely a productivity tool." : "Only the guildmaster can rewrite the public dossier and doctrine."}
                    </div>
                  </div>
                </div>
              </div>
            </ContentPanel>
          ) : null}
        </div>
      )}
    </AppShell>
  );
}
