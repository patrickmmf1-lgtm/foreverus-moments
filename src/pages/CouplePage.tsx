import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { differenceInDays, differenceInYears, differenceInMonths, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";
import { Share2, Heart, RefreshCw, Check, Clock, Sparkles, ChevronDown, Gift, Volume2, VolumeX } from "lucide-react";
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
  occasion: "Nossa História de Amor",
  message: "Você é meu melhor amigo, meu amor e minha pessoa favorita no mundo. Cada dia ao seu lado é uma aventura que eu escolho viver. Te amo infinitamente! 💕",
  startDate: new Date("2022-06-15"),
  plan: "29_90" as const,
  photoUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80",
};

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

const CouplePage = () => {
  const { slug } = useParams();
  const [now, setNow] = useState(new Date());
  const [currentActivity, setCurrentActivity] = useState(activitiesLibrary[0]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate time differences
  const years = differenceInYears(now, demoPage.startDate);
  const months = differenceInMonths(now, demoPage.startDate) % 12;
  const totalDays = differenceInDays(now, demoPage.startDate);
  const days = Math.floor((totalDays % 365) % 30);
  const hours = differenceInHours(now, demoPage.startDate) % 24;
  const minutes = differenceInMinutes(now, demoPage.startDate) % 60;
  const seconds = differenceInSeconds(now, demoPage.startDate) % 60;

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

  const handleOpenSurprise = () => {
    setShowSurprise(true);
    setShowConfetti(true);
    toast.success("🎁 Surpresa aberta!", {
      description: demoPage.message,
    });
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const scrollToActivities = () => {
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

      {/* HERO SECTION - LoveMemo Style */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Photo */}
        <div className="absolute inset-0">
          <img
            src={demoPage.photoUrl}
            alt="Foto do casal"
            className="w-full h-full object-cover"
          />
          {/* Subtle dark overlay */}
          <div className="absolute inset-0 bg-black/30" />
          {/* Gradient fade at bottom for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Top Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
          {/* Tap to open surprise */}
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

          {/* Sound toggle */}
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

        {/* Content overlay - centered at bottom */}
        <div className="absolute inset-0 flex flex-col justify-end pb-8 px-6">
          {/* Occasion/Event title */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center text-white/80 text-sm md:text-base mb-2"
          >
            {demoPage.occasion}
          </motion.p>

          {/* Couple Names - Script Font */}
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
            {demoPage.name1} & {demoPage.name2}
          </motion.h1>

          {/* TOGETHER FOR label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white/70 text-xs md:text-sm uppercase tracking-[0.3em] text-center font-medium mb-4"
          >
            Juntos há
          </motion.p>

          {/* Time Cards Grid */}
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

          {/* Action buttons */}
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

          {/* Scroll indicator */}
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
