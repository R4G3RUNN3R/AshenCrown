# Nexis V2 Cutover Notes

## Purpose
These notes define the clean cutover path from the older placeholder page stack to the rebuilt V2/V3 route and app stack.

## Current Situation
The rebuilt systems now exist on the branch, including:
- MarketV2
- BlackMarketV2
- CityBoardV3
- ConsortiumRegistryV2
- AppRouterV2 (`src/router/indexV2.tsx`)
- AppV2 (`src/AppV2.tsx`)
- mainV2 (`src/mainV2.tsx`)

The older stack still exists in parallel because direct overwrite of some files through the connector has been unreliable.

## Recommended Cutover Order
1. Switch application entry from `src/main.tsx` -> `src/mainV2.tsx`
2. Verify `AppV2` boots correctly with `AppRouterV2`
3. Confirm these routes load and render correctly:
   - `/market`
   - `/black-market`
   - `/city-board`
   - `/consortium-registry`
4. Confirm existing unchanged routes still function correctly under the V2 app shell
5. After validation, retire stale pages and stale imports

## V2 Route Targets
- `/market` -> `MarketV2`
- `/black-market` -> `BlackMarketV2`
- `/city-board` -> `CityBoardV3`
- `/consortium-registry` -> `ConsortiumRegistryV2`

## Validation Checklist
- Market page shows V2 shop categories and stock
- Black Market page shows illicit stock and rule messaging
- City Board shows consortium listings and previews
- Consortium Registry shows full template details
- No route regressions on shared pages

## Notes
This cutover path exists because the V2/V3 systems are already built and consistent with the approved roadmap, while some direct overwrite operations on older files were blocked by tooling behavior.
