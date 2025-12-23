import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Upload, Heart, Users, PawPrint, ArrowRight, Check, X } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeartInfinity from "@/components/HeartInfinity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCreatePage } from "@/hooks/useCreatePage";
import { PLAN_LIMITS, PlanId } from "@/lib/planLimits";

const formSchema = z.object({
  type: z.enum(["couple", "friends", "pet"]),
  name1: z.string().min(1, "Nome obrigatório").max(50, "Máximo 50 caracteres"),
  name2: z.string().max(50, "Máximo 50 caracteres").optional(),
  occasion: z.string().max(100, "Máximo 100 caracteres").optional(),
  startDate: z.date({ required_error: "Data obrigatória" }),
  message: z.string().min(1, "Mensagem obrigatória").max(300, "Máximo 300 caracteres"),
  plan: z.enum(["9_90", "19_90", "29_90"]),
});

type FormData = z.infer<typeof formSchema>;

const plans = [
  {
    id: "9_90" as const,
    name: "Presente",
    price: "9,90",
    description: "Perfeito para presentear",
  },
  {
    id: "19_90" as const,
    name: "Interativo",
    price: "19,90",
    description: "Para usar todo dia",
  },
  {
    id: "29_90" as const,
    name: "Premium",
    price: "29,90",
    description: "A melhor experiência",
    highlighted: true,
  },
];

