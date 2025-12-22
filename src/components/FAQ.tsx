import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "Como funciona o pagamento?",
    answer: "O pagamento é único e vitalício. Você paga uma vez e a página do seu casal fica ativa para sempre. Aceitamos cartão de crédito e débito via Stripe. Em breve teremos Pix!",
  },
  {
    question: "Posso editar a página depois de criar?",
    answer: "Sim! Ao criar sua página, você receberá um link de edição por e-mail. Com ele, pode alterar foto, mensagem, data e nomes quando quiser.",
  },
  {
    question: "Como funcionam as atividades?",
    answer: "Todo dia sua página mostra uma sugestão de atividade para vocês fazerem juntos. São mais de 60 atividades românticas, divertidas e carinhosas. Dependendo do plano, você pode gerar mais sugestões e salvar favoritas.",
  },
  {
    question: "Posso usar para amigos ou pets?",
    answer: "Com certeza! Apesar do foco ser em casais, você pode criar páginas para amizades à distância ou para celebrar a adoção do seu pet. A mecânica é a mesma: contador de tempo + atividades (adaptadas).",
  },
  {
    question: "A página é pública?",
    answer: "A página só é acessível por quem tem o link ou QR Code. Não indexamos as páginas em buscadores e os links são gerados com códigos únicos.",
  },
  {
    question: "O que é o 'Ritual da semana' do Premium?",
    answer: "É uma atividade especial que aparece destacada toda semana. São rituais pensados para criar momentos únicos e constantes no relacionamento.",
  },
  {
    question: "Como funciona o app do casal (Premium)?",
    answer: "No plano Premium, você pode instalar a página como um aplicativo no celular. Ele abre direto na página do casal, com ícone personalizado com a foto de vocês. É como ter um app só de vocês!",
  },
  {
    question: "Posso cancelar ou pedir reembolso?",
    answer: "Como o pagamento é único e a página é criada instantaneamente, não oferecemos reembolso. Mas garantimos suporte para qualquer problema técnico.",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
            Perguntas frequentes
          </h2>
          <p className="text-muted-foreground">
            Tudo o que você precisa saber sobre o ForeverUs
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-xl px-6 bg-card shadow-soft"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
