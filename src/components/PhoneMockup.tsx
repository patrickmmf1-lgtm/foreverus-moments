import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { differenceInDays, differenceInYears, differenceInMonths, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";
import { Gift, Volume2 } from "lucide-react";
import { DEMO_COUPLE_DATA } from "@/config/demoData";

// Use centralized demo data
const demoData = {
  name1: DEMO_COUPLE_DATA.name1,
  name2: DEMO_COUPLE_DATA.name2,
  occasion: DEMO_COUPLE_DATA.occasion,
  startDate: new Date(DEMO_COUPLE_DATA.start_date),
  photoUrl: DEMO_COUPLE_DATA.photo_url,
};

// Mini time card for mockup
const MiniTimeCard = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-9 md:w-9 md:h-10 rounded-lg bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-0.5">
      <span className="text-xs md:text-sm font-bold text-white tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
    </div>
    <span className="text-[7px] md:text-[8px] text-white/60 uppercase tracking-wider">
      {label}
    </span>
  </div>
);

export const PhoneMockup = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const years = differenceInYears(now, demoData.startDate);
  const months = differenceInMonths(now, demoData.startDate) % 12;
  const totalDays = differenceInDays(now, demoData.startDate);
  const days = Math.floor((totalDays % 365) % 30);
  const hours = differenceInHours(now, demoData.startDate) % 24;
  const minutes = differenceInMinutes(now, demoData.startDate) % 60;
  const seconds = differenceInSeconds(now, demoData.startDate) % 60;

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
            
            {/* Screen content - LoveMemo style */}
            <div className="relative h-[480px] md:h-[520px] overflow-hidden">
              {/* Background Photo */}
              <img
                src={demoData.photoUrl}
                alt="Foto do casal"
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Subtle dark overlay */}
              <div className="absolute inset-0 bg-black/25" />
              
              {/* Gradient fade at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Top Header */}
              <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between">
                {/* Tap to open surprise */}
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[9px] font-medium">
                  <Gift className="w-3 h-3" />
                  <span>Toque para abrir</span>
                </div>

                {/* Sound toggle */}
                <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white">
                  <Volume2 className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Content - Bottom */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 pb-5">
                {/* Occasion */}
                <p className="text-center text-white/70 text-[10px] mb-1">
                  {demoData.occasion}
                </p>

                {/* Couple Names - Script Font */}
                <h2 
                  className="text-2xl md:text-3xl text-white text-center mb-3"
                  style={{ 
                    fontFamily: 'var(--font-script)',
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                  }}
                >
                  {demoData.name1}<span className="mx-2">&</span>{demoData.name2}
                </h2>

                {/* Together for label */}
                <p className="text-white/60 text-[9px] uppercase tracking-[0.2em] text-center font-medium mb-2">
                  Juntos há
                </p>

                {/* Time Cards */}
                <div className="flex items-center justify-center gap-1.5 mb-3">
                  <MiniTimeCard value={years} label="anos" />
                  <MiniTimeCard value={months} label="meses" />
                  <MiniTimeCard value={days} label="dias" />
                  <MiniTimeCard value={hours} label="hrs" />
                  <MiniTimeCard value={minutes} label="min" />
                  <MiniTimeCard value={seconds} label="seg" />
                </div>
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
