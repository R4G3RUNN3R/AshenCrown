import { NavLink, useNavigate } from "react-router-dom";
import { ReactNode, useMemo } from "react";
import { TopBar } from "./TopBar";
import { usePlayer } from "../../state/PlayerContext";
import { useAuth } from "../../state/AuthContext";
import { StatBars } from "./StatBars";
import { formatPlayerNameWithPublicId, getProfileRoute } from "../../lib/publicIds";
import { resolveDisplayTitle } from "../../lib/titleAccess";
import { getCityName, getTravelProgress, readTravelStateFromPlayer } from "../../lib/travelState";

type AppShellProps = {
  title?: string;
  hint?: string;
  children: ReactNode;
};

const core: Array<[string, string]> = [
  ["Home", "/home"],
  ["Inventory", "/inventory"],
  ["Education", "/education"],
  ["Adventure", "/adventure"],
  ["Arena", "/arena"],
  ["Travel", "/travel"],
  ["World Map", "/world-map"],
  ["Housing", "/housing"],
];

const world: Array<[string, string]> = [
  ["City", "/city"],
  ["City Board", "/city-board"],
  ["Civic Jobs", "/civic-jobs"],
  ["Hospital", "/hospital"],
  ["Guilds", "/guilds"],
  ["Consortiums", "/consortiums"],
];

const HOSPITAL_HIDDEN = new Set(["/education", "/adventure", "/arena", "/travel", "/city", "/civic-jobs"]);
const JAIL_HIDDEN = new Set(["/education", "/adventure", "/arena", "/travel", "/city", "/civic-jobs"]);
const TRAVEL_HIDDEN = new Set(["/education", "/adventure", "/arena", "/city", "/civic-jobs", "/guilds", "/consortiums", "/housing"]);

function SidebarSection({ title, links }: { title: string; links: Array<[string, string]> }) {
  if (!links.length) return null;

  return (
    <div className="sidebar-section">
      <div className="sidebar-section__title">{title}</div>
      <div className="sidebar-section__links">
        {links.map(([label, to]) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/home"}
            className={({ isActive }) => `sidebar-link${isActive ? " sidebar-link--active" : ""}`}
          >
            <span>{label}</span>
            <span className="sidebar-link__arrow">{">"}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

function formatGold(amount: number): string {
  return amount.toLocaleString("en-US") + " gp";
}

export function AppShell({ title, hint, children }: AppShellProps) {
  const { player, now, isHospitalized, hospitalRemainingLabel, isJailed, jailRemainingLabel } = usePlayer();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const travelState = readTravelStateFromPlayer(player);
  const isTraveling = getTravelProgress(travelState, now).active;

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  let conditionLabel = "Normal";
  let conditionClass = "player-condition";
  if (isHospitalized) {
    conditionLabel = `Hospital | ${hospitalRemainingLabel}`;
    conditionClass = "player-condition player-condition--hospital";
  } else if (isJailed) {
    conditionLabel = `Jailed | ${jailRemainingLabel}`;
    conditionClass = "player-condition player-condition--jail";
  } else if (isTraveling) {
    conditionLabel = `Traveling | ${getCityName(travelState.destinationCityId)}`;
    conditionClass = "player-condition";
  }

  const displayName = player.lastName ? `${player.name} ${player.lastName}` : player.name || "Unknown";
  const displayNameWithPublicId = formatPlayerNameWithPublicId(displayName, player.publicId);
  const profileRoute = getProfileRoute(player.publicId);
  const displayTitle = resolveDisplayTitle(player.title, player.publicId);
  const hiddenRoutes = useMemo(() => {
    if (isHospitalized) return HOSPITAL_HIDDEN;
    if (isJailed) return JAIL_HIDDEN;
    if (isTraveling) return TRAVEL_HIDDEN;
    return null;
  }, [isHospitalized, isJailed, isTraveling]);
  const visibleCore = hiddenRoutes ? core.filter(([, route]) => !hiddenRoutes.has(route)) : core;
  const visibleWorld = hiddenRoutes ? world.filter(([, route]) => !hiddenRoutes.has(route)) : world;

  return (
    <div className="app-shell">
      <TopBar />
      <div className="app-main">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo__title">Nexis</div>
            <div className="sidebar-logo__subtitle">Online realm of adventure</div>
          </div>

          <div className="player-card">
            <div className="player-card__name">
              <span className="player-card__username">{displayNameWithPublicId}</span>
            </div>

            <div className="player-card__rows">
              <div className="player-card__row">
                <span className="player-card__key">Level</span>
                <span className="player-card__val">{player.level}</span>
              </div>
              <div className="player-card__row">
                <span className="player-card__key">Title</span>
                <span className="player-card__val">{displayTitle}</span>
              </div>
              <div className="player-card__row">
                <span className="player-card__key">Days</span>
                <span className="player-card__val">{player.daysPlayed}</span>
              </div>
              <div className="player-card__row player-card__row--gold">
                <span className="player-card__key">Gold</span>
                <span className="player-card__val player-card__val--gold">{formatGold(player.gold)}</span>
              </div>
            </div>

            <div className={conditionClass}>{conditionLabel}</div>
          </div>

          <StatBars />

          <SidebarSection title="Core" links={visibleCore} />
          <SidebarSection title="World" links={visibleWorld} />

          <div className="sidebar-logout">
            <button type="button" className="sidebar-logout__btn" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </aside>

        <main className="content">
          {title ? (
            <div className="page-banner">
              <div className="page-banner__title">{title}</div>
              <div className="page-banner__actions">
                <NavLink to={profileRoute} className="page-banner__action">
                  Personal stats
                </NavLink>
              </div>
            </div>
          ) : null}
          {hint ? <div className="page-subhint">{hint}</div> : null}
          {children}
        </main>
      </div>
    </div>
  );
}
