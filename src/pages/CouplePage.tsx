import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { differenceInDays, differenceInYears, differenceInMonths, differenceInHours, differenceInMinutes, differenceInSeconds, addYears, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Share2, Heart, RefreshCw, Check, Clock, Sparkles, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Demo activities library
const activitiesLibrary = [
  {
    id: "1",
    title: "Carta do coração",
    prompt: "Escrevam uma carta curta um para o outro sobre algo que admiram no parceiro. Leiam em voz alta juntos.",
    category: "conversa",
    emoji: "💬",
    duration: 15,
  },
  {
    id: "2",
    title: "Dança na sala",
    prompt: "Escolham 3 músicas especiais para vocês e dancem juntos na sala. Vale abraçar apertado!",
    category: "diversão",
    emoji: "💃",
    duration: 10,
  },
  {
    id: "3",
    title: "Café da manhã surpresa",
    prompt: "Um de vocês prepara um café da manhã especial para o outro amanhã. Capriche nos detalhes!",
    category: "surpresa",
    emoji: "🎁",
    duration: 30,
  },
  {
    id: "4",
    title: "Massagem relaxante",
    prompt: "Façam uma massagem de 10 minutos um no outro. Comecem pelos ombros e costas.",
    category: "carinho",
    emoji: "💆",
    duration: 20,
  },
  {
    id: "5",
    title: "Memórias fotográficas",
    prompt: "Olhem juntos fotos antigas do início do relacionamento e contem histórias sobre cada momento.",
    category: "conversa",
    emoji: "📸",
    duration: 15,
  },
  {
    id: "6",
    title: "Cozinhem juntos",
    prompt: "Escolham uma receita nova e cozinhem juntos. O resultado não importa, a diversão sim!",
    category: "encontro",
    emoji: "👩‍🍳",
    duration: 45,
  },
  {
    id: "7",
    title: "20 perguntas",
    prompt: "Façam 20 perguntas um ao outro que ainda não fizeram. Podem ser bobas ou profundas!",
    category: "conversa",
    emoji: "❓",
    duration: 20,
  },
  {
    id: "8",
    title: "Passeio sem rumo",
    prompt: "Saiam para caminhar sem destino definido. Conversem e descubram lugares novos juntos.",
    category: "encontro",
    emoji: "🚶",
    duration: 30,
  },
];

// Demo page data
const demoPage = {
  title: "Ana & João",
  name1: "Ana",
  name2: "João",
  message: "Você é meu melhor amigo, meu amor e minha pessoa favorita no mundo. Cada dia ao seu lado é uma aventura que eu escolho viver. Te amo infinitamente! 💕",
  startDate: new Date("2022-06-15"),
  plan: "29_90" as const,
  // Demo couple photo - using a gradient placeholder
  photoUrl: null,
};

const CouplePage = () => {
  const { slug } = useParams();
  const [now, setNow] = useState(new Date());
  const [currentActivity, setCurrentActivity] = useState(activitiesLibrary[0]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentSection, setCurrentSection] = useState<'hero' | 'activities'>('hero');

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate time differences
  const totalDays = differenceInDays(now, demoPage.startDate);
  const years = differenceInYears(now, demoPage.startDate);
  const months = differenceInMonths(now, demoPage.startDate) % 12;
  const days = Math.floor((totalDays % 365) % 30);
  const hours = differenceInHours(now, demoPage.startDate) % 24;
  const minutes = differenceInMinutes(now, demoPage.startDate) % 60;
  const seconds = differenceInSeconds(now, demoPage.startDate) % 60;

  // Next anniversary
  const thisYearAnniversary = new Date(now.getFullYear(), demoPage.startDate.getMonth(), demoPage.startDate.getDate());
  const nextAnniversary = thisYearAnniversary > now ? thisYearAnniversary : addYears(thisYearAnniversary, 1);
  const daysUntilAnniversary = differenceInDays(nextAnniversary, now);

  const handleRefresh = () => {
    const availableActivities = activitiesLibrary.filter(a => a.id !== currentActivity.id);
    const randomIndex = Math.floor(Math.random() * availableActivities.length);
    setCurrentActivity(availableActivities[randomIndex]);
    toast.success("Nova sugestão gerada!");
  };

  const handleComplete = () => {
    if (!completedActivities.includes(currentActivity.id)) {
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
      setFavorites([...favorites, currentActivity.id]);
      toast.success("Adicionado aos favoritos!");
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: demoPage.title,
          text: `Veja nossa página do casal no ForeverUs!`,
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

  const scrollToActivities = () => {
    setCurrentSection('activities');
    document.getElementById('activities-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const isCompleted = completedActivities.includes(currentActivity.id);
  const isFavorited = favorites.includes(currentActivity.id);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
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

      {/* HERO SECTION - Fullscreen Photo with Fade */}
      <section className="relative h-screen w-full overflow-hidden snap-start">
        {/* Background Photo/Gradient */}
        <div className="absolute inset-0">
          {/* Demo: Using a romantic gradient as placeholder for couple photo */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-900 via-purple-900 to-violet-950" />
          
          {/* Overlay pattern for texture */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
                               radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                               radial-gradient(circle at 50% 50%, rgba(244, 114, 182, 0.2) 0%, transparent 70%)`
            }}
          />
          
          {/* Floating hearts decoration */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white/10"
                style={{
                  left: `${10 + i * 12}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  fontSize: `${2 + (i % 3)}rem`
                }}
                animate={{
                  y: [-20, 20, -20],
                  rotate: [-5, 5, -5],
                  opacity: [0.05, 0.15, 0.05]
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5
                }}
              >
                ♥
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dark fade gradient from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        {/* Content overlay */}
        <div className="relative h-full flex flex-col justify-end pb-8 px-6">
          {/* Couple photo placeholder in circle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute top-12 left-1/2 -translate-x-1/2"
          >
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 p-1 shadow-2xl">
              <div className="w-full h-full rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                <span className="text-5xl">💑</span>
              </div>
            </div>
          </motion.div>

          {/* Names */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-display font-bold text-white text-center mb-6"
          >
            {demoPage.title}
          </motion.h1>

          {/* JUNTOS text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-rose-300 text-sm uppercase tracking-[0.3em] text-center font-medium mb-2"
          >
            Juntos
          </motion.p>

          {/* Giant counter - MAIN DAYS */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-4"
          >
            <div className="flex items-baseline justify-center gap-3">
              <motion.span
                key={totalDays}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-7xl md:text-8xl lg:text-9xl font-display font-bold text-white"
                style={{ textShadow: '0 0 60px rgba(236, 72, 153, 0.5)' }}
              >
                {totalDays.toLocaleString('pt-BR')}
              </motion.span>
              <span className="text-2xl md:text-3xl text-white/70 font-medium">dias</span>
            </div>
          </motion.div>

          {/* Breakdown: years, months, days */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-6 md:gap-8 mb-4"
          >
            {years > 0 && (
              <div className="text-center">
                <span className="text-3xl md:text-4xl font-display font-bold text-white">{years}</span>
                <p className="text-xs text-white/60 uppercase tracking-wider">{years === 1 ? "ano" : "anos"}</p>
              </div>
            )}
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <span className="text-3xl md:text-4xl font-display font-bold text-white">{months}</span>
              <p className="text-xs text-white/60 uppercase tracking-wider">{months === 1 ? "mês" : "meses"}</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <span className="text-3xl md:text-4xl font-display font-bold text-white">{days}</span>
              <p className="text-xs text-white/60 uppercase tracking-wider">dias</p>
            </div>
          </motion.div>

          {/* Live clock with pulsing animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-1 text-white/50 text-lg font-mono mb-6"
          >
            <span className="w-8 text-center">{String(hours).padStart(2, '0')}</span>
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              :
            </motion.span>
            <span className="w-8 text-center">{String(minutes).padStart(2, '0')}</span>
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              :
            </motion.span>
            <span className="w-8 text-center">{String(seconds).padStart(2, '0')}</span>
          </motion.div>

          {/* Next anniversary badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-2 mb-8"
          >
            <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <p className="text-sm text-white/80">
                <span className="text-rose-300 font-bold">{daysUntilAnniversary}</span> dias para {differenceInYears(nextAnniversary, demoPage.startDate)} anos juntos
              </p>
            </div>
          </motion.div>

          {/* Share button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex justify-center mb-6"
          >
            <Button
              variant="glass"
              size="lg"
              onClick={handleShare}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{ 
              opacity: { delay: 1 },
              y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
            onClick={scrollToActivities}
            className="flex flex-col items-center gap-1 text-white/40 hover:text-white/60 transition-colors mx-auto"
          >
            <span className="text-xs uppercase tracking-wider">Atividades</span>
            <ChevronDown className="w-5 h-5" />
          </motion.button>
        </div>
      </section>

      {/* ACTIVITIES SECTION */}
      <section 
        id="activities-section" 
        className="min-h-screen bg-background py-8 px-6 snap-start"
      >
        <div className="max-w-lg mx-auto space-y-6">
          {/* Section header */}
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

          {/* Activity card */}
          <motion.div
            key={currentActivity.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl bg-card border border-border/50 p-6 shadow-elevated"
          >
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
              <Button
                variant={isCompleted ? "default" : "neon"}
                size="lg"
                className="flex-1"
                onClick={handleComplete}
                disabled={isCompleted}
              >
                <Check className="w-5 h-5 mr-2" />
                {isCompleted ? "Feito! ✓" : "Marcar como feito"}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12"
                onClick={handleFavorite}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`} />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12"
                onClick={handleRefresh}
                title="Outra sugestão"
              >
                <RefreshCw className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          {/* Completed counter */}
          {completedActivities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-sm text-muted-foreground">
                <span className="text-primary font-bold">{completedActivities.length}</span> atividades feitas juntos
              </p>
            </motion.div>
          )}

          {/* Favorites list */}
          {favorites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-card border border-border/50 p-5"
            >
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                Favoritas
              </h4>
              <div className="space-y-2">
                {favorites.map(id => {
                  const activity = activitiesLibrary.find(a => a.id === id);
                  if (!activity) return null;
                  return (
                    <div key={id} className="flex items-center gap-2 text-sm text-foreground">
                      <span>{activity.emoji}</span>
                      <span>{activity.title}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Message section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-gradient-to-br from-rose-500/10 to-purple-500/10 border border-primary/20 p-6 text-center"
          >
            <p className="text-foreground/80 leading-relaxed italic">
              "{demoPage.message}"
            </p>
            <p className="text-sm text-muted-foreground mt-3">— {demoPage.name1} para {demoPage.name2}</p>
          </motion.div>

          {/* Footer branding */}
          <div className="text-center py-6">
            <p className="text-xs text-muted-foreground">
              Feito com 💕 no <span className="text-primary font-medium">ForeverUs</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CouplePage;
