import { motion } from "framer-motion";
import { differenceInDays, differenceInYears, differenceInMonths } from "date-fns";
import HeartInfinity from "./HeartInfinity";

// Demo data
const demoData = {
  names: "Ana & João",
  startDate: new Date("2022-06-15"),
  message: "Cada dia ao seu lado é uma aventura que escolho viver 💕",
};

export const PhoneMockup = () => {
  const now = new Date();
  const totalDays = differenceInDays(now, demoData.startDate);
  const years = differenceInYears(now, demoData.startDate);
  const months = differenceInMonths(now, demoData.startDate) % 12;

  return (
    <div className="relative">
      {/* Glow effect behind phone */}
      <div className="absolute inset-0 blur-3xl bg-gradient-primary opacity-20 scale-110" />
      
      {/* Phone frame */}
      <motion.div 
        className="relative w-[280px] md:w-[320px] mx-auto"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Phone outer frame */}
        <div className="relative rounded-[40px] bg-gradient-to-b from-gray-700 to-gray-900 p-2 shadow-2xl">
          {/* Phone inner frame */}
          <div className="rounded-[32px] bg-background overflow-hidden">
            {/* Status bar */}
            <div className="h-8 bg-background flex items-center justify-center">
              <div className="w-20 h-5 rounded-full bg-foreground/10" />
            </div>
            
            {/* Screen content */}
            <div className="bg-gradient-hero min-h-[480px] md:min-h-[520px] p-4">
              {/* Mini header */}
              <div className="flex items-center justify-center mb-4">
                <HeartInfinity size="sm" glow />
                <span className="ml-2 text-sm font-display font-bold text-foreground">ForeverUs</span>
              </div>

              {/* Card with photo and info */}
              <motion.div 
                className="bg-card rounded-2xl border border-border/50 p-4 shadow-elevated"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {/* Photo placeholder with gradient */}
                <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow">
                  <span className="text-4xl">💑</span>
                </div>

                {/* Names */}
                <h2 className="text-xl font-display font-bold text-foreground text-center mb-2">
                  {demoData.names}
                </h2>

                {/* Message */}
                <p className="text-xs text-muted-foreground text-center mb-4 leading-relaxed">
                  {demoData.message}
                </p>

                {/* Divider */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="flex-1 h-px bg-border" />
                  <HeartInfinity size="sm" />
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Counter */}
                <div className="text-center space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Juntos há</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-display font-bold text-gradient-primary">
                      {totalDays.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-sm text-muted-foreground">dias</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-sm">
                    <span className="text-foreground font-medium">{years} anos</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-foreground font-medium">{months} meses</span>
                  </div>
                </div>
              </motion.div>

              {/* Activity suggestion card */}
              <motion.div 
                className="mt-4 bg-card rounded-xl border border-border/50 p-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">💕</span>
                  <span className="text-xs font-medium text-foreground">Sugestão de hoje</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Escrevam uma carta curta um para o outro sobre o que mais admiram...
                </p>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 text-xs bg-primary/20 text-primary rounded-lg py-2 font-medium">
                    ✓ Feito!
                  </button>
                  <button className="text-xs bg-card border border-border rounded-lg px-3 py-2">
                    🔄
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Home indicator */}
            <div className="h-6 bg-background flex items-center justify-center">
              <div className="w-24 h-1 rounded-full bg-foreground/20" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* QR Code floating element */}
      <motion.div
        className="absolute -right-4 md:-right-8 top-20 w-16 h-16 md:w-20 md:h-20 bg-card rounded-xl border border-border shadow-elevated p-2"
        animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <div className="w-full h-full bg-background rounded-lg grid grid-cols-4 gap-0.5 p-1">
          {[...Array(16)].map((_, i) => (
            <div 
              key={i} 
              className={`rounded-sm ${[0, 2, 3, 5, 8, 10, 12, 13, 15].includes(i) ? 'bg-foreground' : 'bg-transparent'}`} 
            />
          ))}
        </div>
      </motion.div>

      {/* Infinity glow decoration */}
      <motion.div
        className="absolute -left-8 md:-left-12 bottom-32"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-primary opacity-20 blur-xl" />
      </motion.div>
    </div>
  );
};

export default PhoneMockup;
