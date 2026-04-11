# Nexis RPG — Full Update Package

## What Changed

### Registration System (new)
- **`src/state/PlayerContext.tsx`** — Extended with three new fields on `PlayerState`:
  - `characterName: string` — player-chosen name, defaults to `""`
  - `isRegistered: boolean` — `false` until registration complete
  - `portrait: number` — 0–5 index of chosen portrait class
  - New action `registerPlayer(name, portrait)` persists to `localStorage` under key `"nexis_player"` and sets `isRegistered: true`
  - On app load, `hydratePlayer()` reads `localStorage` and restores all three fields
  - The `isRegistered` flag is also exposed directly on the context value for convenience
  
- **`src/components/layout/TopBar.tsx`** — Updated to read `player.characterName` via `usePlayer()` instead of the hardcoded `"Hennet"` string. Falls back to `player.name` for backwards compatibility.

- **`src/pages/Register.tsx`** — Full-screen character creation page (no AppShell):
  - Dark atmospheric layout matching the Nexis torn-UI design system
  - Character name input with validation (3–20 chars, letters/numbers/spaces/hyphens), live error messages, and character counter
  - 6 portrait options (Warrior ⚔, Mage ✦, Rogue 🗡, Healer ✚, Scout ◎, Scholar 📜) with selection highlight
  - "Begin Your Journey" button — disabled until name + portrait are valid; on click calls `registerPlayer()` and navigates to `/`

- **`src/styles/register.css`** — Standalone styles for the registration page. Pure CSS, no Tailwind.

- **`src/components/routing/RouteGuard.tsx`** — Rewritten to handle both:
  1. Registration guard: if `isRegistered === false`, redirect to `/register`
  2. Hospitalization guard: if hospitalized on a blocked route, redirect to `/hospital`
  - Exports both named `RouteGuard` and `default RouteGuard` for backwards compatibility.

- **`src/router/index.tsx`** — Updated:
  - Added `/register` route (no RouteGuard, no AppShell)
  - All game routes now wrapped in `<RouteGuard>` (including previously unguarded routes like `/`, `/profile`, etc.)

- **`src/App.tsx`** — No functional changes; included for completeness.

### Data & UI Additions (from previous sprints)
- **`src/data/academyData.ts`** — Academy definitions
- **`src/data/spiritData.ts`** — Spirit/familiar data
- **`src/data/cityData.ts`** — City location data
- **`src/state/AcademyContext.tsx`** — Academy state management context
- **`src/pages/Academies.tsx`** — Academies game page
- **`src/pages/WorldMap.tsx`** — World map page
- **`src/components/travel/TravelBar.tsx`** — Travel status bar component
- **`src/styles/academies.css`** — Academies page styles
- **`src/styles/worldmap.css`** — World map styles

---

## How to Apply

1. **Drop the `src/` folder** from this zip into your existing Nexis project root, merging with the existing `src/`. All paths match the project's existing structure.
2. Run `npm install` if any new dependencies have been added (none expected for this update).
3. Start dev server: `npm run dev`
4. On first load, the app will redirect to `/register`. Fill in your character name and choose a class — your choice is persisted in `localStorage`.

---

## New Routes

| Route       | Guard        | Shell    | Description                          |
|-------------|-------------|----------|--------------------------------------|
| `/register` | None        | None     | Character creation / onboarding page |
| `/`         | Registration | AppShell | Home page (now requires registration)|
| All others  | Registration | AppShell | Same as before, now all require registration |

---

## Mock Data / Replace Later

The following items use placeholder or mock data and should be replaced before production:

- **Portrait icons** — Currently use Unicode symbols (⚔ ✦ 🗡 ✚ ◎ 📜) as CSS-only placeholders. Replace `.register-portrait-icon` contents with real character art assets when available.
- **`academyData.ts`** — Contains mock academy definitions. Replace with live data from the backend.
- **`spiritData.ts`** — Mock spirit/familiar stats. Replace with authoritative game data.
- **`cityData.ts`** — Mock city coordinates and metadata. Replace with real world data.
- **Player `id`** — Hardcoded as `"0001"` in initial state. Should be assigned by the server on registration.
- **`isRegistered` persistence** — Currently uses `localStorage`. For a real multiplayer game, registration should be validated server-side with a session token.
- **Name profanity filter** — Validation currently only checks character set. Add a blocklist or server-side check before launch.
