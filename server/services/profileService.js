import { withTransaction } from "../db/pool.js";
import { HttpError } from "../lib/errors.js";
import { buildMutableRuntimeState } from "../lib/runtimePlayerState.js";
import { createDefaultPlayerState, findPlayerStateByUserInternalId } from "../repositories/playerStateRepository.js";
import { findUserByPublicId, findUserByInternalId } from "../repositories/usersRepository.js";
import { resolveTravelForRuntimeState } from "./travelService.js";

function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizePublicId(publicId) {
  const match = /^P?(\d{7})$/i.exec(String(publicId ?? "").trim());
  if (!match) {
    throw new HttpError(400, "Citizen record unavailable.", "PROFILE_ID_INVALID");
  }
  return Number.parseInt(match[1], 10);
}

function buildLastAction(runtimeState) {
  const currentTravel = asRecord(runtimeState.travel);
  if (currentTravel.status === "in_transit") {
    return { isOnline: false, lastActionAt: currentTravel.departureAt ?? null, label: "Travelling by caravan" };
  }
  return { isOnline: false, lastActionAt: null, label: "Recently active" };
}

function buildTravelSummary(runtimeState) {
  const currentTravel = asRecord(runtimeState.travel);
  if (currentTravel.status === "in_transit") {
    return `Travelling by caravan to ${String(currentTravel.destinationCityId ?? "unknown").toUpperCase()}`;
  }
  return typeof runtimeState.player.current?.currentCityId === "string"
    ? `In ${String(runtimeState.player.current.currentCityId).toUpperCase()}`
    : "In Nexis City";
}

function buildLegacyEntries(runtimeState) {
  const legacy = asRecord(runtimeState.legacy);
  const entries = Array.isArray(legacy.visibleEntries) ? legacy.visibleEntries : [];
  return entries
    .map((entry, index) => {
      const record = asRecord(entry);
      return {
        id: typeof record.id === "string" ? record.id : `legacy_${index + 1}`,
        title: typeof record.title === "string" ? record.title : "Legacy Entry",
        summary: typeof record.summary === "string" ? record.summary : "A remembered Chronicle consequence remains recorded here.",
        kind: typeof record.kind === "string" ? record.kind : "chronicle",
        awardedAt: typeof record.awardedAt === "number" ? record.awardedAt : Date.now(),
      };
    })
    .slice(0, 24);
}

function buildProfileResponse(viewerUser, targetUser, playerState) {
  const runtimeState = buildMutableRuntimeState(targetUser, playerState);
  resolveTravelForRuntimeState(runtimeState);
  const guildMembership = asRecord(asRecord(runtimeState.guild).membership);
  const consortiumMembership = asRecord(asRecord(runtimeState.consortium).membership);
  const bio = asRecord(runtimeState.player.bio);
  const entityType = targetUser.entityType ?? "player";
  const privilegeRole = targetUser.privilegeRole ?? "player";
  const isSelf = Boolean(viewerUser && viewerUser.internalId === targetUser.internalId);
  const canModerate = Boolean(viewerUser && viewerUser.privilegeRole && viewerUser.privilegeRole !== "player");

  return {
    viewer: {
      mode: isSelf ? "self" : canModerate ? "staff" : "public",
      canModerate,
      isSelf,
    },
    publicProfile: {
      internalId: targetUser.internalId,
      name: `${targetUser.firstName}${targetUser.lastName ? ` ${targetUser.lastName}` : ""}`.trim(),
      publicId: targetUser.publicId,
      title: runtimeState.player.title ?? "",
      entityType,
      level: playerState.level ?? 1,
      rank: typeof runtimeState.player.rank === "string" && runtimeState.player.rank ? runtimeState.player.rank : null,
      ageLabel: typeof runtimeState.player.ageLabel === "string" && runtimeState.player.ageLabel ? runtimeState.player.ageLabel : "Newly registered",
      createdAt: targetUser.createdAt,
      life: {
        current: Number(runtimeState.player.stats?.health ?? 100),
        max: Number(runtimeState.player.stats?.maxHealth ?? 100),
      },
      lastAction: buildLastAction(runtimeState),
      status: {
        label: runtimeState.player.condition?.type === "normal" ? "Available" : String(runtimeState.player.condition?.type ?? "Available"),
        condition: runtimeState.player.condition,
      },
      guild:
        guildMembership.publicId && guildMembership.name
          ? { publicId: Number(guildMembership.publicId), name: String(guildMembership.name) }
          : null,
      consortium:
        consortiumMembership.publicId && consortiumMembership.name
          ? { publicId: Number(consortiumMembership.publicId), name: String(consortiumMembership.name) }
          : null,
      job: typeof runtimeState.player.current?.job === "string" ? runtimeState.player.current.job : null,
      property: {
        propertyId: typeof runtimeState.player.property?.current === "string" ? runtimeState.player.property.current : "shack",
      },
      travel: {
        summary: buildTravelSummary(runtimeState),
      },
      bio: {
        bio: typeof bio.bio === "string" ? bio.bio : null,
        signature: typeof bio.signature === "string" ? bio.signature : null,
        reservedNote: typeof bio.reservedNote === "string" ? bio.reservedNote : null,
      },
      counters: null,
      legacyEntries: buildLegacyEntries(runtimeState),
    },
    selfProfile: isSelf
      ? {
          currencies: runtimeState.player.currencies,
          workingStats: runtimeState.player.workingStats,
          battleStats: runtimeState.player.battleStats,
          inventoryCount: Object.values(runtimeState.player.inventory ?? {}).reduce((sum, value) => sum + Number(value ?? 0), 0),
          inventoryTypes: Object.keys(runtimeState.player.inventory ?? {}).length,
        }
      : null,
    moderation: canModerate
      ? {
          email: targetUser.email,
          internalId: targetUser.internalId,
          entityType,
          privilegeRole,
          reservedIdentityName: null,
        }
      : null,
  };
}

export async function getProfileForViewer(viewerUser, publicIdValue) {
  return withTransaction(async (client) => {
    const publicId = normalizePublicId(publicIdValue);
    const targetUser = await findUserByPublicId(client, publicId);
    if (!targetUser) {
      throw new HttpError(404, "Citizen record unavailable.", "PROFILE_NOT_FOUND");
    }

    await createDefaultPlayerState(client, targetUser.internalId);
    const playerState = await findPlayerStateByUserInternalId(client, targetUser.internalId);
    if (!playerState) {
      throw new HttpError(404, "Citizen record unavailable.", "PROFILE_STATE_NOT_FOUND");
    }

    const viewer = viewerUser?.internalId ? await findUserByInternalId(client, viewerUser.internalId) : null;
    return buildProfileResponse(viewer, targetUser, playerState);
  });
}
