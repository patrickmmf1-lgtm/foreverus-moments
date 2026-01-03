import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlanCard from "@/components/PlanCard";
import Testimonial from "@/components/Testimonial";
import FAQ from "@/components/FAQ";
import HeartInfinity from "@/components/HeartInfinity";
import PhoneMockup from "@/components/PhoneMockup";
import { Heart, Sparkles, Gift, ArrowRight, CreditCard, Mail, PartyPopper, FileText } from "lucide-react";
const plans = [{
  name: "Presente",
  price: "9,90",
  description: "Perfeito para presentear",
  icon: <Gift className="w-6 h-6" />,
  features: [{
    text: "Página ativa para sempre",
    included: true
  }, {
    text: "Contador de dias juntos",
    included: true
  }, {
    text: "1 foto + mensagem",
    included: true
  }, {
    text: "1 atividade por dia",
    included: true
  }, {
    text: "Gerar outra sugestão (1x/dia)",
    included: true
  }, {
    text: "Histórico de atividades",
    included: false
  }, {
    text: "Favoritos",
    included: false
  }, {
    text: "Ritual da semana",
    included: false
  }, {
    text: "App do casal (PWA)",
    included: false
  }]
}, {
  name: "Interativo",
  price: "19,90",
  description: "Para usar todo dia",
  icon: <Heart className="w-6 h-6" />,
  badge: "Mais popular",
  badgeType: "popular" as const,
  features: [{
    text: "Página ativa para sempre",
    included: true
  }, {
    text: "Contador de dias juntos",
    included: true
  }, {
    text: "1 foto + mensagem",
    included: true
  }, {
    text: "Até 3 atividades por dia",
    included: true
  }, {
    text: "Gerar outra sugestão (5x/dia)",
    included: true
  }, {
    text: "Histórico dos últimos 10 itens",
    included: true
  }, {
    text: "1 favorito por dia",
    included: true
  }, {
    text: "Ritual da semana",
    included: false
  }, {
    text: "App do casal (PWA)",
    included: false
  }]
}, {
  name: "Premium",
  price: "29,90",
  description: "A melhor experiência",
  icon: <Sparkles className="w-6 h-6" />,
  highlighted: true,
  badge: "Melhor custo-benefício",
  badgeType: "premium" as const,
  features: [{
    text: "Página ativa para sempre",
    included: true
  }, {
    text: "Contador de dias juntos",
    included: true
  }, {
    text: "1 foto + mensagem",
    included: true
  }, {
    text: "Atividades ilimitadas",
    included: true
  }, {
    text: "Gerar outra sem limites",
    included: true
  }, {
    text: "Histórico completo",
    included: true
  }, {
    text: "Favoritos ilimitados",
    included: true
  }, {
    text: "Ritual da semana destacado",
    included: true
  }, {
    text: "App do casal personalizado",
    included: true
  }]
}];
const testimonials = [{
  name: "Maria e Pedro",
  relationship: "Namorados",
  days: 847,
  quote: "Usamos as atividades toda semana! É como ter uma lista infinita de ideias para nossos encontros."
}, {
  name: "Juliana e Lucas",
  relationship: "Casados",
  days: 2190,
  quote: "Demos de presente no nosso aniversário de namoro. Agora virou tradição abrir juntos toda manhã."
}, {
  name: "Ana e João",
  relationship: "Namorados",
  days: 365,
  quote: "O contador é emocionante! A cada marco, comemoramos. Já passamos dos 1 ano juntos!"
}, {
  name: "Carla e Bruno",
  relationship: "Noivos",
  days: 1460,
  quote: "O ritual da semana virou nossa tradição de segunda-feira. Começamos a semana mais conectados."
}, {
  name: "Fernanda e Rafael",
  relationship: "Casados",
  days: 3650,
  quote: "10 anos juntos e ainda descobrimos coisas novas um do outro com as atividades. Incrível!"
}, {
  name: "Camila e Thiago",
  relationship: "Namorados",
  days: 520,
  quote: "Instalamos no celular como app. Abrimos todo dia pra ver o contador e a sugestão do dia."
}];
const Index = () => {
  const navigate = useNavigate();

  // Check if user installed PWA with a saved couple page - redirect them
  useEffect(() => {
    const savedSlug = localStorage.getItem("foreverus_couple_slug");
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true;

    // Only redirect if in standalone mode (PWA) and has saved slug
    if (isStandalone && savedSlug) {
      navigate(`/p/${savedSlug}`, {
        replace: true
      });
    }
  }, [navigate]);
  return <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-radial-top" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => <motion.div key={i} className="absolute w-2 h-2 rounded-full bg-primary/30" style={{
          left: `${15 + i * 15}%`,
          top: `${20 + i % 3 * 25}%`
        }} animate={{
          y: [-20, 20, -20],
          opacity: [0.3, 0.6, 0.3]
        }} transition={{
          duration: 4 + i,
          repeat: Infinity,
          ease: "easeInOut"
        }} />)}
        </div>
        
        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Text content */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} className="text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30 text-primary text-sm font-medium">
                <HeartInfinity size="sm" animate glow />
                <span>Para casais que se escolhem todo dia</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
                Um presente que celebra o seu amor{" "}
                <span className="text-gradient-primary">para sempre</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Crie uma página inesquecível com contador de tempo e atividades 
                para viver juntos eternamente.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Button variant="neon" size="xl" onClick={() => navigate("/criar")} className="group w-full sm:w-auto">
                  Criar minha página agora
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="glass" size="xl" onClick={() => navigate("/demo")} className="w-full sm:w-auto">
                  Ver exemplo
                </Button>
              </div>
            </motion.div>

            {/* Phone mockup with demo */}
            <motion.div initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 0.8,
            delay: 0.2
          }} className="flex justify-center lg:justify-end">
              <PhoneMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works - Visual cards */}
      <section id="como-funciona" className="py-16 md:py-24 bg-gradient-dark-section">
        <div className="container">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            {/* Title column */}
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} className="lg:col-span-1 space-y-4">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight">
                Como<br />fazer?
              </h2>
              <HeartInfinity size="lg" glow className="hidden lg:block mt-4" />
            </motion.div>

            {/* Steps grid */}
            <div className="lg:col-span-4 grid md:grid-cols-2 gap-4 md:gap-6">
              {/* Step 1 - Preencha os dados */}
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.1
            }} className="step-card group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-foreground">
                    1. Preencha os dados
                  </h3>
                </div>
                {/* Mini form preview */}
                <div className="bg-background/50 rounded-xl p-4 space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1 h-8 rounded-lg bg-card border border-border flex items-center px-3">
                      <span className="text-xs text-muted-foreground">André e Carol</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-8 rounded-lg bg-card border border-border flex items-center px-3">
                      <span className="text-xs text-muted-foreground">dd/mm/aaaa</span>
                    </div>
                    <div className="w-20 h-8 rounded-lg bg-card border border-border flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">--:--</span>
                    </div>
                  </div>
                  <div className="h-16 rounded-lg bg-card border border-border flex items-start p-3">
                    <span className="text-xs text-muted-foreground">Escreva sua mensagem aqui. Capricha hein! 💕</span>
                  </div>
                </div>
              </motion.div>

              {/* Step 2 - Faça o pagamento */}
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.2
            }} className="step-card group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center text-gold-foreground">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-foreground">
                    2. Faça o pagamento
                  </h3>
                </div>
                {/* Payment visual */}
                <div className="flex items-center justify-center py-8">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-gold flex items-center justify-center shadow-glow">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground font-bold">
                      ✓
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Pagamento único e seguro via Stripe
                </p>
              </motion.div>

              {/* Step 3 - Receba o site + QR Code */}
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.3
            }} className="step-card group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-foreground">3. Receba o seu site + QR Code na hora</h3>
                </div>
                {/* Email visual */}
                <div className="flex items-center justify-center py-6">
                  <div className="relative">
                    {/* Phone with notification */}
                    <div className="w-24 h-40 rounded-2xl bg-card border-2 border-border shadow-elevated overflow-hidden">
                      <div className="h-6 bg-background flex items-center justify-center">
                        <div className="w-12 h-1.5 rounded-full bg-border" />
                      </div>
                      <div className="p-2">
                        <div className="bg-primary/20 rounded-lg p-2 flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-rose flex items-center justify-center text-xs">📧</div>
                          <div className="flex-1">
                            <p className="text-[8px] font-medium text-foreground">Seu site está pronto!</p>
                            <p className="text-[6px] text-muted-foreground">Agora mesmo</p>
                          </div>
                        </div>
                      </div>
                      {/* QR Code mock */}
                      <div className="flex justify-center mt-2">
                        <div className="w-12 h-12 bg-background rounded-lg border border-border grid grid-cols-3 gap-0.5 p-1">
                          {[...Array(9)].map((_, i) => <div key={i} className={`rounded-sm ${i % 2 === 0 ? 'bg-foreground' : 'bg-transparent'}`} />)}
                        </div>
                      </div>
                    </div>
                    {/* Floating hearts */}
                    <motion.div className="absolute -right-4 -top-2" animate={{
                    y: [-5, 5, -5],
                    rotate: [0, 10, 0]
                  }} transition={{
                    duration: 3,
                    repeat: Infinity
                  }}>
                      <span className="text-2xl">💕</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Step 4 - Surpreenda seu amor */}
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.4
            }} className="step-card group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-romantic flex items-center justify-center text-primary-foreground">
                    <PartyPopper className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-foreground">
                    4. Surpreenda seu amor
                  </h3>
                </div>
                {/* Final result preview */}
                <div className="flex items-center justify-center py-4">
                  <div className="relative">
                    {/* Phone with couple page */}
                    <div className="w-24 h-40 rounded-2xl bg-gradient-primary border-2 border-primary/50 shadow-neon overflow-hidden">
                      <div className="h-full flex flex-col items-center justify-center p-2">
                        <div className="w-10 h-10 rounded-full bg-background/30 flex items-center justify-center mb-2">
                          <span className="text-lg">💑</span>
                        </div>
                        <p className="text-[8px] text-primary-foreground font-bold text-center">Ana & João</p>
                        <p className="text-[10px] text-primary-foreground/80 font-bold mt-1">847 dias</p>
                        <p className="text-[6px] text-primary-foreground/60">2 anos, 3 meses</p>
                      </div>
                    </div>
                    {/* Floating hearts */}
                    <motion.div className="absolute -left-3 top-4" animate={{
                    y: [-5, 5, -5]
                  }} transition={{
                    duration: 2,
                    repeat: Infinity
                  }}>
                      <span className="text-xl">💖</span>
                    </motion.div>
                    <motion.div className="absolute -right-3 bottom-8" animate={{
                    y: [5, -5, 5]
                  }} transition={{
                    duration: 2.5,
                    repeat: Infinity
                  }}>
                      <span className="text-lg">💕</span>
                    </motion.div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Um presente único e emocionante!
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="planos" className="py-16 md:py-24">
        <div className="container">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Escolha seu plano
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Pagamento único, página ativa para sempre. Sem assinatura.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-4 max-w-5xl mx-auto items-start">
            {plans.map((plan, index) => <PlanCard key={index} {...plan} onSelect={() => navigate("/criar")} />)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="py-16 md:py-24 bg-gradient-dark-section">
        <div className="container">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Casais que eternizaram seu amor
            </h2>
            <p className="text-muted-foreground">
              Veja o que estão dizendo sobre o ForeverUs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => <Testimonial key={index} {...testimonial} />)}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-cta relative overflow-hidden">
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => <motion.div key={i} className="absolute text-2xl" style={{
          left: `${10 + i * 12}%`,
          top: `${20 + i % 3 * 30}%`
        }} animate={{
          y: [-10, 10, -10],
          rotate: [-5, 5, -5]
        }} transition={{
          duration: 3 + i * 0.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}>
              {i % 2 === 0 ? "💖" : "✨"}
            </motion.div>)}
        </div>

        <div className="container relative">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="max-w-2xl mx-auto text-center space-y-6">
            <HeartInfinity size="xl" className="mx-auto" glow />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground">
              Comece a eternizar a sua história hoje
            </h2>
            <p className="text-primary-foreground/80 text-lg">
              Crie a página do seu casal agora e surpreenda quem você ama 
              com um presente que dura para sempre.
            </p>
            <Button variant="gold" size="xl" onClick={() => navigate("/criar")} className="group">
              Criar minha página
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Index;