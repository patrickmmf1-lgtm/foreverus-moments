import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Check, X, Crown, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PlanCardProps {
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  highlighted?: boolean;
  badge?: string;
  badgeType?: "popular" | "premium";
  icon?: React.ReactNode;
  onSelect?: () => void;
  className?: string;
  cta?: string;
  anchorText?: string;
  bonuses?: string[];
}

export const PlanCard = ({
  name,
  price,
  description,
  features,
  highlighted = false,
  badge,
  badgeType = "popular",
  icon,
  onSelect,
  className,
  cta,
  anchorText,
  bonuses,
}: PlanCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative rounded-2xl p-6 md:p-8 transition-all duration-300",
        highlighted
          ? "bg-gradient-card border-2 border-primary/50 shadow-neon scale-105 z-10"
          : "bg-card border border-border/50 hover:border-primary/30 hover:shadow-glow",
        className
      )}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className={cn(
            "inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-full",
            badgeType === "popular" 
              ? "badge-popular" 
              : "badge-premium"
          )}>
            {badgeType === "popular" ? <Crown className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            {badge}
          </span>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 pt-2">
          {icon && (
            <div className={cn(
              "inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-2",
              highlighted 
                ? "bg-gradient-primary text-primary-foreground shadow-glow" 
                : "bg-primary/15 text-primary"
            )}>
              {icon}
            </div>
          )}
          <h3 className="text-xl font-display font-bold text-foreground">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Price */}
        <div className="text-center py-4 border-y border-border/50">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-base text-muted-foreground">R$</span>
            <span className={cn(
              "text-5xl font-display font-bold",
              highlighted ? "text-gradient-primary" : "text-foreground"
            )}>
              {price}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            pagamento único • acesso vitalício
          </p>
          
          {/* Anchor text for Premium */}
          {anchorText && (
            <p className="text-xs text-primary font-medium mt-3 px-2">
              {anchorText}
            </p>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li
              key={index}
              className={cn(
                "flex items-start gap-3 text-sm",
                feature.included ? "text-foreground" : "text-muted-foreground/50"
              )}
            >
              <div
                className={cn(
                  "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5",
                  feature.included
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground/50"
                )}
              >
                {feature.included ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <X className="w-3 h-3" />
                )}
              </div>
              <span className={!feature.included ? "line-through" : ""}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        {/* Bonuses section for Premium */}
        {bonuses && bonuses.length > 0 && (
          <div className="rounded-xl bg-primary/10 border border-primary/20 p-4">
            <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
              🎁 Bônus Premium
            </h4>
            <ul className="space-y-2">
              {bonuses.map((bonus, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-foreground">
                  <span className="text-primary">•</span>
                  {bonus}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA */}
        <Button
          variant={highlighted ? "neon" : "hero-outline"}
          size="lg"
          className="w-full"
          onClick={onSelect}
        >
          {cta || (highlighted ? "Escolher Premium" : "Escolher plano")}
        </Button>
      </div>
    </motion.div>
  );
};

export default PlanCard;
