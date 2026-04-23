const DEFAULT_STATS = {
  energy: 100,
  maxEnergy: 100,
  health: 100,
  maxHealth: 100,
  stamina: 10,
  maxStamina: 10,
  comfort: 100,
  maxComfort: 100,
  nerve: 16,
  maxNerve: 84,
  chain: 0,
  maxChain: 10,
};

const DEFAULT_WORKING_STATS = {
  manualLabor: 10,
  intelligence: 10,
  endurance: 10,
};

const DEFAULT_BATTLE_STATS = {
  strength: 10,
  defense: 10,
  speed: 10,
  dexterity: 10,
};

function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function asNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function normalizeCondition(value) {
  const record = asRecord(value);
  const type = typeof record.type === "string" ? record.type : "normal";
  if (type === "hospitalized" || type === "jailed") {
    return {
      type,
      until: typeof record.until === "number" ? record.until : null,
      reason: typeof record.reason === "string" ? record.reason : null,
    };
  }
  return { type: "normal", until: null, reason: null };
}

function normalizeTravelState(value) {
  const record = asRecord(value);
  const status = record.status === "in_transit" ? "in_transit" : "idle";
  return {
    status,
    originCityId: typeof record.originCityId === "string" ? record.originCityId : "nexis",
    destinationCityId: typeof record.destinationCityId === "string" ? record.destinationCityId : null,
    routeType: typeof record.routeType === "string" ? record.routeType : "road",
    mode: typeof record.mode === "string" ? record.mode : "caravan",
    departureAt: typeof record.departureAt === "number" ? record.departureAt : null,
    arrivalAt: typeof record.arrivalAt === "number" ? record.arrivalAt : null,
    durationMs: typeof record.durationMs === "number" ? record.durationMs : null,
    currentCityId: typeof record.currentCityId === "string" ? record.currentCityId : "nexis",
    arrivalNotice:
      record.arrivalNotice && typeof record.arrivalNotice === "object"
        ? {
            destinationCityId:
              typeof record.arrivalNotice.destinationCityId === "string"
                ? record.arrivalNotice.destinationCityId
                : null,
            destinationName:
              typeof record.arrivalNotice.destinationName === "string"
                ? record.arrivalNotice.destinationName
                : null,
            arrivedAt:
              typeof record.arrivalNotice.arrivedAt === "number"
                ? record.arrivalNotice.arrivedAt
                : null,
          }
        : null,
  };
}

export function buildMutableRuntimeState(user, playerState) {
  const runtime = asRecord(playerState?.runtimeState);
  const player = asRecord(runtime.player);
  const current = asRecord(player.current);
  const travel = normalizeTravelState(runtime.travel ?? current.travel);
  const gold = Math.max(0, Math.floor(asNumber(player.gold, playerState?.gold ?? 500)));
  const currencies = {
    copper: Math.max(0, Math.floor(asNumber(player.currencies?.copper, 0))),
    silver: Math.max(0, Math.floor(asNumber(player.currencies?.silver, 0))),
    gold,
    platinum: Math.max(0, Math.floor(asNumber(player.currencies?.platinum, 0))),
  };

  return {
    player: {
      internalId: user.internalId,
      publicId: user.publicId,
      name: typeof player.name === "string" && player.name ? player.name : user.firstName,
      lastName:
        typeof player.lastName === "string" && player.lastName ? player.lastName : user.lastName,
      title: typeof player.title === "string" ? player.title : "",
      rank: typeof player.rank === "string" ? player.rank : null,
      ageLabel: typeof player.ageLabel === "string" ? player.ageLabel : "Newly registered",
      createdAt: typeof player.createdAt === "number" ? player.createdAt : Date.now(),
      daysPlayed: Math.max(0, Math.floor(asNumber(player.daysPlayed, 0))),
      experience: Math.max(0, Math.floor(asNumber(player.experience, 0))),
      level: Math.max(1, Math.floor(asNumber(player.level, playerState?.level ?? 1))),
      gold,
      currencies,
      isRegistered: true,
      inventory: asRecord(player.inventory),
      property: {
        current:
          typeof asRecord(player.property).current === "string"
            ? asRecord(player.property).current
            : "shack",
        comfortProvided: asNumber(asRecord(player.property).comfortProvided, 100),
        installedUpgrades: Array.isArray(asRecord(player.property).installedUpgrades)
          ? asRecord(player.property).installedUpgrades.filter((entry) => typeof entry === "string")
          : [],
      },
      stats: {
        ...DEFAULT_STATS,
        ...asRecord(playerState?.stats),
        ...asRecord(player.stats),
      },
      workingStats: {
        ...DEFAULT_WORKING_STATS,
        ...asRecord(playerState?.workingStats),
        ...asRecord(player.workingStats),
      },
      battleStats: {
        ...DEFAULT_BATTLE_STATS,
        ...asRecord(playerState?.battleStats),
        ...asRecord(player.battleStats),
      },
      current: {
        education: current.education ?? null,
        job:
          typeof current.job === "string"
            ? current.job
            : typeof asRecord(playerState?.currentJob).current === "string"
              ? asRecord(playerState.currentJob).current
              : null,
        travel,
        currentCityId:
          typeof current.currentCityId === "string"
            ? current.currentCityId
            : travel.currentCityId,
      },
      condition: normalizeCondition(player.condition),
      bio: asRecord(player.bio),
      counters: asRecord(player.counters),
    },
    jobs: asRecord(runtime.jobs),
    education: asRecord(runtime.education),
    arena: asRecord(runtime.arena),
    timers: asRecord(runtime.timers),
    guild: asRecord(runtime.guild),
    consortium: asRecord(runtime.consortium),
    travel,
    civicEmployment: asRecord(runtime.civicEmployment),
    legacy: asRecord(runtime.legacy),
  };
}
