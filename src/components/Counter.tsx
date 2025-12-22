import { useEffect, useState } from "react";
import { differenceInDays, differenceInMonths, differenceInYears, addYears, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CounterProps {
  startDate: Date;
  className?: string;
  showNextMilestone?: boolean;
}

export const Counter = ({ startDate, className, showNextMilestone = true }: CounterProps) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalDays = differenceInDays(now, startDate);
  const years = differenceInYears(now, startDate);
  const months = differenceInMonths(now, startDate) % 12;
  const days = totalDays % 30;

  // Calculate next anniversary
  const thisYearAnniversary = new Date(
    now.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const nextAnniversary = thisYearAnniversary > now 
    ? thisYearAnniversary 
    : addYears(thisYearAnniversary, 1);
  const daysUntilAnniversary = differenceInDays(nextAnniversary, now);
  const nextAnniversaryYears = differenceInYears(nextAnniversary, startDate);

  return (
    <div className={cn("text-center space-y-6", className)}>
      {/* Main counter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Juntos há
        </p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="counter-number text-5xl md:text-6xl font-serif font-bold text-primary">
            {totalDays.toLocaleString('pt-BR')}
          </span>
          <span className="text-xl text-muted-foreground font-medium">
            dias
          </span>
        </div>
      </motion.div>

      {/* Detailed breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center justify-center gap-4 md:gap-6"
      >
        {years > 0 && (
          <div className="text-center">
            <span className="counter-number text-2xl md:text-3xl font-serif font-semibold text-foreground">
              {years}
            </span>
            <p className="text-xs text-muted-foreground">
              {years === 1 ? "ano" : "anos"}
            </p>
          </div>
        )}
        <div className="text-center">
          <span className="counter-number text-2xl md:text-3xl font-serif font-semibold text-foreground">
            {months}
          </span>
          <p className="text-xs text-muted-foreground">
            {months === 1 ? "mês" : "meses"}
          </p>
        </div>
        <div className="text-center">
          <span className="counter-number text-2xl md:text-3xl font-serif font-semibold text-foreground">
            {days}
          </span>
          <p className="text-xs text-muted-foreground">dias</p>
        </div>
      </motion.div>

      {/* Next milestone */}
      {showNextMilestone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-4 border-t border-border"
        >
          <p className="text-sm text-muted-foreground">
            Próximo aniversário em{" "}
            <span className="font-semibold text-gold">
              {daysUntilAnniversary} dias
            </span>
            <br />
            <span className="text-xs">
              {format(nextAnniversary, "d 'de' MMMM", { locale: ptBR })} • {nextAnniversaryYears} {nextAnniversaryYears === 1 ? "ano" : "anos"}
            </span>
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Counter;
