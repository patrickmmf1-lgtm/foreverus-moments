import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Clock, Heart, RefreshCw, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Activity {
  id: string;
  title: string;
  prompt: string;
  category: string;
  duration: number;
  intensity: "leve" | "média";
}

interface ActivityCardProps {
  activity: Activity;
  onRefresh?: () => void;
  onComplete?: () => void;
  onFavorite?: () => void;
  refreshCount?: number;
  maxRefreshes?: number;
  canFavorite?: boolean;
  isFavorited?: boolean;
  isRitual?: boolean;
  className?: string;
}

const categoryEmojis: Record<string, string> = {
  conversa: "💬",
  carinho: "💕",
  diversão: "🎉",
  encontro: "🌹",
  surpresa: "🎁",
  intimidade_leve: "✨",
};

const categoryLabels: Record<string, string> = {
  conversa: "Conversa",
  carinho: "Carinho",
  diversão: "Diversão",
  encontro: "Encontro",
  surpresa: "Surpresa",
  intimidade_leve: "Momento especial",
};

export const ActivityCard = ({
  activity,
  onRefresh,
  onComplete,
  onFavorite,
  refreshCount = 0,
  maxRefreshes = 1,
  canFavorite = false,
  isFavorited = false,
  isRitual = false,
  className,
}: ActivityCardProps) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    setShowConfetti(true);
    onComplete?.();
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const canRefresh = refreshCount < maxRefreshes;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "relative rounded-2xl p-6 bg-gradient-card border border-border shadow-card overflow-hidden",
        isRitual && "border-gold border-2",
        className
      )}
    >
      {/* Ritual badge */}
      {isRitual && (
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-gold text-gold-foreground px-3 py-1 text-xs font-semibold rounded-bl-lg flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Ritual da semana
          </div>
        </div>
      )}

      {/* Confetti animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: "50%", 
                  y: "50%", 
                  scale: 0 
                }}
                animate={{ 
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: [0, 1, 0],
                  rotate: Math.random() * 360,
                }}
                transition={{ 
                  duration: 1.5,
                  ease: "easeOut",
                  delay: i * 0.05,
                }}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: i % 3 === 0 
                    ? "hsl(345, 55%, 32%)" 
                    : i % 3 === 1 
                    ? "hsl(40, 60%, 50%)" 
                    : "hsl(350, 35%, 75%)",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {/* Category & Duration */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-light text-primary text-xs font-medium rounded-full">
            <span>{categoryEmojis[activity.category] || "✨"}</span>
            {categoryLabels[activity.category] || activity.category}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {activity.duration} min
          </span>
        </div>

        {/* Title & Prompt */}
        <div className="space-y-2">
          <h3 className="text-lg font-serif font-semibold text-foreground">
            {activity.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {activity.prompt}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant={isCompleted ? "default" : "activity"}
            size="sm"
            className="flex-1"
            onClick={handleComplete}
            disabled={isCompleted}
          >
            <Check className="w-4 h-4" />
            {isCompleted ? "Feito!" : "Marcar como feito"}
          </Button>

          {canFavorite && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onFavorite}
              className={cn(
                "transition-colors",
                isFavorited && "text-primary bg-primary-light"
              )}
            >
              <Heart className={cn("w-4 h-4", isFavorited && "fill-current")} />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onRefresh}
            disabled={!canRefresh}
            title={canRefresh ? "Gerar outra sugestão" : `Limite de ${maxRefreshes} atingido hoje`}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Refresh limit indicator */}
        {maxRefreshes > 1 && (
          <p className="text-xs text-center text-muted-foreground">
            {refreshCount}/{maxRefreshes} sugestões geradas hoje
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ActivityCard;
