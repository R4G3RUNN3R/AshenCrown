import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { worldCities, worldRoutes, type WorldCity, type WorldCityId, worldMapTitle } from "../data/worldMapData";
import { useAuth } from "../state/AuthContext";
import { usePlayer } from "../state/PlayerContext";
import { mergeServerStateIntoCache } from "../lib/runtimeStateCache";
import { cancelServerTravel, getServerTravelState, startServerTravel } from "../lib/authApi";
import { formatTravelDuration, getCityName, getTravelProgress, readTravelStateFromPlayer, type PersistedTravelState } from "../lib/travelState";
import mapImage from "../assets/maps/nexis-world-map.png";
import "../styles/world-map-ui.css";

const CITY_IMAGES: Record<string, string> = {
  nexis: "/images/cities/city_nexis.png",
  north: "/images/cities/city_aethermoor.png",
  east: "/images/cities/city_torvhal.png",
  west: "/images/cities/city_westmarch.png",
  south: "/images/cities/city_embervale.png",
};

function getPinClass(region: WorldCity["region"]) {
  switch (region) {
    case "north":
      return "travel-pin travel-pin--north";
    case "east":
      return "travel-pin travel-pin--east";
    case "west":
      return "travel-pin travel-pin--west";
    case "south":
      return "travel-pin travel-pin--south";
    default:
      return "travel-pin travel-pin--center";
  }
}

