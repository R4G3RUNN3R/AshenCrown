import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { useAuth } from "../state/AuthContext";
import { usePlayer } from "../state/PlayerContext";
import { getPropertyById } from "../data/propertyData";
import { formatPlayerPublicId, getProfileRoute, parsePlayerPublicId } from "../lib/publicIds";
import { resolveDisplayTitle } from "../lib/titleAccess";
import { getProfileView, type ProfileResponse } from "../lib/profileApi";
import { getCityName, readTravelStateFromPlayer } from "../lib/travelState";
import "../styles/character-profile.css";

type PanelSectionProps = {
  title: string;
  children: ReactNode;
};

function PanelSection({ title, children }: PanelSectionProps) {
  return (
    <section className="character-panel">
      <div className="character-panel__header">
        <span>{title}</span>
      </div>
      <div className="character-panel__body">{children}</div>
    </section>
  );
}

function StatRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="stat-row">
      <span className="stat-row__label">{label}</span>
      <strong className="stat-row__value">{value}</strong>
    </div>
  );
}

function formatCurrencyBlock(currencies: NonNullable<ProfileResponse["selfProfile"]>["currencies"]) {
  return `${currencies.platinum}p | ${currencies.gold}g | ${currencies.silver}s | ${currencies.copper}c`;
}

function derivePlayerCurrencies(gold: number) {
  return {
    platinum: 0,
    gold,
    silver: 0,
    copper: 0,
  };
}

function formatEntityLabel(entityType: ProfileResponse["publicProfile"]["entityType"]) {
  switch (entityType) {
    case "npc":
      return "NPC";
    case "system":
      return "System";
    case "event":
      return "Event";
    default:
      return "Citizen";
  }
}

