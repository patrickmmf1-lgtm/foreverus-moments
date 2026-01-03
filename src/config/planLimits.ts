export type PlanType = '9_90' | '19_90' | '29_90';

export interface PlanFeatures {
  name: string;
  activitiesPerDay: number | 'unlimited';
  rerollsPerDay: number | 'unlimited';
  photosAllowed: number;
  hasHistory: boolean;
  hasFavorites: boolean;
  maxFavorites: number | 'unlimited';
  hasWeeklyRitual: boolean;
  hasPWA: boolean;
}

export const PLAN_LIMITS: Record<PlanType, PlanFeatures> = {
  '9_90': {
    name: 'Presente',
    activitiesPerDay: 1,
    rerollsPerDay: 1,
    photosAllowed: 1,
    hasHistory: false,
    hasFavorites: false,
    maxFavorites: 0,
    hasWeeklyRitual: false,
    hasPWA: false,
  },
  '19_90': {
    name: 'Interativo',
    activitiesPerDay: 3,
    rerollsPerDay: 5,
    photosAllowed: 1,
    hasHistory: true,
    hasFavorites: true,
    maxFavorites: 3,
    hasWeeklyRitual: false,
    hasPWA: false,
  },
  '29_90': {
    name: 'Premium',
    activitiesPerDay: 'unlimited',
    rerollsPerDay: 'unlimited',
    photosAllowed: 3,
    hasHistory: true,
    hasFavorites: true,
    maxFavorites: 'unlimited',
    hasWeeklyRitual: true,
    hasPWA: true,
  },
};

// Helper to get plan features with fallback
export function getPlanFeatures(plan: string): PlanFeatures {
  const normalizedPlan = plan as PlanType;
  return PLAN_LIMITS[normalizedPlan] || PLAN_LIMITS['9_90'];
}
