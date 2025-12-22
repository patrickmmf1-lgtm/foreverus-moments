import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
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
        "rounded-2xl p-6 bg-card border border-border shadow-soft",
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
        <p className="text-sm text-foreground italic leading-relaxed">
          "{quote}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-serif font-semibold">
            {avatar || name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">
              {relationship} • {days.toLocaleString('pt-BR')} dias juntos
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Testimonial;
