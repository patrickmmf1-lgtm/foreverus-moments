import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Heart, Users, PawPrint, ArrowRight, Check, AlertTriangle } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeartInfinity from "@/components/HeartInfinity";
import { PhotoSlot } from "@/components/PhotoSlot";
import { PlanBenefitsBanner } from "@/components/PlanBenefitsBanner";
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

interface PhotoData {
  file: File;
  preview: string;
}

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
  const [photos, setPhotos] = useState<(PhotoData | null)[]>([null]);
  const [previousPlan, setPreviousPlan] = useState<PlanId | undefined>();
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
  const selectedPlan = watch("plan") as PlanId;
  const startDate = watch("startDate");

  const currentPlanLimits = PLAN_LIMITS[selectedPlan];

  // Adjust photo slots when plan changes
  useEffect(() => {
    const maxPhotos = currentPlanLimits.maxPhotos;
    
    setPhotos(prev => {
      // If new plan has fewer photos, trim and warn
      if (prev.length > maxPhotos) {
        const removedCount = prev.filter((p, i) => p !== null && i >= maxPhotos).length;
        if (removedCount > 0) {
          toast.warning(`${removedCount} foto(s) removida(s)`, {
            description: `O plano ${currentPlanLimits.name} permite até ${maxPhotos} foto(s).`,
          });
        }
        return prev.slice(0, maxPhotos);
      }
      
      // If new plan has more photos, add empty slots
      if (prev.length < maxPhotos) {
        const newSlots = [...prev];
        while (newSlots.length < maxPhotos) {
          newSlots.push(null);
        }
        return newSlots;
      }
      
      return prev;
    });
  }, [selectedPlan, currentPlanLimits.maxPhotos, currentPlanLimits.name]);

  const handlePhotoUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotos(prev => {
        const updated = [...prev];
        updated[index] = { file, preview: reader.result as string };
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoRemove = (index: number) => {
    setPhotos(prev => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });
  };

  const handlePlanChange = (planId: PlanId) => {
    setPreviousPlan(selectedPlan);
    setValue("plan", planId);
  };

  const onSubmit = async (data: FormData) => {
    const photoFiles = photos.filter((p): p is PhotoData => p !== null).map(p => p.file);
    
    if (photoFiles.length === 0) {
      toast.error("Adicione pelo menos uma foto!");
      return;
    }

    toast.loading("Criando sua página...");

    const slug = await createPage({
      type: data.type,
      name1: data.name1,
      name2: data.name2,
      occasion: data.occasion,
      message: data.message,
      startDate: data.startDate,
      plan: data.plan,
      photoFiles: photoFiles,
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

  // Check if switching to a plan with fewer photos would remove photos
  const wouldRemovePhotos = (planId: PlanId) => {
    const targetMax = PLAN_LIMITS[planId].maxPhotos;
    const currentPhotosCount = photos.filter(p => p !== null).length;
    return currentPhotosCount > targetMax;
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
              Escolha seu plano e personalize sua página
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* STEP 1: Plan Selection - NOW FIRST! */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <Label className="text-lg font-semibold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">1</span>
                Escolha seu plano
              </Label>
              <div className="grid gap-3">
                {plans.map((plan) => {
                  const planLimits = PLAN_LIMITS[plan.id as PlanId];
                  const wouldRemove = wouldRemovePhotos(plan.id);
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
                          checked={selectedPlan === plan.id}
                          onChange={() => handlePlanChange(plan.id)}
                          className="hidden"
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
                            {planLimits.maxPhotos > 1 && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                {planLimits.maxPhotos} fotos
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

                      {/* Warning if would remove photos */}
                      {wouldRemove && selectedPlan !== plan.id && (
                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2">
                          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                          <span>Algumas fotos serão removidas ao selecionar este plano</span>
                        </div>
                      )}

                      {/* Features list when selected */}
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

            {/* Plan Benefits Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <PlanBenefitsBanner planId={selectedPlan} previousPlanId={previousPlan} />
            </motion.div>

            {/* Type Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <Label className="text-lg font-semibold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">2</span>
                Tipo de página
              </Label>
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

            {/* STEP 3: Photo Upload - DYNAMIC! */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-4"
            >
              <Label className="text-lg font-semibold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">3</span>
                {currentPlanLimits.maxPhotos > 1 
                  ? `Fotos (até ${currentPlanLimits.maxPhotos})` 
                  : "Foto"}
              </Label>
              
              <div className="flex flex-wrap items-center justify-center gap-4">
                <AnimatePresence mode="popLayout">
                  {photos.map((photo, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <PhotoSlot
                        index={index}
                        photo={photo}
                        onUpload={(file) => handlePhotoUpload(index, file)}
                        onRemove={() => handlePhotoRemove(index)}
                        isRequired={index === 0}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                JPG, PNG ou WEBP. Máximo 5MB por foto.
                {currentPlanLimits.maxPhotos > 1 && (
                  <span className="block mt-1 text-primary">
                    ✨ Adicione até {currentPlanLimits.maxPhotos} fotos no plano {currentPlanLimits.name}!
                  </span>
                )}
              </p>
            </motion.div>

            {/* Names */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <Label className="text-lg font-semibold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">4</span>
                {type === "pet" ? "Nome do pet" : "Nomes"}
              </Label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name1" className="text-sm text-muted-foreground">
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
                    <Label htmlFor="name2" className="text-sm text-muted-foreground">Segundo nome</Label>
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
              </div>
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
              transition={{ delay: 0.45 }}
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

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
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
                Ao criar, você concorda com nossos termos de uso.
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
