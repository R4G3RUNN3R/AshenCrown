import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type EducationRuntimeState = {
  currentCourseId: string | null;
  currentPathId: string | null;
  startedAt: number | null;
  completesAt: number | null;
  completedCourseIds: string[];
  unlockedSystems: string[];
};

type EducationRuntimeContextValue = {
  educationState: EducationRuntimeState;
  startCourse: (pathId: string, courseId: string, durationDays: number, unlocksSystems?: string[]) => boolean;
  leaveCourse: () => void;
  completeCourse: (courseId: string, unlocksSystems?: string[]) => void;
  isCourseCompleted: (courseId: string) => boolean;
  isStudyingCourse: (courseId: string) => boolean;
  hasUnlockedSystem: (systemId: string) => boolean;
  getRemainingMs: () => number;
};

const STORAGE_KEY = "nexis_education_runtime";

const defaultState: EducationRuntimeState = {
  currentCourseId: null,
  currentPathId: null,
  startedAt: null,
  completesAt: null,
  completedCourseIds: [],
  unlockedSystems: [],
};

function readState(): EducationRuntimeState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<EducationRuntimeState>;
    return {
      ...defaultState,
      ...parsed,
      completedCourseIds: parsed.completedCourseIds ?? [],
      unlockedSystems: parsed.unlockedSystems ?? [],
    };
  } catch {
    return defaultState;
  }
}

const EducationRuntimeContext = createContext<EducationRuntimeContextValue | null>(null);

export function EducationRuntimeProvider({ children }: { children: React.ReactNode }) {
  const [educationState, setEducationState] = useState<EducationRuntimeState>(readState);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(educationState));
  }, [educationState]);

  const value = useMemo<EducationRuntimeContextValue>(() => ({
    educationState,
    startCourse(pathId, courseId, durationDays) {
      if (educationState.currentCourseId) return false;
      const now = Date.now();
      const completesAt = now + durationDays * 24 * 60 * 60 * 1000;
      setEducationState((prev) => ({
        ...prev,
        currentCourseId: courseId,
        currentPathId: pathId,
        startedAt: now,
        completesAt,
      }));
      return true;
    },
    leaveCourse() {
      setEducationState((prev) => ({
        ...prev,
        currentCourseId: null,
        currentPathId: null,
        startedAt: null,
        completesAt: null,
      }));
    },
    completeCourse(courseId, unlocksSystems = []) {
      setEducationState((prev) => ({
        ...prev,
        currentCourseId: null,
        currentPathId: null,
        startedAt: null,
        completesAt: null,
        completedCourseIds: prev.completedCourseIds.includes(courseId)
          ? prev.completedCourseIds
          : [...prev.completedCourseIds, courseId],
        unlockedSystems: [...new Set([...prev.unlockedSystems, ...unlocksSystems])],
      }));
    },
    isCourseCompleted(courseId) {
      return educationState.completedCourseIds.includes(courseId);
    },
    isStudyingCourse(courseId) {
      return educationState.currentCourseId === courseId;
    },
    hasUnlockedSystem(systemId) {
      return educationState.unlockedSystems.includes(systemId);
    },
    getRemainingMs() {
      if (!educationState.completesAt) return 0;
      return Math.max(0, educationState.completesAt - Date.now());
    },
  }), [educationState]);

  return (
    <EducationRuntimeContext.Provider value={value}>
      {children}
    </EducationRuntimeContext.Provider>
  );
}

export function useEducationRuntime() {
  const ctx = useContext(EducationRuntimeContext);
  if (!ctx) throw new Error("useEducationRuntime must be used within an EducationRuntimeProvider");
  return ctx;
}