export default function TravelPage() {
  const { player } = usePlayer();
  const { activeAccount, authSource, serverSessionToken } = useAuth();
  const location = useLocation() as { state?: { redirectedFrom?: string } };
  const [now, setNow] = useState(Date.now());
  const [travelState, setTravelState] = useState<PersistedTravelState>(() => readTravelStateFromPlayer(player));
  const [selectedCityId, setSelectedCityId] = useState<WorldCityId>(() => readTravelStateFromPlayer(player).currentCityId);
  const [message, setMessage] = useState<string | null>(null);

  const refreshServerTravel = useCallback(async () => {
    if (authSource !== "server" || !serverSessionToken || !activeAccount) {
      return;
    }

    const result = await getServerTravelState(serverSessionToken);
    if (!("ok" in result) || !result.ok) {
      setMessage(result.error);
      return;
    }

    mergeServerStateIntoCache({
      email: activeAccount.email,
      user: {
        internalPlayerId: activeAccount.internalPlayerId,
        publicId: activeAccount.publicId,
        firstName: activeAccount.firstName,
        lastName: activeAccount.lastName,
      },
      playerState: result.playerState,
    });
    setTravelState(readTravelStateFromPlayer({
      current: {
        travel: result.travel,
        currentCityId: (result.travel as Record<string, unknown>).currentCityId,
      },
    }));
  }, [activeAccount, authSource, serverSessionToken]);

  useEffect(() => {
    setTravelState(readTravelStateFromPlayer(player));
    setSelectedCityId(readTravelStateFromPlayer(player).currentCityId);
  }, [player]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (authSource !== "server" || !serverSessionToken) return undefined;
    const syncTimer = window.setInterval(() => {
      const nextState = readTravelStateFromPlayer(player);
      if (nextState.status === "in_transit") {
        void refreshServerTravel();
      }
    }, 5000);
    return () => window.clearInterval(syncTimer);
  }, [authSource, player, refreshServerTravel, serverSessionToken]);

  const selectedCity = useMemo(
    () => worldCities.find((city) => city.id === selectedCityId) ?? worldCities[0],
    [selectedCityId],
  );
  const currentCity = useMemo(
    () => worldCities.find((city) => city.id === travelState.currentCityId) ?? worldCities[0],
    [travelState.currentCityId],
  );
  const selectedRoutes = useMemo(
    () => worldRoutes.filter((route) => route.from === selectedCity.id || route.to === selectedCity.id),
    [selectedCity],
  );

  const progress = getTravelProgress(travelState, now);
  const isTraveling = progress.active;
  const destinationName = getCityName(travelState.destinationCityId);
  const originName = getCityName(travelState.originCityId);
  const canTravel = !isTraveling && selectedCity.id !== travelState.currentCityId;
  const academyLabel = selectedCity.academy ?? (selectedCity.id === "nexis" ? "Nexis Academy of Commerce & Civil Arts" : "None");

  async function handleTravel() {
    if (!canTravel || authSource !== "server" || !serverSessionToken || !activeAccount) return;
    const result = await startServerTravel(serverSessionToken, selectedCity.id);
    if (!("ok" in result) || !result.ok) {
      setMessage(result.error);
      return;
    }
    mergeServerStateIntoCache({
      email: activeAccount.email,
      user: {
        internalPlayerId: activeAccount.internalPlayerId,
        publicId: activeAccount.publicId,
        firstName: activeAccount.firstName,
        lastName: activeAccount.lastName,
      },
      playerState: result.playerState,
    });
    setTravelState(readTravelStateFromPlayer({
      current: {
        travel: result.travel,
        currentCityId: (result.travel as Record<string, unknown>).currentCityId,
      },
    }));
    setMessage(`Caravan assembled for ${selectedCity.name}.`);
  }

  async function handleCancelTravel() {
    if (authSource !== "server" || !serverSessionToken || !activeAccount) return;
    const result = await cancelServerTravel(serverSessionToken);
    if (!("ok" in result) || !result.ok) {
      setMessage(result.error);
      return;
    }
    mergeServerStateIntoCache({
      email: activeAccount.email,
      user: {
        internalPlayerId: activeAccount.internalPlayerId,
        publicId: activeAccount.publicId,
        firstName: activeAccount.firstName,
        lastName: activeAccount.lastName,
      },
      playerState: result.playerState,
    });
    setTravelState(readTravelStateFromPlayer({
      current: {
        travel: result.travel,
        currentCityId: (result.travel as Record<string, unknown>).currentCityId,
      },
    }));
    setMessage("The caravan turns back along the road already traveled.");
  }

  useEffect(() => {
    if (travelState.arrivalNotice?.arrivedAt && travelState.arrivalNotice.destinationName) {
      setMessage(`Caravan arrived in ${travelState.arrivalNotice.destinationName}.`);
    }
  }, [travelState.arrivalNotice?.arrivedAt, travelState.arrivalNotice?.destinationName]);

  return (
    <AppShell
      title="Travel"
      hint="Caravan routes are now server-authoritative, survive reloads, and stop pretending a browser tab is the same thing as a road captain."
    >
      <div className="travel-layout">
        <section className="travel-panel travel-panel--map">
          <div className="travel-panel__header">{worldMapTitle}</div>
          <div className="travel-map-frame">
            <img src={mapImage} alt="The world map of Nexis" className="travel-map-image" />
            {worldCities.map((city) => (
              <button
                key={city.id}
                type="button"
                className={getPinClass(city.region)}
                style={{ left: `${city.xPercent}%`, top: `${city.yPercent}%` }}
                onClick={() => setSelectedCityId(city.id)}
                aria-label={city.name}
                title={city.name}
              >
                <span className="travel-pin__dot" />
                <span className="travel-pin__label">{city.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="travel-panel">
          <div className="travel-panel__header">Caravan Operations</div>
          <div className="travel-card">
            {CITY_IMAGES[selectedCity.id] ? (
              <div className="travel-city-art">
                <img src={CITY_IMAGES[selectedCity.id]} alt={selectedCity.name} className="travel-city-art__img" />
              </div>
            ) : null}

            <div className="travel-card__title">{selectedCity.name}</div>
            <div className="travel-card__subtitle">{selectedCity.subtitle}</div>

            {message ? <div className="travel-inline-note">{message}</div> : null}

            <div className="travel-card__grid">
              <div className="travel-info">
                <span className="travel-info__label">Current City</span>
                <strong className="travel-info__value">{currentCity.name}</strong>
              </div>
              <div className="travel-info">
                <span className="travel-info__label">Travel Mode</span>
                <strong className="travel-info__value">{travelState.mode === "personal_wagon" ? "Personal Wagon" : "Caravan"}</strong>
              </div>
              <div className="travel-info">
                <span className="travel-info__label">Academy</span>
                <strong className="travel-info__value">{academyLabel}</strong>
              </div>
              <div className="travel-info">
                <span className="travel-info__label">Route Feel</span>
                <strong className="travel-info__value">{selectedCity.travelFeel}</strong>
              </div>
            </div>

            {isTraveling ? (
              <div className="travel-card__status">
                <strong>Caravan In Transit</strong>
                <div>{originName} to {destinationName}</div>
                <div className="travel-progress">
                  <span style={{ width: `${progress.percent}%` }} />
                </div>
                <div>{progress.percent}% complete | ETA {formatTravelDuration(progress.remainingMs)}</div>
                {location.state?.redirectedFrom ? (
                  <div className="travel-inline-note travel-inline-note--warning">
                    {location.state.redirectedFrom} is unavailable while you are in transit.
                  </div>
                ) : null}
              </div>
            ) : null}

            <p className="travel-card__summary">{selectedCity.summary}</p>

            <div className="travel-subsection">
              <div className="travel-subsection__title">Connected Routes</div>
              <ul className="travel-list">
                {selectedRoutes.map((route) => (
                  <li key={route.id}>
                    <strong>{route.travelLabel}</strong>: {route.rule}
                  </li>
                ))}
              </ul>
            </div>

            <div className="travel-actions">
              <button
                type="button"
                className="travel-action-button travel-action-button--primary"
                onClick={() => void handleTravel()}
                disabled={!canTravel}
              >
                {isTraveling
                  ? "Already Traveling"
                  : selectedCity.id === travelState.currentCityId
                    ? "Already Here"
                    : `Dispatch Caravan to ${selectedCity.name}`}
              </button>
              {isTraveling ? (
                <button type="button" className="travel-action-button" onClick={() => void handleCancelTravel()}>
                  Turn Caravan Back
                </button>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
