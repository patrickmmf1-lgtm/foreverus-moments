import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlanCard from "@/components/PlanCard";
import Testimonial from "@/components/Testimonial";
import FAQ from "@/components/FAQ";
import HeartInfinity from "@/components/HeartInfinity";
import Counter from "@/components/Counter";
import { Camera, Heart, Sparkles, Calendar, Gift, Smartphone, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Presente",
    price: "9,90",
    description: "Perfeito para presentear",
    icon: <Gift className="w-6 h-6" />,
    features: [
      { text: "Página ativa para sempre", included: true },
      { text: "Contador de dias juntos", included: true },
      { text: "1 foto + mensagem", included: true },
      { text: "1 atividade por dia", included: true },
      { text: "Gerar outra sugestão (1x/dia)", included: true },
      { text: "Histórico de atividades", included: false },
      { text: "Favoritos", included: false },
      { text: "Ritual da semana", included: false },
      { text: "App do casal (PWA)", included: false },
    ],
  },
  {
    name: "Interativo",
    price: "19,90",
    description: "Para usar todo dia",
    icon: <Heart className="w-6 h-6" />,
    features: [
      { text: "Página ativa para sempre", included: true },
      { text: "Contador de dias juntos", included: true },
      { text: "1 foto + mensagem", included: true },
      { text: "Até 3 atividades por dia", included: true },
      { text: "Gerar outra sugestão (5x/dia)", included: true },
      { text: "Histórico dos últimos 10 itens", included: true },
      { text: "1 favorito por dia", included: true },
      { text: "Ritual da semana", included: false },
      { text: "App do casal (PWA)", included: false },
    ],
  },
  {
    name: "Premium",
    price: "29,90",
    description: "A melhor experiência",
    icon: <Sparkles className="w-6 h-6" />,
    highlighted: true,
    badge: "Mais escolhido",
    features: [
      { text: "Página ativa para sempre", included: true },
      { text: "Contador de dias juntos", included: true },
      { text: "1 foto + mensagem", included: true },
      { text: "Atividades ilimitadas", included: true },
      { text: "Gerar outra sem limites", included: true },
      { text: "Histórico completo", included: true },
      { text: "Favoritos ilimitados", included: true },
      { text: "Ritual da semana destacado", included: true },
      { text: "App do casal personalizado", included: true },
    ],
  },
];

const testimonials = [
  {
    name: "Maria e Pedro",
    relationship: "Namorados",
    days: 847,
    quote: "Usamos as atividades toda semana! É como ter uma lista infinita de ideias para nossos encontros.",
  },
  {
    name: "Juliana e Lucas",
    relationship: "Casados",
    days: 2190,
    quote: "Demos de presente no nosso aniversário de namoro. Agora virou tradição abrir juntos toda manhã.",
  },
  {
    name: "Ana e João",
    relationship: "Namorados",
    days: 365,
    quote: "O contador é emocionante! A cada marco, comemoramos. Já passamos dos 1 ano juntos!",
  },
  {
    name: "Carla e Bruno",
    relationship: "Noivos",
    days: 1460,
    quote: "O ritual da semana virou nossa tradição de segunda-feira. Começamos a semana mais conectados.",
  },
  {
    name: "Fernanda e Rafael",
    relationship: "Casados",
    days: 3650,
    quote: "10 anos juntos e ainda descobrimos coisas novas um do outro com as atividades. Incrível!",
  },
  {
    name: "Camila e Thiago",
    relationship: "Namorados",
    days: 520,
    quote: "Instalamos no celular como app. Abrimos todo dia pra ver o contador e a sugestão do dia.",
  },
];

const steps = [
  {
    icon: <Camera className="w-8 h-8" />,
    title: "Crie sua página",
    description: "Escolha uma foto especial, escreva uma mensagem e defina a data do relacionamento.",
  },
  {
    icon: <Calendar className="w-8 h-8" />,
    title: "Veja o contador",
    description: "Acompanhe quantos dias, meses e anos estão juntos. Cada dia é uma conquista!",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Use as atividades",
    description: "Todo dia uma nova sugestão para vocês fazerem juntos. Se escolham, sempre.",
  },
];

const Index = () => {
  const navigate = useNavigate();
  
  // Example date for demo counter
  const demoDate = new Date();
  demoDate.setFullYear(demoDate.getFullYear() - 2);
  demoDate.setMonth(demoDate.getMonth() - 3);
  demoDate.setDate(demoDate.getDate() - 15);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-pattern-dots opacity-30" />
        
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light text-primary text-sm font-medium">
                <HeartInfinity size="sm" animate />
                <span>Para casais que se escolhem todo dia</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight">
                Uma página só de vocês,{" "}
                <span className="text-gradient-wine">para sempre</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Crie uma página romântica com contador de tempo juntos e 
                sugestões de atividades para fazer a dois. O presente digital 
                perfeito para o seu amor.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button 
                variant="hero" 
                size="xl" 
                onClick={() => navigate("/criar")}
                className="group"
              >
                Criar minha página
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="hero-outline" 
                size="xl"
                onClick={() => navigate("/p/demo")}
              >
                Ver exemplo
              </Button>
            </motion.div>

            {/* Mini demo counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-8"
            >
              <div className="inline-block p-6 md:p-8 rounded-2xl bg-card border border-border shadow-elevated">
                <Counter startDate={demoDate} showNextMilestone={false} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-16 md:py-24 bg-card/50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
              Como funciona
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Em poucos minutos você cria a página do casal e já pode compartilhar
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center space-y-4"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground shadow-soft">
                  {step.icon}
                </div>
                <div className="relative">
                  <span className="absolute -top-8 -left-2 text-6xl font-serif font-bold text-primary/10">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-serif font-semibold text-foreground relative">
                    {step.title}
                  </h3>
                </div>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="planos" className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
              Escolha seu plano
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Pagamento único, página ativa para sempre. Sem assinatura.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-4 max-w-5xl mx-auto items-start">
            {plans.map((plan, index) => (
              <PlanCard
                key={index}
                {...plan}
                onSelect={() => navigate("/criar")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
              Casais que se escolhem
            </h2>
            <p className="text-muted-foreground">
              Veja o que os casais estão dizendo sobre o ForeverUs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Testimonial key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-wine text-primary-foreground">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center space-y-6"
          >
            <HeartInfinity size="xl" className="mx-auto opacity-80" />
            <h2 className="text-3xl md:text-4xl font-serif font-semibold">
              Comece a se escolher todo dia
            </h2>
            <p className="text-primary-foreground/80">
              Crie a página do seu casal agora e surpreenda quem você ama 
              com um presente que dura para sempre.
            </p>
            <Button
              variant="gold"
              size="xl"
              onClick={() => navigate("/criar")}
              className="group"
            >
              Criar minha página
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;