import { useEffect, useMemo, useState } from "react";
import { ContentPanel } from "../layout/ContentPanel";
import {
  CIVIC_JOB_TRACKS,
  formatWorkingStatGains,
  type CivicEntryRequirementRule,
  type CivicJobTrack,
  type CivicJobTrackId,
  type CivicRankRequirementRule,
} from "../../data/civicJobsData";
import {
  createTrackProgress,
  getActiveCivicJobPassives,
  getRequiredPointsForRank,
  getShiftCooldownRemaining,
  getTrackProgress,
  getUnlockedPassivesForTrack,
  readCivicEmploymentState,
  writeCivicEmploymentState,
  type CivicEmploymentState,
  type CivicTrackProgress,
} from "../../lib/civicJobsState";
import { useEducation } from "../../state/EducationContext";
import { useAuth } from "../../state/AuthContext";
import { usePlayer } from "../../state/PlayerContext";

function formatRemaining(ms: number) {
  if (ms <= 0) return "Ready now";
  const totalHours = Math.ceil(ms / 3600000);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
}

function getWorkingTotal(player: ReturnType<typeof usePlayer>["player"]) {
  return (
    player.workingStats.manualLabor +
    player.workingStats.intelligence +
    player.workingStats.endurance
  );
}

function getRuleFailure(
  rule: CivicEntryRequirementRule | CivicRankRequirementRule | undefined,
  player: ReturnType<typeof usePlayer>["player"],
  completedCourses: string[],
  status: { isHospitalized: boolean; isJailed: boolean },
) {
  if (!rule) return null;
  if (rule.requireNotHospitalized && status.isHospitalized) return "Unavailable while hospitalized.";
  if (rule.requireNotJailed && status.isJailed) return "Unavailable while jailed.";
  if (typeof rule.minimumWorkingTotal === "number" && getWorkingTotal(player) < rule.minimumWorkingTotal) {
    return `Requires ${rule.minimumWorkingTotal}+ combined working stats.`;
  }
  if (typeof rule.minimumManualLabor === "number" && player.workingStats.manualLabor < rule.minimumManualLabor) {
    return `Requires Manual Labor ${rule.minimumManualLabor}+.`;
  }
  if (typeof rule.minimumIntelligence === "number" && player.workingStats.intelligence < rule.minimumIntelligence) {
    return `Requires Intelligence ${rule.minimumIntelligence}+.`;
  }
  if (typeof rule.minimumEndurance === "number" && player.workingStats.endurance < rule.minimumEndurance) {
    return `Requires Endurance ${rule.minimumEndurance}+.`;
  }
  if (rule.completedCourses?.length) {
    const missing = rule.completedCourses
      .filter((courseId: string) => !completedCourses.includes(courseId))
      .map((courseId: string) => courseId.replace(/-/g, " "));
    if (missing.length) return `Requires ${missing.join(", ")}.`;
  }
  return null;
}

function getCurrentRank(track: CivicJobTrack, progress: CivicTrackProgress | null) {
  const currentRank = progress?.rank ?? 1;
  return track.ranks.find((rank) => rank.rank === currentRank) ?? track.ranks[0];
}

function getNextRank(track: CivicJobTrack, progress: CivicTrackProgress | null) {
  const currentRank = progress?.rank ?? 1;
  return track.ranks.find((rank) => rank.rank === currentRank + 1) ?? null;
}

