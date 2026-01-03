import { motion } from "framer-motion";
import { Sparkles, Lock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Weekly questions/challenges - rotate based on week of year
const weeklyRituals = [
  {
    type: "pergunta",
    title: "Pergunta Profunda",
    content: "Qual foi o momento em que você se sentiu mais amado(a) esta semana?",
  },
  {
    type: "desafio",
    title: "Desafio da Semana",
    content: "Preparem uma refeição juntos sem usar o celular. Conversem sobre seus sonhos.",
  },
  {
    type: "pergunta",
    title: "Pergunta Profunda",
    content: "Se pudéssemos reviver um dia juntos, qual seria e por quê?",
  },
  {
    type: "desafio",
    title: "Desafio da Semana",
    content: "Escrevam 3 coisas que admiram um no outro e compartilhem em voz alta.",
  },
  {
    type: "pergunta",
    title: "Pergunta Profunda",
    content: "O que vocês mais querem realizar juntos nos próximos 5 anos?",
  },
  {
    type: "desafio",
    title: "Desafio da Semana",
    content: "Planejem uma mini-aventura para o próximo fim de semana, mesmo que simples.",
  },
  {
    type: "pergunta",
    title: "Pergunta Profunda",
    content: "Qual característica do outro você gostaria de ter?",
  },
  {
    type: "desafio",
    title: "Desafio da Semana",
    content: "Surpreendam um ao outro com uma mensagem de carinho durante o dia.",
  },
  {
    type: "pergunta",
    title: "Pergunta Profunda",
    content: "Qual foi o obstáculo que vocês superaram juntos que mais os fortaleceu?",
  },
  {
    type: "desafio",
    title: "Desafio da Semana",
    content: "Tirem uma foto juntos que represente este momento da vida de vocês.",
  },
  {
    type: "pergunta",
    title: "Pergunta Profunda",
    content: "O que te faz sorrir quando pensa no outro?",
  },
  {
    type: "desafio",
    title: "Desafio da Semana",
    content: "Assistam ao pôr do sol ou nascer do sol juntos esta semana.",
  },
];

function getWeekOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.floor(diff / oneWeek);
}

interface WeeklyRitualCardProps {
  hasAccess: boolean;
}

const WeeklyRitualCard = ({ hasAccess }: WeeklyRitualCardProps) => {
  const weekIndex = getWeekOfYear() % weeklyRituals.length;
  const ritual = weeklyRituals[weekIndex];

  const handleUpgradeClick = () => {
    toast.info("Faça upgrade para Premium!", {
      description: "O Ritual da Semana está disponível apenas no plano Premium.",
      duration: 5000,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative rounded-3xl overflow-hidden"
    >
      {/* Card content */}
      <div
        className={`rounded-3xl bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-transparent border-2 border-amber-500/30 p-6 ${
          !hasAccess ? "blur-[6px]" : ""
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-500/80 font-medium">
              {ritual.type === "pergunta" ? "Pergunta da Semana" : "Desafio Semanal"}
            </span>
            <h3 className="text-lg font-display font-bold text-foreground">
              {ritual.title}
            </h3>
          </div>
        </div>

        {/* Content */}
        <p className="text-foreground/90 leading-relaxed text-base">
          "{ritual.content}"
        </p>

        {/* Decorative element */}
        <div className="absolute top-4 right-4 opacity-10">
          <Sparkles className="w-16 h-16 text-amber-500" />
        </div>
      </div>

      {/* Locked overlay */}
      {!hasAccess && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm rounded-3xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center mb-3"
          >
            <Lock className="w-7 h-7 text-amber-500" />
          </motion.div>
          <p className="text-sm text-muted-foreground mb-3 text-center px-4">
            Ritual da Semana exclusivo para Premium
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUpgradeClick}
            className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
          >
            <Crown className="w-4 h-4 mr-2" />
            Desbloquear com Premium
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default WeeklyRitualCard;
