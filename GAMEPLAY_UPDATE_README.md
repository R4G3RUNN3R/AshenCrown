# Nexis — Gameplay Update

## What's New

### 1. Sidebar Timer System
Live-ticking resource bars in the sidebar that regenerate over time:

| Stat    | Max | Regen Rate  | Color  |
|---------|-----|-------------|--------|
| Energy  | 100 | +1 / 5 min  | Green  |
| Health  | 100 | +1 / 3 min  | Red    |
| Stamina | 100 | +1 / 15 min | Blue   |
| Comfort | 100 | +1 / 10 min | Purple |

- Bars show current/max + countdown to next tick
- Persist across page navigation (React context)
- Saved to localStorage

### 2. Jobs System (5 Categories, 22 Sub-Jobs)

**Categories:**
- **Beginner Adventurer** — Gathering materials, small tasks (low risk, item drops)
- **Thievery** — Pickpocketing, burglary, heists (high risk/reward, jail on crit-fail)
- **Courier** — Deliveries, smuggling (moderate risk, stamina-based)
- **Labor** — Mining, construction, forging (low risk, strength-based)
- **Deception** — Scams, forgery, espionage (high risk, intelligence-based)

**Mechanics:**
- Levels 1–100 per sub-job with XP progression
- Success/Fail/Critical-Fail rolls with scaling difficulty
- Chain streak multiplier (up to 150% gold bonus)
- Cooldowns between attempts
- Item drops that feed into the Professions system
- Energy cost per attempt
- Fail → Hospital | Crit-Fail → Jail

### 3. Education Learn Button
- Clicking "Learn" starts a real countdown timer
- Timer ticks in the background (persisted)
- On completion, the passive stat bonus is permanently applied
- Progress bar shows remaining time

### 4. Jail System
- Critical fails on risky jobs send you to jail
- Jail timer displayed in sidebar (yellow chip)
- While jailed, jobs are blocked
- Auto-releases when timer expires

---

## New & Modified Files

### New Files
| File | Purpose |
|------|---------|
| `src/state/TimerContext.tsx` | Timer system context (tick rates, regen logic) |
| `src/state/JobsContext.tsx` | Jobs system context (attempts, XP, cooldowns, outcomes) |
| `src/data/jobsData.ts` | Full jobs data: 5 categories, 22 sub-jobs, item drop tables |
| `src/components/layout/StatBars.tsx` | Sidebar stat bars component |
| `src/styles/statbars.css` | Stat bars styling |
| `src/styles/jobs.css` | Jobs page Torn-style dark UI |

### Modified Files
| File | Changes |
|------|---------|
| `src/App.tsx` | Added TimerProvider + JobsProvider wrappers |
| `src/main.tsx` | Added statbars.css + jobs.css imports |
| `src/state/PlayerContext.tsx` | Added jail system (jailFor, releaseFromJail, isJailed) + spendEnergy |
| `src/state/EducationContext.tsx` | Wired learn button with countdown timer |
| `src/pages/Education.tsx` | Learn button UI with timer display |
| `src/pages/Jobs.tsx` | Full jobs page (replaces placeholder) |
| `src/components/layout/AppShell.tsx` | Added StatBars + jail condition chip |
| `src/styles/torn-theme-hospital-patch.css` | Added jail chip styling |
| `src/styles/education-torn-ui.css` | Timer progress bar styles |

---

## Installation

This is a full `src/` drop-in. Replace your existing `src/` folder with the one in this zip.

If you prefer to merge manually, the priority order is:
1. Copy all new files listed above
2. Replace the modified files
3. The `PlayerContext.tsx` in this package supersedes any previous version (adds jail + spendEnergy)

---

## What's Next
Per the roadmap: **Images for the UI + Registration system**
