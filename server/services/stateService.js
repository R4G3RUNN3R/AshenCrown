import { withTransaction } from "../db/pool.js";
import {
  createDefaultPlayerState,
  findPlayerStateByUserInternalId,
  upsertPlayerRuntimeState,
} from "../repositories/playerStateRepository.js";
import { HttpError } from "../lib/errors.js";
import { findUserByInternalId } from "../repositories/usersRepository.js";
import { buildMutableRuntimeState } from "../lib/runtimePlayerState.js";

function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}

export async function syncRuntimeState(userInternalId, runtimeState) {
  const payload = asRecord(runtimeState);
  if (!payload) {
    throw new HttpError(400, "Runtime state payload is required.", "RUNTIME_STATE_REQUIRED");
  }

  return withTransaction(async (client) => {
    await createDefaultPlayerState(client, userInternalId);
    const user = await findUserByInternalId(client, userInternalId);
    const existingPlayerState = await findPlayerStateByUserInternalId(client, userInternalId);
    const existingRuntime = user && existingPlayerState
      ? buildMutableRuntimeState(user, existingPlayerState)
      : {};
    const mergedPlayer = {
      ...(existingRuntime.player ?? {}),
      ...(payload.player ?? {}),
      current: {
        ...((existingRuntime.player ?? {}).current ?? {}),
        ...((payload.player ?? {}).current ?? {}),
      },
    };
    const mergedPayload = {
      ...existingRuntime,
      ...payload,
      player: mergedPlayer,
      travel: existingRuntime.travel ?? {},
      legacy: existingRuntime.legacy ?? {},
    };
    return upsertPlayerRuntimeState(client, userInternalId, mergedPayload);
  });
}