const Criar = () => {
  const navigate = useNavigate();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const { createPage, isLoading } = useCreatePage();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "couple",
      plan: "29_90",
    },
  });

  const type = watch("type");
  const message = watch("message") || "";
  const selectedPlan = watch("plan");
  const startDate = watch("startDate");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Imagem muito grande. Máximo 5MB.");
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    toast.loading("Criando sua página...");

    const slug = await createPage({
      type: data.type,
      name1: data.name1,
      name2: data.name2,
      occasion: data.occasion,
      message: data.message,
      startDate: data.startDate,
      plan: data.plan,
      photoFile: photoFile || undefined,
    });

    toast.dismiss();

    if (slug) {
      toast.success("Página criada com sucesso!");
      navigate(`/sucesso?slug=${encodeURIComponent(slug)}`);
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case "couple": return "do casal";
      case "friends": return "da amizade";
      case "pet": return "do pet";
      default: return "do casal";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header variant="minimal" />

      <main className="container py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <HeartInfinity size="lg" className="mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-2">
              Criar página {getTypeLabel()}
            </h1>
            <p className="text-muted-foreground">
              Preencha os dados e escolha seu plano
            </p>
          </motion.div>

          {/* Type Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Tabs
              value={type}
              onValueChange={(v) => setValue("type", v as "couple" | "friends" | "pet")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 bg-card border border-border">
                <TabsTrigger value="couple" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">Casal</span>
                </TabsTrigger>
                <TabsTrigger value="friends" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Amigos</span>
                </TabsTrigger>
                <TabsTrigger value="pet" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <PawPrint className="w-4 h-4" />
                  <span className="hidden sm:inline">Pet</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Photo Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <Label className="text-base font-medium">Foto</Label>
              <div className="flex flex-col items-center gap-4">
                <label
                  htmlFor="photo"
                  className={cn(
                    "relative w-40 h-40 rounded-2xl cursor-pointer overflow-hidden transition-all",
                    "border-2 border-dashed border-border hover:border-primary",
                    "flex items-center justify-center bg-card",
                    photoPreview && "border-solid border-gold"
                  )}
                >
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        Clique para enviar
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    id="photo"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG ou WEBP. Máximo 5MB.
                </p>
              </div>
            </motion.div>

            {/* Names */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid gap-4 sm:grid-cols-2"
            >
              <div className="space-y-2">
                <Label htmlFor="name1">
                  {type === "pet" ? "Nome do pet" : "Primeiro nome"}
                </Label>
                <Input
                  id="name1"
                  placeholder={type === "pet" ? "Ex: Thor" : "Ex: Ana"}
                  className="input-romantic"
                  {...register("name1")}
                />
                {errors.name1 && (
                  <p className="text-sm text-destructive">{errors.name1.message}</p>
                )}
              </div>

              {type !== "pet" && (
                <div className="space-y-2">
                  <Label htmlFor="name2">Segundo nome</Label>
                  <Input
                    id="name2"
                    placeholder="Ex: João"
                    className="input-romantic"
                    {...register("name2")}
                  />
                  {errors.name2 && (
                    <p className="text-sm text-destructive">{errors.name2.message}</p>
                  )}
                </div>
              )}
            </motion.div>

            {/* Occasion (optional) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="space-y-2"
            >
              <Label htmlFor="occasion">Título/Ocasião (opcional)</Label>
              <Input
                id="occasion"
                placeholder="Ex: Nossa História de Amor, Dia dos Namorados"
                className="input-romantic"
                {...register("occasion")}
              />
            </motion.div>

            {/* Start Date */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <Label>
                {type === "pet" ? "Data da adoção" : "Data do início"}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal input-romantic",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setValue("startDate", date)}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate.message}</p>
              )}
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <Label htmlFor="message">Mensagem surpresa</Label>
                <span className={cn(
                  "text-xs",
                  message.length > 280 ? "text-destructive" : "text-muted-foreground"
                )}>
                  {message.length}/300
                </span>
              </div>
              <Textarea
                id="message"
                placeholder="Escreva uma mensagem especial que aparecerá quando tocarem em 'Abrir surpresa'..."
                className="input-romantic min-h-[100px] resize-none"
                {...register("message")}
              />
              {errors.message && (
                <p className="text-sm text-destructive">{errors.message.message}</p>
              )}
            </motion.div>

            {/* Plan Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <Label className="text-base font-medium">Escolha seu plano</Label>
              <div className="grid gap-3">
                {plans.map((plan) => {
                  const planLimits = PLAN_LIMITS[plan.id as PlanId];
                  return (
                    <label
                      key={plan.id}
                      className={cn(
                        "relative flex flex-col gap-3 p-4 rounded-xl cursor-pointer transition-all",
                        "border-2",
                        selectedPlan === plan.id
                          ? plan.highlighted
                            ? "border-gold bg-gold-light shadow-card"
                            : "border-primary bg-primary-light shadow-card"
                          : "border-border bg-card hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          value={plan.id}
                          className="hidden"
                          {...register("plan")}
                        />
                        
                        {/* Radio indicator */}
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                          selectedPlan === plan.id
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        )}>
                          {selectedPlan === plan.id && (
                            <Check className="w-3 h-3 text-primary-foreground" />
                          )}
                        </div>

                        {/* Plan info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{plan.name}</span>
                            {plan.highlighted && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-gold text-gold-foreground font-medium">
                                Mais escolhido
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{plan.description}</p>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground">R$</span>
                          <span className="text-2xl font-serif font-bold text-foreground">
                            {plan.price}
                          </span>
                        </div>
                      </div>

                      {/* Features list */}
                      {selectedPlan === plan.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-3 border-t border-border/50"
                        >
                          <ul className="grid grid-cols-2 gap-2">
                            {planLimits.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Check className="w-3 h-3 text-primary flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </label>
                  );
                })}
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="pt-4"
            >
              <Button 
                type="submit" 
                variant="neon" 
                size="xl" 
                className="w-full group"
                disabled={isLoading}
              >
                {isLoading ? "Criando..." : "Criar minha página"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                Ao continuar, você concorda com nossos{" "}
                <a href="/termos" className="underline hover:text-primary">
                  termos de uso
                </a>{" "}
                e{" "}
                <a href="/privacidade" className="underline hover:text-primary">
                  política de privacidade
                </a>.
              </p>
            </motion.div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Criar;
