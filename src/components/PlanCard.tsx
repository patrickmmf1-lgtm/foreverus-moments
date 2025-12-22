import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Check, Crown, Heart, Star } from "lucide-react";
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
  icon?: React.ReactNode;
  onSelect?: () => void;
  className?: string;
}

export const PlanCard = ({
  name,
  price,
  description,
  features,
  highlighted = false,
  badge,
  icon,
  onSelect,
  className,
}: PlanCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative rounded-2xl p-6 md:p-8 transition-all duration-300",
        highlighted
          ? "bg-gradient-card border-2 border-gold shadow-elevated scale-105 z-10"
          : "bg-card border border-border shadow-card hover:shadow-elevated",
        "card-hover",
        className
      )}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-gradient-gold text-gold-foreground text-xs font-semibold rounded-full shadow-soft">
            <Crown className="w-3 h-3" />
            {badge}
          </span>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          {icon && (
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-light text-primary mb-2">
              {icon}
            </div>
          )}
          <h3 className="text-xl font-serif font-semibold text-foreground">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Price */}
        <div className="text-center py-4 border-y border-border">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-sm text-muted-foreground">R$</span>
            <span className="text-4xl font-serif font-bold text-foreground">
              {price}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            pagamento único, para sempre
          </p>
        </div>

        {/* Features */}
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li
              key={index}
              className={cn(
                "flex items-start gap-3 text-sm",
                feature.included ? "text-foreground" : "text-muted-foreground line-through opacity-60"
              )}
            >
              <div
                className={cn(
                  "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5",
                  feature.included
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Check className="w-3 h-3" />
              </div>
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          variant={highlighted ? "wine" : "hero-outline"}
          size="lg"
          className="w-full"
          onClick={onSelect}
        >
          {highlighted ? "Escolher Premium" : "Escolher plano"}
        </Button>
      </div>
    </motion.div>
  );
};

export default PlanCard;
