import { useState, useEffect, useCallback } from "react";
import { getPlanLimits, PlanLimits } from "@/lib/planLimits";

interface DailyCounters {
  activities: number;
  regenerates: number;
  favorites: number;
  date: string;
}

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function getStorageKey(pageId: string): string {
  return `foreverous_counters_${pageId}`;
}

function loadCounters(pageId: string): DailyCounters {
  const key = getStorageKey(pageId);
  const stored = localStorage.getItem(key);
  const today = getTodayKey();

  if (stored) {
    const parsed: DailyCounters = JSON.parse(stored);
    if (parsed.date === today) {
      return parsed;
    }
  }

  return { activities: 0, regenerates: 0, favorites: 0, date: today };
}

function saveCounters(pageId: string, counters: DailyCounters) {
  localStorage.setItem(getStorageKey(pageId), JSON.stringify(counters));
}

export function usePlanLimits(plan: string, pageId: string) {
  const limits = getPlanLimits(plan);
  const [counters, setCounters] = useState<DailyCounters>(() => loadCounters(pageId));

  // Reset counters if day changed
  useEffect(() => {
    const today = getTodayKey();
    if (counters.date !== today) {
      const newCounters = { activities: 0, regenerates: 0, favorites: 0, date: today };
      setCounters(newCounters);
      saveCounters(pageId, newCounters);
    }
  }, [counters.date, pageId]);

  const canDoActivity = counters.activities < limits.activitiesPerDay;
  const canRegenerate = counters.regenerates < limits.regeneratesPerDay;
  const canFavorite = (currentFavorites: number) => currentFavorites < limits.favoritesLimit;

  const incrementActivity = useCallback(() => {
    setCounters((prev) => {
      const updated = { ...prev, activities: prev.activities + 1 };
      saveCounters(pageId, updated);
      return updated;
    });
  }, [pageId]);

  const incrementRegenerate = useCallback(() => {
    setCounters((prev) => {
      const updated = { ...prev, regenerates: prev.regenerates + 1 };
      saveCounters(pageId, updated);
      return updated;
    });
  }, [pageId]);

  return {
    limits,
    counters,
    canDoActivity,
    canRegenerate,
    canFavorite,
    incrementActivity,
    incrementRegenerate,
    remainingActivities: Math.max(0, limits.activitiesPerDay - counters.activities),
    remainingRegenerates: Math.max(0, limits.regeneratesPerDay - counters.regenerates),
  };
}
