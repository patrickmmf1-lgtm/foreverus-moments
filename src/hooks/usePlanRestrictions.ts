import { useState, useEffect, useCallback } from "react";
import { getPlanFeatures, PlanFeatures } from "@/config/planLimits";

interface DailyCounters {
  activities: number;
  rerolls: number;
  date: string;
}

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function getStorageKey(pageId: string): string {
  return `foreverus_counters_${pageId}`;
}

function loadCounters(pageId: string): DailyCounters {
  const key = getStorageKey(pageId);
  const stored = localStorage.getItem(key);
  const today = getTodayKey();

  if (stored) {
    try {
      const parsed: DailyCounters = JSON.parse(stored);
      if (parsed.date === today) {
        return parsed;
      }
    } catch {
      // Invalid stored data, reset
    }
  }

  return { activities: 0, rerolls: 0, date: today };
}

function saveCounters(pageId: string, counters: DailyCounters) {
  localStorage.setItem(getStorageKey(pageId), JSON.stringify(counters));
}

export interface PlanRestrictions {
  // Plan features
  features: PlanFeatures;
  
  // Permission flags
  canDoActivity: boolean;
  canReroll: boolean;
  showHistory: boolean;
  showFavorites: boolean;
  showWeeklyRitual: boolean;
  isPremium: boolean;
  
  // Counters
  remainingActivities: number | 'unlimited';
  remainingRerolls: number | 'unlimited';
  activitiesUsedToday: number;
  rerollsUsedToday: number;
  
  // Functions
  canFavorite: (currentCount: number) => boolean;
  incrementActivity: () => void;
  incrementReroll: () => void;
}

export function usePlanRestrictions(plan: string, pageId: string): PlanRestrictions {
  const features = getPlanFeatures(plan);
  const [counters, setCounters] = useState<DailyCounters>(() => loadCounters(pageId));

  // Reset counters if day changed
  useEffect(() => {
    const today = getTodayKey();
    if (counters.date !== today) {
      const newCounters = { activities: 0, rerolls: 0, date: today };
      setCounters(newCounters);
      saveCounters(pageId, newCounters);
    }
  }, [counters.date, pageId]);

  // Calculate permissions
  const isUnlimitedActivities = features.activitiesPerDay === 'unlimited';
  const isUnlimitedRerolls = features.rerollsPerDay === 'unlimited';
  const isUnlimitedFavorites = features.maxFavorites === 'unlimited';

  const canDoActivity = isUnlimitedActivities || counters.activities < (features.activitiesPerDay as number);
  const canReroll = isUnlimitedRerolls || counters.rerolls < (features.rerollsPerDay as number);
  
  const canFavorite = useCallback((currentCount: number) => {
    if (!features.hasFavorites) return false;
    if (isUnlimitedFavorites) return true;
    return currentCount < (features.maxFavorites as number);
  }, [features.hasFavorites, features.maxFavorites, isUnlimitedFavorites]);

  const remainingActivities = isUnlimitedActivities 
    ? 'unlimited' 
    : Math.max(0, (features.activitiesPerDay as number) - counters.activities);
  
  const remainingRerolls = isUnlimitedRerolls 
    ? 'unlimited' 
    : Math.max(0, (features.rerollsPerDay as number) - counters.rerolls);

  const incrementActivity = useCallback(() => {
    if (isUnlimitedActivities) return;
    setCounters((prev) => {
      const updated = { ...prev, activities: prev.activities + 1 };
      saveCounters(pageId, updated);
      return updated;
    });
  }, [pageId, isUnlimitedActivities]);

  const incrementReroll = useCallback(() => {
    if (isUnlimitedRerolls) return;
    setCounters((prev) => {
      const updated = { ...prev, rerolls: prev.rerolls + 1 };
      saveCounters(pageId, updated);
      return updated;
    });
  }, [pageId, isUnlimitedRerolls]);

  return {
    features,
    canDoActivity,
    canReroll,
    showHistory: features.hasHistory,
    showFavorites: features.hasFavorites,
    showWeeklyRitual: features.hasWeeklyRitual,
    isPremium: plan === '29_90',
    remainingActivities,
    remainingRerolls,
    activitiesUsedToday: counters.activities,
    rerollsUsedToday: counters.rerolls,
    canFavorite,
    incrementActivity,
    incrementReroll,
  };
}
