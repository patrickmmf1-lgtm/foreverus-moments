import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { differenceInDays, differenceInYears, differenceInMonths, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";
import { Share2, Heart, RefreshCw, Check, Clock, Sparkles, ChevronDown, Gift, Volume2, VolumeX, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { usePlanRestrictions } from "@/hooks/usePlanRestrictions";
import WeeklyRitualCard from "@/components/WeeklyRitualCard";
import { DEMO_COUPLE_DATA } from "@/config/demoData";
import { PlanType } from "@/config/planLimits";

// Demo activities
const demoActivities = [
  {
    id: "1",
    title: "Carta do coração",
    prompt: "Escrevam uma carta curta um para o outro sobre algo que admiram no parceiro. Leiam em voz alta juntos.",
    category: "conversa",
    emoji: "💬",
    duration: 15,
    type: "couple",
  },
  {
    id: "2",
    title: "Dança na sala",
    prompt: "Escolham 3 músicas especiais para vocês e dancem juntos na sala. Vale abraçar apertado!",
    category: "diversão",
    emoji: "💃",
    duration: 10,
    type: "couple",
  },
  {
    id: "3",
    title: "Massagem relaxante",
    prompt: "Façam uma massagem de 10 minutos um no outro. Comecem pelos ombros e costas.",
    category: "carinho",
    emoji: "💆",
    duration: 20,
    type: "couple",
  },
];

// Time unit card component
const TimeCard = ({ value, label }: { value: number; label: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center"
  >
    <div className="w-12 h-14 md:w-14 md:h-16 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center mb-1">
      <span className="text-xl md:text-2xl font-bold text-white tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
    </div>
    <span className="text-[10px] md:text-xs text-white/70 uppercase tracking-wider font-medium">
      {label}
    </span>
  </motion.div>
);

const Demo = () => {
  const page = DEMO_COUPLE_DATA;
  
  const [now, setNow] = useState(new Date());
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);

  // Plan restrictions hook
  const { 
    features,
    canDoActivity, 
    canReroll, 
    canFavorite,
    showFavorites,
    showWeeklyRitual,
    incrementActivity, 
    incrementReroll,
    remainingActivities,
    remainingRerolls 
  } = usePlanRestrictions(page.plan as PlanType, page.id);

  const activitiesLibrary = demoActivities;
  const currentActivity = activitiesLibrary[currentActivityIndex] || activitiesLibrary[0];

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate time differences
  const startDate = new Date(page.start_date);
  const years = differenceInYears(now, startDate);
  const months = differenceInMonths(now, startDate) % 12;
  const totalDays = differenceInDays(now, startDate);
  const days = Math.floor((totalDays % 365) % 30);
  const hours = differenceInHours(now, startDate) % 24;
  const minutes = differenceInMinutes(now, startDate) % 60;
  const seconds = differenceInSeconds(now, startDate) % 60;

  const handleRefresh = () => {
    if (!canReroll) {
      const rerollLimit = features.rerollsPerDay === 'unlimited' ? "∞" : features.rerollsPerDay;
      toast.error("Limite de trocas atingido!", {
        description: `Você pode trocar ${rerollLimit}x por dia no seu plano.`,
      });
      return;
    }
    incrementReroll();
    const nextIndex = (currentActivityIndex + 1) % activitiesLibrary.length;
    setCurrentActivityIndex(nextIndex);
    const remaining = remainingRerolls === 'unlimited' ? null : (remainingRerolls as number) - 1;
    toast.success("Nova sugestão gerada!", {
      description: remaining !== null && remaining > 0 ? `${remaining} trocas restantes hoje` : undefined,
    });
  };

  const handleComplete = () => {
    if (!canDoActivity) {
      const activityLimit = features.activitiesPerDay === 'unlimited' ? "∞" : features.activitiesPerDay;
      toast.error("Limite de atividades atingido!", {
        description: `Você pode completar ${activityLimit} atividade(s) por dia no seu plano.`,
      });
      return;
    }
    if (!completedActivities.includes(currentActivity.id)) {
      incrementActivity();
      setCompletedActivities([...completedActivities, currentActivity.id]);
      setShowConfetti(true);
      toast.success("Atividade marcada como feita!", {
        description: "Continuem se escolhendo todo dia! 💕",
      });
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleFavorite = () => {
    if (favorites.includes(currentActivity.id)) {
      setFavorites(favorites.filter(id => id !== currentActivity.id));
      toast.info("Removido dos favoritos");
    } else {
      if (!canFavorite(favorites.length)) {
        const maxFav = features.maxFavorites === 'unlimited' ? "∞" : features.maxFavorites;
        toast.error("Limite de favoritos atingido!", {
          description: `Seu plano permite até ${maxFav} favorito(s).`,
        });
        return;
      }
      setFavorites([...favorites, currentActivity.id]);
      toast.success("Adicionado aos favoritos!");
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const title = `${page.name1}  &  ${page.name2}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Veja nossa página do casal no PraSempre!`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copiado!");
    }
  };

  const handleOpenSurprise = () => {
    setShowSurprise(true);
    setShowConfetti(true);
    toast.success("🎁 Surpresa aberta!", {
      description: page.message,
      duration: 8000,
    });
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const scrollToActivities = () => {
    document.getElementById('activities-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const isCompleted = completedActivities.includes(currentActivity.id);
  const isFavorited = favorites.includes(currentActivity.id);
  const displayTitle = `${page.name1}  &  ${page.name2}`;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Demo banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-primary/90 backdrop-blur-sm text-primary-foreground text-center py-2 text-sm font-medium">
        ✨ Esta é uma página de demonstração — <a href="/criar" className="underline hover:no-underline">Crie a sua!</a>
      </div>

      {/* Confetti effect */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#ec4899', '#f59e0b', '#8b5cf6', '#10b981'][i % 4],
                }}
                initial={{ y: -20, opacity: 1, scale: 0 }}
                animate={{
                  y: window.innerHeight + 100,
                  opacity: [1, 1, 0],
                  scale: [0, 1, 0.5],
                  rotate: Math.random() * 720,
                }}
                transition={{
                  duration: 2.5 + Math.random(),
                  delay: Math.random() * 0.5,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden pt-10">
        {/* Background Photo */}
        <div className="absolute inset-0">
          <img
            src={page.photo_url}
            alt="Foto"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Top Header */}
        <div className="absolute top-12 left-0 right-0 z-10 p-4 flex items-center justify-between">
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleOpenSurprise}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium hover:bg-white/30 transition-colors"
          >
            <Gift className="w-4 h-4" />
            <span>Toque para abrir sua surpresa</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end pb-8 px-6">
          {page.occasion && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center text-white/80 text-sm md:text-base mb-2"
            >
              {page.occasion}
            </motion.p>
          )}

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl text-white text-center mb-6"
            style={{ 
              fontFamily: 'var(--font-script)',
              textShadow: '0 2px 20px rgba(0,0,0,0.5)'
            }}
          >
            {displayTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white/70 text-xs md:text-sm uppercase tracking-[0.3em] text-center font-medium mb-4"
          >
            Juntos há
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-2 md:gap-3 mb-8"
          >
            <TimeCard value={years} label="anos" />
            <TimeCard value={months} label="meses" />
            <TimeCard value={days} label="dias" />
            <TimeCard value={hours} label="horas" />
            <TimeCard value={minutes} label="min" />
            <TimeCard value={seconds} label="seg" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex justify-center gap-3 mb-6"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={handleShare}
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{ 
              opacity: { delay: 1 },
              y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
            onClick={scrollToActivities}
            className="flex flex-col items-center gap-1 text-white/50 hover:text-white/70 transition-colors mx-auto"
          >
            <span className="text-xs uppercase tracking-wider">Atividades</span>
            <ChevronDown className="w-5 h-5" />
          </motion.button>
        </div>
      </section>

      {/* ACTIVITIES SECTION */}
      <section 
        id="activities-section" 
        className="min-h-screen bg-background py-8 px-6"
      >
        <div className="max-w-lg mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Sugestão de hoje</span>
            </div>
          </motion.div>

          <WeeklyRitualCard hasAccess={showWeeklyRitual} />

          {/* Activity card */}
          <motion.div
            key={currentActivity.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl bg-card border border-border/50 p-6 shadow-elevated"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/15 text-primary text-sm font-medium rounded-full">
                <span className="text-lg">{currentActivity.emoji}</span>
                {currentActivity.category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {currentActivity.duration} min
              </span>
            </div>

            <h3 className="text-2xl font-display font-bold text-foreground mb-3">
              {currentActivity.title}
            </h3>

            <p className="text-muted-foreground leading-relaxed mb-6">
              {currentActivity.prompt}
            </p>

            <div className="flex items-center gap-3">
              <Button
                variant={isCompleted ? "default" : "neon"}
                size="lg"
                className="flex-1"
                onClick={handleComplete}
                disabled={isCompleted || !canDoActivity}
              >
                {!canDoActivity && !isCompleted ? (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Limite atingido
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    {isCompleted ? "Feito! ✓" : "Marcar como feito"}
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-xl"
                onClick={handleRefresh}
                disabled={!canReroll}
              >
                <RefreshCw className="w-5 h-5" />
              </Button>

              {showFavorites && (
                <Button
                  variant="outline"
                  size="icon"
                  className={`w-12 h-12 rounded-xl ${isFavorited ? 'text-rose-500 border-rose-500/50' : ''}`}
                  onClick={handleFavorite}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </Button>
              )}
            </div>
          </motion.div>

          {/* Favorites list */}
          {showFavorites && favorites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-card/50 border border-border/30 p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-4 h-4 text-rose-500" />
                <h4 className="font-medium text-foreground">Seus favoritos</h4>
              </div>
              <div className="space-y-2">
                {favorites.map(favId => {
                  const activity = activitiesLibrary.find(a => a.id === favId);
                  if (!activity) return null;
                  return (
                    <div 
                      key={favId}
                      className="flex items-center gap-3 p-3 rounded-xl bg-background/50"
                    >
                      <span className="text-lg">{activity.emoji}</span>
                      <span className="text-sm text-foreground">{activity.title}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* CTA to create own page */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 p-6 text-center"
          >
            <h3 className="text-xl font-display font-bold text-foreground mb-2">
              Gostou? Crie a sua página!
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Surpreenda seu amor com uma página personalizada para vocês.
            </p>
            <Button variant="neon" size="lg" onClick={() => window.location.href = '/criar'}>
              Criar minha página
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Demo;
