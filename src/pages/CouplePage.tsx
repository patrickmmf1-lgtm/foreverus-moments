import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { differenceInDays, differenceInYears, differenceInMonths, differenceInHours, differenceInMinutes, differenceInSeconds, addYears, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Header from "@/components/Header";
import HeartInfinity from "@/components/HeartInfinity";
import { Button } from "@/components/ui/button";
import { Share2, Download, Smartphone, History, Heart, RefreshCw, Check, Clock, Sparkles } from "lucide-react";
import { toast } from "sonner";

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
};

const CouplePage = () => {
  const { slug } = useParams();
  const [now, setNow] = useState(new Date());
  const [currentActivity, setCurrentActivity] = useState(activitiesLibrary[0]);
  const [refreshCount, setRefreshCount] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

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

  // Activity history
  const activityHistory = useMemo(() => [
    { id: "h1", title: "Massagem relaxante", date: "Ontem", completed: true },
    { id: "h2", title: "Jantar a dois", date: "2 dias atrás", completed: true },
    { id: "h3", title: "Filme favorito", date: "3 dias atrás", completed: false },
  ], []);

  const handleRefresh = () => {
    const availableActivities = activitiesLibrary.filter(a => a.id !== currentActivity.id);
    const randomIndex = Math.floor(Math.random() * availableActivities.length);
    setCurrentActivity(availableActivities[randomIndex]);
    setRefreshCount(prev => prev + 1);
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

  const isCompleted = completedActivities.includes(currentActivity.id);
  const isFavorited = favorites.includes(currentActivity.id);

  return (
    <div className="min-h-screen bg-background">
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

      <Header variant="minimal" />

      <main className="container py-6 md:py-8">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Main couple card with gradient overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-primary opacity-90" />
            <div className="absolute inset-0 bg-gradient-radial opacity-30" />
            
            {/* Content */}
            <div className="relative p-6 md:p-8 text-center">
              {/* Photo placeholder */}
              <motion.div 
                className="w-28 h-28 md:w-32 md:h-32 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-xl"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-5xl">💑</span>
              </motion.div>

              {/* Names */}
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
                {demoPage.title}
              </h1>

              {/* Message */}
              <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6 max-w-sm mx-auto">
                {demoPage.message}
              </p>

              {/* Divider */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="flex-1 h-px bg-white/30" />
                <HeartInfinity size="sm" className="text-white" />
                <div className="flex-1 h-px bg-white/30" />
              </div>

              {/* Counter section */}
              <div className="space-y-4">
                <p className="text-white/70 text-xs uppercase tracking-widest font-medium">
                  Juntos há
                </p>
                
                {/* Main days count */}
                <motion.div
                  key={totalDays}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="flex items-baseline justify-center gap-2"
                >
                  <span className="text-6xl md:text-7xl font-display font-bold text-white">
                    {totalDays.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-xl text-white/80 font-medium">dias</span>
                </motion.div>

                {/* Detailed breakdown */}
                <div className="flex items-center justify-center gap-4 md:gap-6 text-white">
                  {years > 0 && (
                    <div className="text-center">
                      <span className="text-2xl md:text-3xl font-display font-bold">{years}</span>
                      <p className="text-xs text-white/70">{years === 1 ? "ano" : "anos"}</p>
                    </div>
                  )}
                  <div className="text-center">
                    <span className="text-2xl md:text-3xl font-display font-bold">{months}</span>
                    <p className="text-xs text-white/70">{months === 1 ? "mês" : "meses"}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl md:text-3xl font-display font-bold">{days}</span>
                    <p className="text-xs text-white/70">dias</p>
                  </div>
                </div>

                {/* Live clock */}
                <div className="flex items-center justify-center gap-2 text-white/60 text-sm font-mono">
                  <span>{String(hours).padStart(2, '0')}</span>
                  <span className="animate-pulse">:</span>
                  <span>{String(minutes).padStart(2, '0')}</span>
                  <span className="animate-pulse">:</span>
                  <span>{String(seconds).padStart(2, '0')}</span>
                </div>

                {/* Next milestone */}
                <div className="pt-4 border-t border-white/20">
                  <p className="text-sm text-white/70">
                    Próximo aniversário em{" "}
                    <span className="font-bold text-gold-light">{daysUntilAnniversary} dias</span>
                  </p>
                  <p className="text-xs text-white/50 mt-1">
                    {format(nextAnniversary, "d 'de' MMMM", { locale: ptBR })} • {differenceInYears(nextAnniversary, demoPage.startDate)} anos
                  </p>
                </div>
              </div>

              {/* Share button */}
              <div className="mt-6">
                <Button 
                  variant="glass" 
                  size="default" 
                  onClick={handleShare}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Activity section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Sugestão de hoje
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="text-muted-foreground"
              >
                <History className="w-4 h-4 mr-1" />
                Histórico
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {!showHistory ? (
                <motion.div
                  key={currentActivity.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="rounded-2xl bg-card border border-border/50 p-5 shadow-card"
                >
                  {/* Category badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/15 text-primary text-sm font-medium rounded-full">
                      <span>{currentActivity.emoji}</span>
                      {currentActivity.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {currentActivity.duration} min
                    </span>
                  </div>

                  {/* Title and prompt */}
                  <h3 className="text-xl font-display font-bold text-foreground mb-2">
                    {currentActivity.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-5">
                    {currentActivity.prompt}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant={isCompleted ? "default" : "neon"}
                      className="flex-1"
                      onClick={handleComplete}
                      disabled={isCompleted}
                    >
                      <Check className="w-4 h-4" />
                      {isCompleted ? "Feito! ✓" : "Marcar como feito"}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleFavorite}
                      className={isFavorited ? "text-rose bg-rose/20" : ""}
                    >
                      <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRefresh}
                      title="Gerar outra sugestão"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="rounded-2xl bg-card border border-border/50 p-5"
                >
                  <h3 className="font-display font-bold text-foreground mb-4">Atividades recentes</h3>
                  <div className="space-y-3">
                    {activityHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${item.completed ? 'bg-primary' : 'bg-muted'}`} />
                          <span className="text-sm text-foreground">{item.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => setShowHistory(false)}
                  >
                    Voltar para sugestão
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Premium PWA section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl bg-gradient-cta p-6 text-center"
          >
            <Smartphone className="w-12 h-12 mx-auto mb-3 text-primary-foreground/80" />
            <h3 className="font-display font-bold text-lg text-primary-foreground mb-2">
              App do casal
            </h3>
            <p className="text-sm text-primary-foreground/80 mb-4">
              Adicione esta página ao seu celular como um app exclusivo de vocês!
            </p>
            <Button variant="gold" size="default">
              <Download className="w-4 h-4" />
              Adicionar ao celular
            </Button>
          </motion.div>

          {/* Favorites indicator */}
          {favorites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-card border border-border/50 p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-rose/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-rose fill-rose" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Favoritos</p>
                <p className="text-xs text-muted-foreground">{favorites.length} atividade(s) salva(s)</p>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CouplePage;
