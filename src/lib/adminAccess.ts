export const ABSOLUTE_OWNER_PUBLIC_ID = 1_000_000;

// Reserved administrator slots for command-only assets.
// Hennet remains the absolute owner; extra administrator identities can be
// assigned one of these reserved public IDs when needed.
const ADMIN_RESERVED_PUBLIC_IDS = new Set<number>([
  ABSOLUTE_OWNER_PUBLIC_ID,
  1_000_010,
  1_000_011,
  1_000_012,
  1_000_013,
]);

export function isAbsoluteOwner(publicId: number | null | undefined) {
  return publicId === ABSOLUTE_OWNER_PUBLIC_ID;
}

export function isAdministrator(publicId: number | null | undefined) {
  return typeof publicId === "number" && ADMIN_RESERVED_PUBLIC_IDS.has(publicId);
}
