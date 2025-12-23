import { motion } from "framer-motion";
import { differenceInDays, differenceInYears, differenceInMonths } from "date-fns";

// Demo data
const demoData = {
  names: "Ana & João",
  startDate: new Date("2022-06-15"),
};

export const PhoneMockup = () => {
  const now = new Date();
  const totalDays = differenceInDays(now, demoData.startDate);
  const years = differenceInYears(now, demoData.startDate);
  const months = differenceInMonths(now, demoData.startDate) % 12;

  return (
    <div className="relative">
      {/* Glow effect behind phone */}
      <div className="absolute inset-0 blur-3xl bg-gradient-primary opacity-30 scale-110" />
      
      {/* Phone frame */}
      <motion.div 
        className="relative w-[260px] md:w-[300px] mx-auto"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Phone outer frame */}
        <div className="relative rounded-[40px] bg-gradient-to-b from-gray-700 to-gray-900 p-2 shadow-2xl">
          {/* Phone inner frame */}
          <div className="rounded-[32px] overflow-hidden">
            {/* Status bar */}
            <div className="h-7 bg-black flex items-center justify-center relative z-10">
              <div className="w-20 h-5 rounded-full bg-black" />
            </div>
            
            {/* Screen content - Tinder/LoveYuu style */}
            <div className="relative h-[480px] md:h-[520px] overflow-hidden">
              {/* Background gradient (simulating couple photo) */}
              <div className="absolute inset-0 bg-gradient-to-br from-rose-900 via-purple-900 to-violet-950" />
              
              {/* Overlay pattern */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `radial-gradient(circle at 30% 70%, rgba(236, 72, 153, 0.4) 0%, transparent 50%),
                                   radial-gradient(circle at 70% 30%, rgba(139, 92, 246, 0.4) 0%, transparent 50%)`
                }}
              />

              {/* Floating hearts */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-white/10"
                  style={{
                    left: `${15 + i * 18}%`,
                    top: `${25 + (i % 2) * 20}%`,
                    fontSize: `${1.2 + (i % 2) * 0.5}rem`
                  }}
                  animate={{
                    y: [-10, 10, -10],
                    opacity: [0.05, 0.15, 0.05]
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3
                  }}
                >
                  ♥
                </motion.div>
              ))}

              {/* Dark fade gradient from bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-4 pb-6">
                {/* Small photo circle */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 p-0.5 shadow-lg">
                    <div className="w-full h-full rounded-full bg-black/30 flex items-center justify-center">
                      <span className="text-2xl">💑</span>
                    </div>
                  </div>
                </div>

                {/* Names */}
                <h2 className="text-xl font-display font-bold text-white text-center mb-3">
                  {demoData.names}
                </h2>

                {/* Juntos label */}
                <p className="text-rose-300 text-[10px] uppercase tracking-[0.2em] text-center font-medium mb-1">
                  Juntos
                </p>

                {/* Giant days counter */}
                <div className="text-center mb-2">
                  <span 
                    className="text-5xl md:text-6xl font-display font-bold text-white"
                    style={{ textShadow: '0 0 40px rgba(236, 72, 153, 0.5)' }}
                  >
                    {totalDays.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-sm text-white/60 ml-2">dias</span>
                </div>

                {/* Breakdown */}
                <div className="flex items-center justify-center gap-4 mb-4">
                  {years > 0 && (
                    <>
                      <div className="text-center">
                        <span className="text-lg font-display font-bold text-white">{years}</span>
                        <p className="text-[9px] text-white/50 uppercase">{years === 1 ? "ano" : "anos"}</p>
                      </div>
                      <div className="w-px h-4 bg-white/20" />
                    </>
                  )}
                  <div className="text-center">
                    <span className="text-lg font-display font-bold text-white">{months}</span>
                    <p className="text-[9px] text-white/50 uppercase">{months === 1 ? "mês" : "meses"}</p>
                  </div>
                </div>

                {/* Activity suggestion mini card */}
                <motion.div 
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm">💕</span>
                    <span className="text-[10px] font-medium text-white/80">Sugestão de hoje</span>
                  </div>
                  <p className="text-[10px] text-white/60 leading-relaxed">
                    Escrevam uma carta curta um para o outro...
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button className="flex-1 text-[10px] bg-rose-500/80 text-white rounded-lg py-1.5 font-medium">
                      ✓ Feito!
                    </button>
                    <button className="text-[10px] bg-white/10 border border-white/20 text-white/70 rounded-lg px-2 py-1.5">
                      🔄
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Home indicator */}
            <div className="h-5 bg-black flex items-center justify-center">
              <div className="w-20 h-1 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* QR Code floating element */}
      <motion.div
        className="absolute -right-4 md:-right-8 top-20 w-14 h-14 md:w-16 md:h-16 bg-card rounded-xl border border-border shadow-elevated p-1.5"
        animate={{ y: [0, -6, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <div className="w-full h-full bg-white rounded-lg grid grid-cols-4 gap-0.5 p-1">
          {[...Array(16)].map((_, i) => (
            <div 
              key={i} 
              className={`rounded-sm ${[0, 2, 3, 5, 8, 10, 12, 13, 15].includes(i) ? 'bg-foreground' : 'bg-transparent'}`} 
            />
          ))}
        </div>
      </motion.div>

      {/* Glow decoration */}
      <motion.div
        className="absolute -left-6 md:-left-10 bottom-28"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-primary blur-2xl" />
      </motion.div>
    </div>
  );
};

export default PhoneMockup;
