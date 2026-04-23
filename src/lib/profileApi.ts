export type ProfileResponse = {
  viewer: {
    mode: "public" | "self" | "staff";
    canModerate: boolean;
    isSelf: boolean;
  };
  publicProfile: {
    internalId: string;
    name: string;
    publicId: number;
    title: string;
    entityType: "player" | "npc" | "system" | "event";
    level: number;
    rank: string | null;
    ageLabel: string;
    createdAt: number;
    life: {
      current: number;
      max: number;
    };
    lastAction: {
      isOnline: boolean;
      lastActionAt: number | null;
      label: string;
    };
    status: {
      label: string;
      condition: {
        type: string;
        until: number | null;
        reason: string | null;
      };
    };
    guild: {
      publicId: number;
      name: string;
    } | null;
    consortium: {
      publicId: number;
      name: string;
    } | null;
    job: string | null;
    property: {
      propertyId: string;
    };
    travel: {
      summary: string;
    };
    bio: {
      bio: string | null;
      signature: string | null;
      reservedNote: string | null;
    };
    legacyEntries: Array<{
      id: string;
      title: string;
      summary: string;
      kind: string;
      awardedAt: number;
    }>;
    counters: {
      awards?: number;
      friends?: number;
      enemies?: number;
      forumPosts?: number;
    } | null;
  };
  selfProfile: {
    currencies: {
      copper: number;
      silver: number;
      gold: number;
      platinum: number;
    };
    workingStats: {
      manualLabor: number;
      intelligence: number;
      endurance: number;
    };
    battleStats: {
      strength: number;
      defense: number;
      speed: number;
      dexterity: number;
    };
    inventoryCount: number;
    inventoryTypes: number;
  } | null;
  moderation: {
    email: string;
    internalId: string;
    entityType: string;
    privilegeRole: string;
    reservedIdentityName: string | null;
  } | null;
};

type ProfileResult =
  | { ok: true; profile: ProfileResponse }
  | { ok: false; error: string };

export async function getProfileView(
  publicId: string,
  sessionToken: string | null,
): Promise<ProfileResult> {
  try {
    const response = await fetch(`/api/profiles/${encodeURIComponent(publicId)}`, {
      headers: sessionToken ? { Authorization: `Bearer ${sessionToken}` } : undefined,
    });

    const payload = (await response.json().catch(() => null)) as
      | { profile?: ProfileResponse; error?: string }
      | null;

    if (!response.ok || !payload?.profile) {
      return {
        ok: false,
        error: payload?.error ?? "Citizen record unavailable.",
      };
    }

    return {
      ok: true,
      profile: payload.profile,
    };
  } catch {
    return {
      ok: false,
      error: "Citizen record unavailable.",
    };
  }
}
