import { cn } from "@/lib/utils";
import { Star, Heart } from "lucide-react";
import { motion } from "framer-motion";

interface TestimonialProps {
  name: string;
  relationship: string;
  days: number;
  quote: string;
  avatar?: string;
  className?: string;
}

export const Testimonial = ({
  name,
  relationship,
  days,
  quote,
  avatar,
  className,
}: TestimonialProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-2xl p-6 bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-glow",
        className
      )}
    >
      <div className="space-y-4">
        {/* Stars */}
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-gold text-gold" />
          ))}
        </div>

        {/* Quote */}
        <p className="text-sm text-foreground/90 leading-relaxed">
          "{quote}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 pt-2 border-t border-border/30">
          <div className="w-11 h-11 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm shadow-glow">
            {avatar || name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{name}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{relationship}</span>
              <Heart className="w-3 h-3 fill-primary text-primary" />
              <span className="text-primary font-medium">{days.toLocaleString('pt-BR')} dias</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Testimonial;
