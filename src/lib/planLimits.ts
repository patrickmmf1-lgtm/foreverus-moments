export type PlanId = "9_90" | "19_90" | "29_90";

export interface PlanLimits {
  name: string;
  maxPhotos: number;
  activitiesPerDay: number;
  regeneratesPerDay: number;
  historyLimit: number;
  favoritesLimit: number;
  hasWeeklyRitual: boolean;
  hasPWA: boolean;
  features: string[];
}

export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  "9_90": {
    name: "Presente",
    maxPhotos: 1,
    activitiesPerDay: 1,
    regeneratesPerDay: 1,
    historyLimit: 0,
    favoritesLimit: 0,
    hasWeeklyRitual: false,
    hasPWA: false,
    features: [
      "1 atividade por dia",
      "1 troca de atividade",
      "Contador de tempo",
      "Mensagem surpresa",
    ],
  },
  "19_90": {
    name: "Interativo",
    maxPhotos: 1,
    activitiesPerDay: 3,
    regeneratesPerDay: 5,
    historyLimit: 10,
    favoritesLimit: 3,
    hasWeeklyRitual: false,
    hasPWA: false,
    features: [
      "3 atividades por dia",
      "5 trocas de atividade",
      "Histórico de atividades",
      "Até 3 favoritos",
      "Contador de tempo",
      "Mensagem surpresa",
    ],
  },
  "29_90": {
    name: "Premium",
    maxPhotos: 3,
    activitiesPerDay: Infinity,
    regeneratesPerDay: Infinity,
    historyLimit: Infinity,
    favoritesLimit: Infinity,
    hasWeeklyRitual: true,
    hasPWA: true,
    features: [
      "Atividades ilimitadas",
      "Trocas ilimitadas",
      "Até 3 fotos",
      "Histórico completo",
      "Favoritos ilimitados",
      "Ritual da semana",
      "Instalar como app (PWA)",
    ],
  },
};

export function getPlanLimits(planId: string): PlanLimits {
  return PLAN_LIMITS[planId as PlanId] || PLAN_LIMITS["9_90"];
}
