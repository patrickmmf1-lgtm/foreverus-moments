import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Counter from "@/components/Counter";
import ActivityCard from "@/components/ActivityCard";
import HeartInfinity from "@/components/HeartInfinity";
import { Button } from "@/components/ui/button";
import { Share2, Download, Smartphone, History, Heart } from "lucide-react";
import { toast } from "sonner";

// Demo data
const demoPage = {
  title: "Ana & João",
  name1: "Ana",
  name2: "João",
  message: "Você é meu melhor amigo, meu amor e minha pessoa favorita no mundo. Cada dia ao seu lado é uma aventura que eu escolho viver. Te amo infinitamente! 💕",
  startDate: new Date("2022-06-15"),
  plan: "29_90" as const,
  photoUrl: null,
};

const demoActivities = [
  {
    id: "1",
    title: "Carta do coração",
    prompt: "Escrevam uma carta curta um para o outro sobre algo que admiram no parceiro. Leiam em voz alta juntos.",
    category: "conversa",
    duration: 15,
    intensity: "leve" as const,
  },
  {
    id: "2",
    title: "Dança na sala",
    prompt: "Escolham 3 músicas especiais para vocês e dancem juntos na sala. Vale abraçar apertado!",
    category: "diversão",
    duration: 10,
    intensity: "leve" as const,
  },
  {
    id: "3",
    title: "Café da manhã surpresa",
    prompt: "Um de vocês prepara um café da manhã especial para o outro amanhã. Capriche nos detalhes!",
    category: "surpresa",
    duration: 30,
    intensity: "média" as const,
  },
];

const demoHistory = [
  { id: "h1", title: "Massagem relaxante", completed: true, date: "Ontem" },
  { id: "h2", title: "Jantar a dois", completed: true, date: "2 dias atrás" },
  { id: "h3", title: "Filme favorito", completed: false, date: "3 dias atrás" },
];

const CouplePage = () => {
  const { slug } = useParams();
  const [currentActivity, setCurrentActivity] = useState(demoActivities[0]);
  const [refreshCount, setRefreshCount] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Plan limits (demo is Premium)
  const planLimits = {
    "9_90": { maxRefreshes: 1, historyLimit: 3, canFavorite: false },
    "19_90": { maxRefreshes: 5, historyLimit: 10, canFavorite: true },
    "29_90": { maxRefreshes: Infinity, historyLimit: Infinity, canFavorite: true },
  };

  const limits = planLimits[demoPage.plan];

  const handleRefresh = () => {
    if (refreshCount < limits.maxRefreshes) {
      const nextIndex = (demoActivities.indexOf(currentActivity) + 1) % demoActivities.length;
      setCurrentActivity(demoActivities[nextIndex]);
      setRefreshCount((prev) => prev + 1);
      toast.success("Nova sugestão gerada!");
    } else {
      toast.error("Você atingiu o limite de sugestões por hoje.");
    }
  };

  const handleComplete = () => {
    toast.success("Atividade marcada como feita!", {
      description: "Continuem se escolhendo todo dia! 💕",
    });
  };

  const handleFavorite = () => {
    if (favorites.includes(currentActivity.id)) {
      setFavorites(favorites.filter((id) => id !== currentActivity.id));
      toast.info("Removido dos favoritos");
    } else {
      setFavorites([...favorites, currentActivity.id]);
      toast.success("Adicionado aos favoritos!");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: demoPage.title,
          text: `Veja nossa página do casal no ForeverUs!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header variant="minimal" />

      <main className="container py-8 pb-24">
        <div className="max-w-lg mx-auto space-y-8">
          {/* Photo & Names Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-3xl bg-card border border-border shadow-elevated p-6 text-center"
          >
            {/* Photo placeholder */}
            <div className="photo-frame w-32 h-32 mx-auto mb-6 bg-gradient-romantic flex items-center justify-center">
              <HeartInfinity size="xl" className="text-primary-foreground opacity-50" />
            </div>

            {/* Names */}
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
              {demoPage.title}
            </h1>

            {/* Message */}
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {demoPage.message}
            </p>

            {/* Divider with heart */}
            <div className="romantic-divider">
              <HeartInfinity size="sm" />
            </div>

            {/* Counter */}
            <Counter startDate={demoPage.startDate} />

            {/* Share button */}
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="soft" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
                Compartilhar
              </Button>
            </div>
          </motion.div>

          {/* Activity Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-semibold text-foreground">
                Sugestão de hoje
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
              >
                <History className="w-4 h-4 mr-1" />
                Histórico
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {!showHistory ? (
                <ActivityCard
                  key={currentActivity.id}
                  activity={currentActivity}
                  onRefresh={handleRefresh}
                  onComplete={handleComplete}
                  onFavorite={handleFavorite}
                  refreshCount={refreshCount}
                  maxRefreshes={limits.maxRefreshes === Infinity ? 999 : limits.maxRefreshes}
                  canFavorite={limits.canFavorite}
                  isFavorited={favorites.includes(currentActivity.id)}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="rounded-2xl bg-card border border-border p-4 space-y-3"
                >
                  <h3 className="font-medium text-foreground text-sm">Atividades recentes</h3>
                  {demoHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${item.completed ? 'bg-primary' : 'bg-muted'}`} />
                        <span className="text-sm text-foreground">{item.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowHistory(false)}
                  >
                    Voltar
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Premium: Install as PWA */}
          {demoPage.plan === "29_90" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl bg-gradient-wine p-6 text-primary-foreground text-center"
            >
              <Smartphone className="w-10 h-10 mx-auto mb-3 opacity-80" />
              <h3 className="font-serif font-semibold text-lg mb-2">
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
          )}

          {/* Favorites (if any) */}
          {favorites.length > 0 && limits.canFavorite && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl bg-card border border-border p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-4 h-4 text-primary fill-primary" />
                <h3 className="font-medium text-foreground text-sm">Favoritos</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {favorites.length} atividade(s) salva(s)
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CouplePage;