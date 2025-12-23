import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Camera, Star, Clock, Download } from "lucide-react";
import { PLAN_LIMITS, PlanId } from "@/lib/planLimits";
import { cn } from "@/lib/utils";

interface PlanBenefitsBannerProps {
  planId: PlanId;
  previousPlanId?: PlanId;
}

const planIcons: Record<PlanId, React.ReactNode> = {
  "9_90": <Star className="w-5 h-5" />,
  "19_90": <Clock className="w-5 h-5" />,
  "29_90": <Sparkles className="w-5 h-5" />,
};

const planGradients: Record<PlanId, string> = {
  "9_90": "from-primary/10 to-primary/5 border-primary/20",
  "19_90": "from-blue-500/10 to-blue-500/5 border-blue-500/20",
  "29_90": "from-amber-500/10 via-amber-500/5 to-amber-400/10 border-amber-500/30",
};

export function PlanBenefitsBanner({ planId, previousPlanId }: PlanBenefitsBannerProps) {
  const limits = PLAN_LIMITS[planId];
  const isPremium = planId === "29_90";

  // Check if upgrading to more photos
  const previousMaxPhotos = previousPlanId ? PLAN_LIMITS[previousPlanId].maxPhotos : 1;
  const photosIncreased = limits.maxPhotos > previousMaxPhotos;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={planId}
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        className={cn(
          "rounded-xl border p-4 bg-gradient-to-br",
          planGradients[planId]
        )}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            isPremium ? "bg-gradient-gold text-amber-900" : "bg-primary/20 text-primary"
          )}>
            {planIcons[planId]}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Plano {limits.name}
              {isPremium && " ✨"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isPremium ? "A melhor experiência!" : "Você selecionou este plano"}
            </p>
          </div>
        </div>

        {/* Highlight key benefits */}
        <div className="space-y-2">
          {/* Photos highlight */}
          <motion.div
            initial={photosIncreased ? { scale: 1.05, backgroundColor: "rgba(var(--primary), 0.2)" } : {}}
            animate={{ scale: 1, backgroundColor: "transparent" }}
            transition={{ duration: 0.3 }}
            className={cn(
              "flex items-center gap-2 text-sm rounded-lg p-2 -mx-2",
              photosIncreased && "bg-primary/10"
            )}
          >
            <Camera className={cn(
              "w-4 h-4",
              isPremium ? "text-amber-600" : "text-primary"
            )} />
            <span className="text-foreground">
              {limits.maxPhotos === 1 ? (
                "1 foto"
              ) : (
                <span className="font-medium">
                  Até {limits.maxPhotos} fotos! 📸
                </span>
              )}
            </span>
          </motion.div>

          {/* Quick features list */}
          <div className="grid grid-cols-2 gap-1.5">
            {limits.features.slice(0, 4).map((feature, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Check className="w-3 h-3 text-primary flex-shrink-0" />
                <span className="truncate">{feature}</span>
              </div>
            ))}
          </div>

          {/* PWA highlight for premium */}
          {limits.hasPWA && (
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-100/50 dark:bg-amber-900/20 dark:text-amber-400 rounded-lg p-2 mt-2">
              <Download className="w-4 h-4" />
              <span>Instalar como app no celular!</span>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
