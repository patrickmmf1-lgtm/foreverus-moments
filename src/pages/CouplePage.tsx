import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { differenceInDays, differenceInYears, differenceInMonths, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";
import { Share2, Heart, RefreshCw, Check, Clock, Sparkles, ChevronDown, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { usePageData } from "@/hooks/usePageData";
import { usePlanRestrictions } from "@/hooks/usePlanRestrictions";
import WeeklyRitualCard from "@/components/WeeklyRitualCard";
import PhotoCarousel from "@/components/PhotoCarousel";
import QRCodeCard from "@/components/QRCodeCard";
import YearAlbum from "@/components/YearAlbum";
import SurpriseLetter from "@/components/SurpriseLetter";

// Fallback activities if none in database
const fallbackActivities = [{
  id: "1",
  title: "Carta do coração",
  prompt: "Escrevam uma carta curta um para o outro sobre algo que admiram no parceiro. Leiam em voz alta juntos.",
  category: "conversa",
  emoji: "💬",
  duration: 15,
  type: "couple"
}, {
  id: "2",
  title: "Dança na sala",
  prompt: "Escolham 3 músicas especiais para vocês e dancem juntos na sala. Vale abraçar apertado!",
  category: "diversão",
  emoji: "💃",
  duration: 10,
  type: "couple"
}, {
  id: "3",
  title: "Massagem relaxante",
  prompt: "Façam uma massagem de 10 minutos um no outro. Comecem pelos ombros e costas.",
  category: "carinho",
  emoji: "💆",
  duration: 20,
  type: "couple"
}];

// Time unit card component
const TimeCard = ({
  value,
  label
}: {
  value: number;
  label: string;
}) => <motion.div initial={{
  opacity: 0,
  y: 10
}} animate={{
  opacity: 1,
  y: 0
}} className="flex flex-col items-center">
    <div className="w-12 h-14 md:w-14 md:h-16 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center mb-1">
      <span className="text-xl md:text-2xl font-bold text-white tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
    </div>
    <span className="text-[10px] md:text-xs text-white/70 uppercase tracking-wider font-medium">
      {label}
    </span>
  </motion.div>;

// Default placeholder image
const defaultPhotoUrl = "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80";

// Função para selecionar atividade baseada em seed (consistente por dia)
function getActivityIndexForDay(pageId: string, activitiesLength: number): number {
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const seedString = `${pageId}_${dateString}`;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    const char = seedString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % activitiesLength;
}
const CouplePage = () => {
  const {
    slug
  } = useParams();
  const navigate = useNavigate();
  const {
    page,
    activities,
    isLoading,
    error
  } = usePageData(slug);
  const [now, setNow] = useState(new Date());
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // Plan restrictions hook - use page data once loaded
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
  } = usePlanRestrictions(page?.plan || "9_90", page?.id || "temp");

  // Use activities from database or fallback
  const activitiesLibrary = activities.length > 0 ? activities : fallbackActivities;
  const currentActivity = activitiesLibrary[currentActivityIndex] || activitiesLibrary[0];

  // Save slug to localStorage for PWA redirect
  useEffect(() => {
    if (slug) {
      localStorage.setItem("prasempre_couple_slug", slug);
    }
  }, [slug]);

  // Set initial activity index based on page ID and date
  useEffect(() => {
    if (page?.id && activitiesLibrary.length > 0) {
      const dayIndex = getActivityIndexForDay(page.id, activitiesLibrary.length);
      setCurrentActivityIndex(dayIndex);
    }
  }, [page?.id, activitiesLibrary.length]);

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Loading state
  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Carregando sua página...</p>
        </div>
      </div>;
  }

  // Error state
  if (error || !page) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto px-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Heart className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Página não encontrada
          </h1>
          <p className="text-muted-foreground">
            Esta página não existe ou foi desativada.
          </p>
          <Button variant="neon" onClick={() => navigate("/criar")}>
            Criar minha página
          </Button>
        </div>
      </div>;
  }

  // Calculate time differences
  const startDate = new Date(page.start_date);
  const years = differenceInYears(now, startDate);
  const months = differenceInMonths(now, startDate) % 12;
  const totalDays = differenceInDays(now, startDate);
  const days = Math.floor(totalDays % 365 % 30);
  const hours = differenceInHours(now, startDate) % 24;
  const minutes = differenceInMinutes(now, startDate) % 60;
  const seconds = differenceInSeconds(now, startDate) % 60;
  const handleRefresh = () => {
    if (!canReroll) {
      const rerollLimit = features.rerollsPerDay === 'unlimited' ? "∞" : features.rerollsPerDay;
      toast.error("Limite de trocas atingido!", {
        description: `Você pode trocar ${rerollLimit}x por dia no seu plano.`
      });
      return;
    }
    incrementReroll();
    const nextIndex = (currentActivityIndex + 1) % activitiesLibrary.length;
    setCurrentActivityIndex(nextIndex);
    const remaining = remainingRerolls === 'unlimited' ? null : (remainingRerolls as number) - 1;
    toast.success("Nova sugestão gerada!", {
      description: remaining !== null && remaining > 0 ? `${remaining} trocas restantes hoje` : undefined
    });
  };
  const handleComplete = () => {
    if (!canDoActivity) {
      const activityLimit = features.activitiesPerDay === 'unlimited' ? "∞" : features.activitiesPerDay;
      toast.error("Limite de atividades atingido!", {
        description: `Você pode completar ${activityLimit} atividade(s) por dia no seu plano.`
      });
      return;
    }
    if (!completedActivities.includes(currentActivity.id)) {
      incrementActivity();
      setCompletedActivities([...completedActivities, currentActivity.id]);
      setShowConfetti(true);
      toast.success("Atividade marcada como feita!", {
        description: "Continuem se escolhendo todo dia! 💕"
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
          description: `Seu plano permite até ${maxFav} favorito(s).`
        });
        return;
      }
      setFavorites([...favorites, currentActivity.id]);
      toast.success("Adicionado aos favoritos!");
    }
  };
  const handleShare = async () => {
    const shareUrl = window.location.href;
    const title = page.name2 ? `${page.name1} & ${page.name2}` : page.name1;
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: "Veja nossa página do casal no PraSempre!",
          url: shareUrl
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copiado!");
    }
  };
  const scrollToActivities = () => {
    document.getElementById('activities-section')?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  const isCompleted = completedActivities.includes(currentActivity.id);
  const isFavorited = favorites.includes(currentActivity.id);

  // Display names with proper spacing
  const displayTitle = page.name2 ? <>{page.name1}<span className="mx-2">&</span>{page.name2}</> : page.name1;
  return <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Confetti effect */}
      <AnimatePresence>
        {showConfetti && <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(30)].map((_, i) => <motion.div key={i} className="absolute w-3 h-3 rounded-full" style={{
          left: `${Math.random() * 100}%`,
          backgroundColor: ['#ec4899', '#f59e0b', '#8b5cf6', '#10b981'][i % 4]
        }} initial={{
          y: -20,
          opacity: 1,
          scale: 0
        }} animate={{
          y: window.innerHeight + 100,
          opacity: [1, 1, 0],
          scale: [0, 1, 0.5],
          rotate: Math.random() * 720
        }} transition={{
          duration: 2.5 + Math.random(),
          delay: Math.random() * 0.5,
          ease: "easeOut"
        }} />)}
          </div>}
      </AnimatePresence>

      {/* HERO SECTION - LoveMemo Style */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Photo/Carousel */}
        <div className="absolute inset-0">
          <PhotoCarousel photos={page.photos || [page.photo_url || defaultPhotoUrl]} fallbackPhoto={defaultPhotoUrl} className="w-full h-full" interval={10000} />
          {/* Subtle dark overlay */}
          <div className="absolute inset-0 bg-black/30" />
          {/* Gradient fade at bottom for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Content overlay - centered at bottom */}
        <div className="absolute inset-0 flex flex-col justify-end pb-8 px-6">
          {/* Occasion/Event title */}
          {page.occasion && <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.5
        }} className="text-center text-white/80 text-sm md:text-base mb-2">
              {page.occasion}
            </motion.p>}

          {/* Names - Script Font */}
          <motion.h1 initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: 0.6
        }} className="text-5xl md:text-6xl lg:text-7xl text-white text-center mb-6" style={{
          fontFamily: 'var(--font-script)',
          textShadow: '0 2px 20px rgba(0,0,0,0.5)'
        }}>
            {displayTitle}
          </motion.h1>

          {/* TOGETHER FOR label */}
          <motion.p initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.7
        }} className="text-white/70 text-xs md:text-sm uppercase tracking-[0.3em] text-center font-medium mb-4">
            Juntos há
          </motion.p>

          {/* Time Cards Grid */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.8
        }} className="flex items-center justify-center gap-2 md:gap-3 mb-8">
            <TimeCard value={years} label="anos" />
            <TimeCard value={months} label="meses" />
            <TimeCard value={days} label="dias" />
            <TimeCard value={hours} label="horas" />
            <TimeCard value={minutes} label="min" />
            <TimeCard value={seconds} label="seg" />
          </motion.div>

          {/* Action buttons */}
          

          {/* Scroll indicator */}
          <motion.button initial={{
          opacity: 0
        }} animate={{
          opacity: 1,
          y: [0, 8, 0]
        }} transition={{
          opacity: {
            delay: 1
          },
          y: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }} onClick={scrollToActivities} className="flex flex-col items-center gap-1 text-white/50 hover:text-white/70 transition-colors mx-auto">
            <span className="text-xs uppercase tracking-wider">Atividades</span>
            <ChevronDown className="w-5 h-5" />
          </motion.button>
        </div>
      </section>

      {/* ACTIVITIES SECTION */}
      <section id="activities-section" className="min-h-screen bg-background py-8 px-6">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Section header */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Sugestão de hoje</span>
            </div>
          </motion.div>

          {/* Weekly Ritual Card */}
          <WeeklyRitualCard hasAccess={showWeeklyRitual} />

          {/* Activity card */}
          <motion.div key={currentActivity.id} initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} className="rounded-3xl bg-card border border-border/50 p-6 shadow-elevated">
            {/* Category and duration */}
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

            {/* Title */}
            <h3 className="text-2xl font-display font-bold text-foreground mb-3">
              {currentActivity.title}
            </h3>

            {/* Prompt */}
            <p className="text-muted-foreground leading-relaxed mb-6">
              {currentActivity.prompt}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button variant={isCompleted ? "default" : "neon"} size="lg" className="flex-1" onClick={handleComplete} disabled={isCompleted || !canDoActivity}>
                {!canDoActivity && !isCompleted ? <>
                    <Lock className="w-5 h-5 mr-2" />
                    Limite atingido
                  </> : <>
                    <Check className="w-5 h-5 mr-2" />
                    {isCompleted ? "Feito! ✓" : "Marcar como feito"}
                  </>}
              </Button>
              
              <Button variant="outline" size="icon" className="h-12 w-12" onClick={handleFavorite} disabled={!showFavorites} title={!showFavorites ? "Upgrade para usar favoritos" : undefined}>
                {!showFavorites ? <Lock className="w-5 h-5 text-muted-foreground" /> : <Heart className={`w-5 h-5 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`} />}
              </Button>

              <Button variant="outline" size="icon" className="h-12 w-12" onClick={handleRefresh} disabled={!canReroll} title={!canReroll ? "Limite de trocas atingido" : "Outra sugestão"}>
                {!canReroll ? <Lock className="w-5 h-5 text-muted-foreground" /> : <RefreshCw className="w-5 h-5" />}
              </Button>
            </div>

            {/* Plan status */}
            {(features.activitiesPerDay !== 'unlimited' || features.rerollsPerDay !== 'unlimited') && <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
                {features.activitiesPerDay !== 'unlimited' && <span>{remainingActivities}/{features.activitiesPerDay} atividades</span>}
                {features.rerollsPerDay !== 'unlimited' && <span>{remainingRerolls}/{features.rerollsPerDay} trocas</span>}
              </div>}
          </motion.div>

          {/* Completed counter */}
          {completedActivities.length > 0 && <motion.div initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} className="text-center">
              <p className="text-sm text-muted-foreground">
                <span className="text-primary font-bold">{completedActivities.length}</span> atividades feitas juntos
              </p>
            </motion.div>}

          {/* Favorites list */}
          {showFavorites && favorites.length > 0 && <motion.div initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} className="rounded-2xl bg-card border border-border/50 p-5">
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                Favoritas ({favorites.length}/{features.maxFavorites === 'unlimited' ? "∞" : features.maxFavorites})
              </h4>
              <div className="space-y-2">
                {favorites.map(id => {
              const activity = activitiesLibrary.find(a => a.id === id);
              if (!activity) return null;
              return <div key={id} className="flex items-center gap-2 text-sm text-foreground">
                      <span>{activity.emoji}</span>
                      <span>{activity.title}</span>
                    </div>;
            })}
              </div>
            </motion.div>}

          {/* Upgrade hint for basic plans */}
          {!showFavorites && <motion.div initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} className="rounded-2xl bg-muted/50 border border-border/50 p-4 text-center">
              <Lock className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Favoritos e histórico disponíveis nos planos Interativo e Premium
              </p>
            </motion.div>}

          {/* Surprise Letter - Replaces old message section */}
          <SurpriseLetter message={page.message} />

          {/* Premium: QR Code Card */}
          {page.plan === '29_90' && <QRCodeCard pageSlug={page.slug} name1={page.name1} name2={page.name2 || undefined} startDate={page.start_date} plan={page.plan} />}

          {/* Premium: Year Album */}
          {page.plan === '29_90' && <YearAlbum pageId={page.id} pageSlug={page.slug} plan={page.plan} />}

          {/* Branding footer */}
          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} className="text-center pt-8 pb-4">
            <p className="text-xs text-muted-foreground">
              Feito com 💕 no{" "}
              <a href="/" className="text-primary hover:underline">
                PraSempre
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>;
};
export default CouplePage;