export default function CivicJobsBoard() {
  const { player, addGold, addWorkingStat, isHospitalized, isJailed } = usePlayer();
  const { serverHydrationVersion } = useAuth();
  const education = useEducation();
  const [employment, setEmployment] = useState<CivicEmploymentState>(() =>
    readCivicEmploymentState(player.internalId),
  );
  const [message, setMessage] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    function refreshEmployment() {
      setEmployment(readCivicEmploymentState(player.internalId));
    }

    refreshEmployment();
    window.addEventListener("nexis:civic-jobs-refresh", refreshEmployment);
    return () => window.removeEventListener("nexis:civic-jobs-refresh", refreshEmployment);
  }, [player.internalId, serverHydrationVersion]);

  useEffect(() => {
    writeCivicEmploymentState(player.internalId, employment, false);
  }, [employment, player.internalId]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const status = { isHospitalized, isJailed };
  const activeTrack = employment.activeTrackId
    ? CIVIC_JOB_TRACKS.find((track) => track.id === employment.activeTrackId) ?? null
    : null;
  const activeTrackProgress = activeTrack ? getTrackProgress(employment, activeTrack.id) : null;
  const activePassives = useMemo(() => getActiveCivicJobPassives(employment), [employment]);

  function showMessage(value: string) {
    setMessage(value);
  }

  function joinTrack(trackId: CivicJobTrackId) {
    const track = CIVIC_JOB_TRACKS.find((entry) => entry.id === trackId);
    if (!track) return;
    const failure = getRuleFailure(track.entryRule, player, education.completedCourses, status);
    if (failure) {
      showMessage(failure);
      return;
    }

    setEmployment((current) => ({
      activeTrackId: trackId,
      trackProgress: {
        ...current.trackProgress,
        [trackId]: current.trackProgress[trackId] ?? createTrackProgress(),
      },
    }));
    showMessage(`Joined ${track.name}. Passive city work, small salary, daily job points, and no more pretending payroll is a boss fight.`);
  }

  function resignTrack() {
    if (!activeTrack) return;
    setEmployment((current) => ({
      ...current,
      activeTrackId: null,
    }));
    showMessage(`You resigned from ${activeTrack.name}. The city will somehow endure this shocking loss.`);
  }

  function collectDailyBenefits(track: CivicJobTrack) {
    const progress = getTrackProgress(employment, track.id);
    if (!progress || employment.activeTrackId !== track.id) return;
    const cooldownRemaining = getShiftCooldownRemaining(progress, now);
    if (cooldownRemaining > 0) {
      showMessage(`Daily collection available in ${formatRemaining(cooldownRemaining)}.`);
      return;
    }

    const currentRank = getCurrentRank(track, progress);

    addGold(currentRank.dailyGold);
    (Object.entries(currentRank.workingStatGains) as Array<["manualLabor" | "intelligence" | "endurance", number]>)
      .filter((entry) => (entry[1] ?? 0) > 0)
      .forEach(([stat, amount]) => addWorkingStat(stat, amount));

    let nextProgress: CivicTrackProgress = {
      ...progress,
      jobPoints: progress.jobPoints + currentRank.dailyJobPoints,
      shiftsWorked: progress.shiftsWorked + 1,
      lastShiftAt: now,
    };

    const unlockedPassives: string[] = [];
    let promotedTo: string | null = null;
    let nextRank = getNextRank(track, nextProgress);
    while (nextRank) {
      const hasPoints = nextProgress.jobPoints >= getRequiredPointsForRank(nextRank.rank);
      const requirementFailure = getRuleFailure(nextRank.requirementRule, player, education.completedCourses, status);
      if (!hasPoints || requirementFailure) break;
      nextProgress = {
        ...nextProgress,
        rank: nextRank.rank,
      };
      promotedTo = nextRank.title;
      if (nextRank.passiveUnlock) unlockedPassives.push(nextRank.passiveUnlock.name);
      nextRank = getNextRank(track, nextProgress);
    }

    setEmployment((current) => ({
      ...current,
      trackProgress: {
        ...current.trackProgress,
        [track.id]: nextProgress,
      },
    }));

    const rewardSummary = formatWorkingStatGains(currentRank.workingStatGains);
    const passiveNote = unlockedPassives.length
      ? ` Unlocked passive: ${unlockedPassives.join(", ")}.`
      : "";

    showMessage(
      promotedTo
        ? `Collected daily benefits: ${currentRank.dailyGold} gold, ${currentRank.dailyJobPoints} job points, ${rewardSummary}, and a promotion to ${promotedTo}.${passiveNote}`
        : `Collected daily benefits: ${currentRank.dailyGold} gold, ${currentRank.dailyJobPoints} job points, and ${rewardSummary}.${passiveNote}`,
    );
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {message ? (
        <ContentPanel title="Employment Notice">
          <strong>{message}</strong>
        </ContentPanel>
      ) : null}

      {activeTrack && activeTrackProgress ? (
        <ContentPanel title="Current City Job">
          {(() => {
            const currentRank = getCurrentRank(activeTrack, activeTrackProgress);
            const nextRank = getNextRank(activeTrack, activeTrackProgress);
            const cooldownRemaining = getShiftCooldownRemaining(activeTrackProgress, now);
            const nextRankFailure = nextRank
              ? getRuleFailure(nextRank.requirementRule, player, education.completedCourses, status)
              : null;
            const unlockedPassives = getUnlockedPassivesForTrack(activeTrack.id, activeTrackProgress.rank);

            return (
              <div style={{ display: "grid", gap: 10 }}>
                <div style={{ color: "#9fb0bf", fontSize: 13 }}>
                  {activeTrack.name} | {currentRank.title}
                </div>
                <div className="info-row">
                  <span className="info-row__label">Job Points</span>
                  <span className="info-row__value">{activeTrackProgress.jobPoints}</span>
                </div>
                <div className="info-row">
                  <span className="info-row__label">Days Worked</span>
                  <span className="info-row__value">{activeTrackProgress.shiftsWorked}</span>
                </div>
                <div className="info-row">
                  <span className="info-row__label">Daily Salary</span>
                  <span className="info-row__value">{currentRank.dailyGold} gold</span>
                </div>
                <div className="info-row">
                  <span className="info-row__label">Daily Stat Gain</span>
                  <span className="info-row__value">{formatWorkingStatGains(currentRank.workingStatGains)}</span>
                </div>
                <div className="info-row">
                  <span className="info-row__label">Next Collection</span>
                  <span className="info-row__value">{formatRemaining(cooldownRemaining)}</span>
                </div>
                <div className="info-row">
                  <span className="info-row__label">Current Special</span>
                  <span className="info-row__value">
                    {unlockedPassives.length
                      ? unlockedPassives.map((entry) => `${entry.name} (${entry.magnitude}%)`).join(" | ")
                      : "No job special unlocked yet"}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#b7c3cf" }}>
                  City jobs are passive, exactly as they should be. Hold the position, collect daily pay and Job Points every 24 hours, and let the role build your working stats instead of asking you to click bureaucracy to death.
                </div>
                {nextRank ? (
                  <div style={{ fontSize: 12, color: "#b7c3cf" }}>
                    Next promotion: {nextRank.title} at {getRequiredPointsForRank(nextRank.rank)} Job Points.
                    {nextRankFailure ? ` ${nextRankFailure}` : ""}
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: "#8ec8a7" }}>Maximum city-job rank reached for this profession.</div>
                )}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button type="button" onClick={() => collectDailyBenefits(activeTrack)} disabled={cooldownRemaining > 0 || isHospitalized || isJailed}>
                    {cooldownRemaining > 0 ? `Collect Daily Benefits (${formatRemaining(cooldownRemaining)})` : "Collect Daily Benefits"}
                  </button>
                  <button type="button" onClick={resignTrack}>
                    Resign
                  </button>
                </div>
                {Object.keys(activePassives).length ? (
                  <div style={{ fontSize: 12, color: "#8ec8a7" }}>
                    Active passive effects are live while you remain employed in {activeTrack.name}.
                  </div>
                ) : null}
              </div>
            );
          })()}
        </ContentPanel>
      ) : null}

      {CIVIC_JOB_TRACKS.map((track) => {
        const progress = getTrackProgress(employment, track.id);
        const currentRank = getCurrentRank(track, progress);
        const nextRank = getNextRank(track, progress);
        const entryFailure = getRuleFailure(track.entryRule, player, education.completedCourses, status);
        const isActive = employment.activeTrackId === track.id;
        const anotherTrackActive = !!employment.activeTrackId && !isActive;
        const canJoin = !isActive && !anotherTrackActive && !entryFailure;
        const finalPassive = track.ranks.find((rank) => rank.passiveUnlock)?.passiveUnlock ?? null;

        return (
          <ContentPanel key={track.id} title={track.name}>
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ color: "#9fb0bf", fontSize: 13 }}>{track.subtitle}</div>
              <div style={{ display: "grid", gap: 6 }}>
                <strong>What This Job Gives</strong>
                <div style={{ fontSize: 13, opacity: 0.82 }}>
                  Small daily salary, steady Job Points, and working-stat growth once every 24 hours while employed.
                </div>
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                <strong>Interview Prompt</strong>
                <div style={{ fontSize: 13, opacity: 0.82 }}>{track.interviewPrompt}</div>
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                <strong>Entry Requirements</strong>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {track.entryRequirements.map((requirement) => <li key={requirement}>{requirement}</li>)}
                </ul>
                {entryFailure ? <div style={{ fontSize: 12, color: "#d98f8f" }}>Currently blocked: {entryFailure}</div> : null}
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                <strong>Profession Focus</strong>
                <div style={{ fontSize: 13, opacity: 0.82 }}>{track.specialties.join(" | ")}</div>
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <strong>Track Status</strong>
                <div className="info-row">
                  <span className="info-row__label">Current Rank</span>
                  <span className="info-row__value">{progress ? `${currentRank.rank}. ${currentRank.title}` : "Not employed"}</span>
                </div>
                <div className="info-row">
                  <span className="info-row__label">Job Points</span>
                  <span className="info-row__value">{progress?.jobPoints ?? 0}</span>
                </div>
                {nextRank ? (
                  <div className="info-row">
                    <span className="info-row__label">Next Rank</span>
                    <span className="info-row__value">
                      {nextRank.title} at {getRequiredPointsForRank(nextRank.rank)} Job Points
                    </span>
                  </div>
                ) : null}
                <div className="info-row">
                  <span className="info-row__label">End-Rank Special</span>
                  <span className="info-row__value">
                    {finalPassive ? `${finalPassive.name} (${finalPassive.magnitude}%): ${finalPassive.description}` : "None"}
                  </span>
                </div>
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <strong>Rank Ladder</strong>
                {track.ranks.map((rank) => (
                  <div
                    key={`${track.id}-${rank.rank}`}
                    style={{
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 8,
                      padding: 10,
                      background: "rgba(7, 13, 20, 0.55)",
                      display: "grid",
                      gap: 4,
                    }}
                  >
                    <strong>{rank.rank}. {rank.title}</strong>
                    <div style={{ fontSize: 12, color: "#b7c3cf" }}>{rank.requirementLabel}</div>
                    <div style={{ fontSize: 12, color: "#cfd7de" }}>
                      Salary {rank.dailyGold} gold | {rank.dailyJobPoints} Job Points | {formatWorkingStatGains(rank.workingStatGains)}
                    </div>
                    {rank.passiveUnlock ? (
                      <div style={{ fontSize: 12, color: "#8ec8a7" }}>
                        Unlocks {rank.passiveUnlock.name} ({rank.passiveUnlock.magnitude}%)
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {isActive ? (
                  <button type="button" disabled>
                    Current Job
                  </button>
                ) : (
                  <button type="button" onClick={() => joinTrack(track.id)} disabled={!canJoin}>
                    {anotherTrackActive ? "Another Job Active" : entryFailure ? "Unavailable" : "Take Job"}
                  </button>
                )}
              </div>
            </div>
          </ContentPanel>
        );
      })}
    </div>
  );
}