export default function ProfilePage() {
  const { publicId: publicIdParam } = useParams();
  const { player } = usePlayer();
  const { serverSessionToken } = useAuth();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetPublicId = useMemo(() => {
    const parsed = parsePlayerPublicId(publicIdParam);
    if (parsed) return formatPlayerPublicId(parsed);
    return player.publicId ? formatPlayerPublicId(player.publicId) : null;
  }, [player.publicId, publicIdParam]);
  const ownPublicId = player.publicId ? formatPlayerPublicId(player.publicId) : null;
  const isOwnRoute = Boolean(targetPublicId && ownPublicId && targetPublicId === ownPublicId);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (!targetPublicId) {
        setError("Citizen record unavailable.");
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await getProfileView(targetPublicId, serverSessionToken);
      if (cancelled) return;

      if (!result.ok) {
        setProfile(null);
        setError(isOwnRoute ? null : result.error);
        setLoading(false);
        return;
      }

      setProfile(result.profile);
      setError(null);
      setLoading(false);
    }

    void loadProfile();
    return () => {
      cancelled = true;
    };
  }, [isOwnRoute, serverSessionToken, targetPublicId]);

  const flavor = "A citizen dossier should read like a life, not a debug dump: identity, condition, affiliation, property, movement, and the bits people are actually meant to know.";

  const localPublicProfile = useMemo(() => {
    if (!isOwnRoute || !player.publicId) return null;
    const displayName = `${player.name}${player.lastName ? ` ${player.lastName}` : ""}`.trim() || "Unknown citizen";
    const meaningfulRank = typeof player.rank === "string" && player.rank && player.rank !== "0" ? player.rank : null;
    const travelState = readTravelStateFromPlayer(player);
    const isTraveling = travelState.status === "in_transit";
    const statusLabel =
      player.condition.type === "hospitalized"
        ? "Hospitalized"
        : player.condition.type === "jailed"
          ? "Jailed"
          : isTraveling
            ? "Traveling"
            : player.current.job
              ? "Working"
              : player.current.education?.name
                ? "Studying"
                : "Idle";

    return {
      internalId: player.internalId,
      name: displayName,
      publicId: player.publicId,
      title: player.title,
      entityType: "player" as const,
      level: player.level,
      rank: meaningfulRank,
      ageLabel: `${player.daysPlayed}d`,
      createdAt: Date.now() - player.daysPlayed * 86400000,
      life: {
        current: Number(player.stats.health ?? 0),
        max: Number(player.stats.maxHealth ?? 0),
      },
      lastAction: {
        isOnline: true,
        lastActionAt: Date.now(),
        label: "Online",
      },
      status: {
        label: statusLabel,
        condition: player.condition,
      },
      guild: profile?.publicProfile.guild ?? null,
      consortium: profile?.publicProfile.consortium ?? null,
      job: player.current.job ?? null,
      property: {
        propertyId: player.property.current ?? "shack",
      },
      travel: {
        summary: isTraveling
          ? `Travelling by caravan to ${getCityName(travelState.destinationCityId)}`
          : `In ${getCityName(travelState.currentCityId)}`,
      },
      bio: profile?.publicProfile.bio ?? {
        bio: null,
        signature: null,
        reservedNote: null,
      },
      legacyEntries: profile?.publicProfile.legacyEntries ?? [],
      counters: null,
    };
  }, [
    isOwnRoute,
    player.condition,
    player.current.education,
    player.current.job,
    player.current.travel,
    player.current.currentCityId,
    player.daysPlayed,
    player.internalId,
    player.lastName,
    player.level,
    player.name,
    player.property.current,
    player.publicId,
    player.rank,
    player.stats.health,
    player.stats.maxHealth,
    player.title,
    profile?.publicProfile.bio,
    profile?.publicProfile.consortium,
    profile?.publicProfile.guild,
    profile?.publicProfile.legacyEntries,
  ]);

  const resolvedPublicProfile = useMemo(() => {
    if (isOwnRoute && localPublicProfile) {
      return {
        ...(profile?.publicProfile ?? {}),
        ...localPublicProfile,
        guild: profile?.publicProfile?.guild ?? localPublicProfile.guild,
        consortium: profile?.publicProfile?.consortium ?? localPublicProfile.consortium,
        bio: profile?.publicProfile?.bio ?? localPublicProfile.bio,
        legacyEntries: profile?.publicProfile?.legacyEntries ?? localPublicProfile.legacyEntries,
      };
    }
    return profile?.publicProfile ?? null;
  }, [isOwnRoute, localPublicProfile, profile?.publicProfile]);

  const resolvedSelfProfile = useMemo(() => {
    if (isOwnRoute) {
      return {
        currencies: derivePlayerCurrencies(player.gold),
        workingStats: player.workingStats,
        battleStats: player.battleStats,
        inventoryCount: Object.values(player.inventory ?? {}).reduce((total, value) => total + Number(value ?? 0), 0),
        inventoryTypes: Object.keys(player.inventory ?? {}).length,
      };
    }
    return profile?.selfProfile ?? null;
  }, [isOwnRoute, player.battleStats, player.gold, player.inventory, player.workingStats, profile?.selfProfile]);

  if (loading) {
    return (
      <AppShell title="Character Profile" hint={flavor}>
        <div className="character-profile-page">
          <section className="character-panel">
            <div className="character-panel__body">Loading citizen record...</div>
          </section>
        </div>
      </AppShell>
    );
  }

  if ((!resolvedPublicProfile && !isOwnRoute) || error) {
    return (
      <AppShell title="Character Profile" hint={flavor}>
        <div className="character-profile-page">
          <section className="character-panel">
            <div className="character-panel__body">
              <h2 style={{ marginTop: 0 }}>Citizen Record Unavailable</h2>
              <p>{error ?? "This record could not be loaded from the live shard."}</p>
              <Link className="inline-route-link" to={getProfileRoute(player.publicId)}>
                Return to your own profile
              </Link>
            </div>
          </section>
        </div>
      </AppShell>
    );
  }

  const publicProfile = resolvedPublicProfile ?? localPublicProfile;
  const selfProfile = resolvedSelfProfile;
  const moderation = profile?.moderation ?? null;
  const viewer = {
    mode: isOwnRoute ? "self" as const : profile?.viewer.mode ?? "public",
    canModerate: profile?.viewer.canModerate ?? false,
    isSelf: isOwnRoute,
  };
  if (!publicProfile) {
    return null;
  }
  const propertyName = getPropertyById(publicProfile.property.propertyId)?.name ?? "Unknown residence";
  const displayTitle = resolveDisplayTitle(publicProfile.title, publicProfile.publicId);
  const displayNameWithPublicId = `${publicProfile.name} [${formatPlayerPublicId(publicProfile.publicId)}]`;
  const guildLabel = publicProfile.guild ? `${publicProfile.guild.name} [G${String(publicProfile.guild.publicId).padStart(7, "0")}]` : "Unaffiliated";
  const consortiumLabel = publicProfile.consortium ? `${publicProfile.consortium.name} [C${String(publicProfile.consortium.publicId).padStart(7, "0")}]` : "Independent";
  const profileMode =
    viewer.isSelf
      ? "Private record"
      : viewer.mode === "staff"
        ? "Staff oversight"
        : "Public dossier";

  return (
    <AppShell title="Character Profile" hint={flavor}>
      <div className="character-profile-page">
        <header className="character-hero">
          <div className="character-hero__identity">
            <div className="character-hero__status-dot" />
            <div>
              <h1>{displayNameWithPublicId}</h1>
              <div className="character-hero__meta">
                <span>{profileMode}</span>
                <span>{formatEntityLabel(publicProfile.entityType)}</span>
                <span>{displayTitle || "Untitled"}</span>
                <span>Level {publicProfile.level}</span>
                {publicProfile.rank ? <span>{publicProfile.rank}</span> : null}
              </div>
            </div>
          </div>

          <div className="character-hero__quickstats">
            <div className="quickstat">
              <span className="quickstat__label">Life</span>
              <strong>{publicProfile.life.current} / {publicProfile.life.max}</strong>
            </div>
            <div className="quickstat">
              <span className="quickstat__label">Age</span>
              <strong>{publicProfile.ageLabel}</strong>
            </div>
            <div className="quickstat">
              <span className="quickstat__label">Last Action</span>
              <strong>{publicProfile.lastAction.label}</strong>
            </div>
          </div>
        </header>

        <div className="character-layout">
          <div className="character-column">
            <PanelSection title="Identity">
              <div className="stat-table">
                <StatRow label="Name" value={displayNameWithPublicId} />
                <StatRow label="Title" value={displayTitle || "Untitled"} />
                <StatRow label="Level" value={publicProfile.level} />
                {publicProfile.rank ? <StatRow label="Rank" value={publicProfile.rank} /> : null}
                <StatRow label="Classification" value={formatEntityLabel(publicProfile.entityType)} />
                <StatRow label="Status" value={publicProfile.status.label} />
              </div>
            </PanelSection>

            <PanelSection title="Residence and Affiliation">
              <div className="stat-table">
                <StatRow label="Property" value={propertyName} />
                <StatRow label="Guild" value={guildLabel} />
                <StatRow label="Consortium" value={consortiumLabel} />
                <StatRow label="Current Job" value={publicProfile.job ?? "None"} />
                <StatRow label="Travel" value={publicProfile.travel.summary} />
              </div>
            </PanelSection>
          </div>

          <div className="character-column">
            <PanelSection title="Status Block">
              <div className="stat-table">
                <StatRow label="Life" value={`${publicProfile.life.current} / ${publicProfile.life.max}`} />
                <StatRow label="Presence" value={publicProfile.lastAction.isOnline ? "Online" : "Offline"} />
                <StatRow label="Last Action" value={publicProfile.lastAction.label} />
                <StatRow label="Condition" value={publicProfile.status.condition.reason ?? "No active condition"} />
              </div>
            </PanelSection>

            <PanelSection title="Legacy and Bio">
              <div style={{ display: "grid", gap: 10, color: "#d7dee6", fontSize: 13 }}>
                <div>{publicProfile.bio.bio ?? publicProfile.bio.reservedNote ?? "No public biography has been recorded yet."}</div>
                {publicProfile.bio.signature ? <div style={{ color: "#9fb0bf" }}>"{publicProfile.bio.signature}"</div> : null}
                {publicProfile.legacyEntries.length ? (
                  <div className="legacy-list">
                    {publicProfile.legacyEntries.map((entry) => (
                      <article key={entry.id} className="legacy-entry">
                        <div className="legacy-entry__date">{new Date(entry.awardedAt).toLocaleDateString("en-GB")}</div>
                        <h3>{entry.title}</h3>
                        <p>{entry.summary}</p>
                      </article>
                    ))}
                  </div>
                ) : null}
              </div>
            </PanelSection>
          </div>

          <div className="character-column">
            {viewer.isSelf && selfProfile ? (
              <PanelSection title="Private Holdings">
                <div className="stat-table">
                  <StatRow label="Currencies" value={formatCurrencyBlock(selfProfile.currencies)} />
                  <StatRow label="Inventory Count" value={selfProfile.inventoryCount} />
                  <StatRow label="Inventory Types" value={selfProfile.inventoryTypes} />
                </div>
              </PanelSection>
            ) : null}

            {viewer.isSelf && selfProfile ? (
              <PanelSection title="Private Stats">
                <div className="stat-table">
                  <StatRow label="Manual Labor" value={selfProfile.workingStats.manualLabor} />
                  <StatRow label="Intelligence" value={selfProfile.workingStats.intelligence} />
                  <StatRow label="Endurance" value={selfProfile.workingStats.endurance} />
                  <StatRow label="Strength" value={selfProfile.battleStats.strength} />
                  <StatRow label="Defense" value={selfProfile.battleStats.defense} />
                  <StatRow label="Speed" value={selfProfile.battleStats.speed} />
                  <StatRow label="Dexterity" value={selfProfile.battleStats.dexterity} />
                </div>
              </PanelSection>
            ) : null}

            {moderation ? (
              <PanelSection title="Staff View">
                <div className="stat-table">
                  <StatRow label="Email" value={moderation.email} />
                  <StatRow label="Internal ID" value={moderation.internalId} />
                  <StatRow label="Entity Type" value={moderation.entityType} />
                  <StatRow label="Privilege Role" value={moderation.privilegeRole} />
                  {moderation.reservedIdentityName ? <StatRow label="Reserved Identity" value={moderation.reservedIdentityName} /> : null}
                </div>
              </PanelSection>
            ) : null}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
