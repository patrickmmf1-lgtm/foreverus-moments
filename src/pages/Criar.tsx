import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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

interface PhotoSlot {
  preview: string;
  file: File;
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
  const [photos, setPhotos] = useState<PhotoSlot[]>([]);
  const { createPage, isLoading } = useCreatePage();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
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

  const currentPlanLimits = PLAN_LIMITS[selectedPlan as PlanId];
  const maxPhotos = currentPlanLimits?.maxPhotos || 1;

  // Limpar fotos extras ao mudar de plano
  useEffect(() => {
    if (photos.length > maxPhotos) {
      setPhotos(prev => prev.slice(0, maxPhotos));
      toast.info(`Mantendo apenas ${maxPhotos} foto${maxPhotos > 1 ? 's' : ''} para este plano`);
    }
  }, [selectedPlan, maxPhotos, photos.length]);

  const handlePhotoUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => {
          const updated = [...prev];
          updated[index] = { preview: reader.result as string, file };
          return updated;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
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
      photoFiles: photos.map(p => p.file),
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

      <main className="container px-4 py-6 md:py-12">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <HeartInfinity size="md" className="mx-auto mb-3" />
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-1">
              Criar página {getTypeLabel()}
            </h1>
            <p className="text-sm text-muted-foreground">
              Preencha os dados e escolha seu plano
            </p>
          </motion.div>

          {/* Type Tabs - Mobile optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Tabs
              value={type}
              onValueChange={(v) => setValue("type", v as "couple" | "friends" | "pet")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 h-12 bg-card border border-border rounded-xl">
                <TabsTrigger value="couple" className="h-10 gap-2 rounded-lg text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Heart className="w-4 h-4" />
                  <span>Casal</span>
                </TabsTrigger>
                <TabsTrigger value="friends" className="h-10 gap-2 rounded-lg text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Users className="w-4 h-4" />
                  <span>Amigos</span>
                </TabsTrigger>
                <TabsTrigger value="pet" className="h-10 gap-2 rounded-lg text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <PawPrint className="w-4 h-4" />
                  <span>Pet</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Photo Upload - Dynamic based on plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  {maxPhotos > 1 ? "Fotos do casal" : "Foto do casal"}
                </Label>
                <span className="text-xs text-muted-foreground">
                  {photos.length}/{maxPhotos} foto{maxPhotos > 1 ? 's' : ''}
                </span>
              </div>
              
              {maxPhotos > 1 && (
                <p className="text-xs text-primary">
                  ✨ No {currentPlanLimits.name} você pode adicionar até {maxPhotos} fotos
                </p>
              )}
              
              <div className={cn(
                "grid gap-3",
                maxPhotos === 1 ? "grid-cols-1 max-w-xs mx-auto" : "grid-cols-3"
              )}>
                <AnimatePresence mode="popLayout">
                  {Array.from({ length: maxPhotos }).map((_, index) => {
                    const photo = photos[index];
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <label
                          htmlFor={`photo-${index}`}
                          className={cn(
                            "relative w-full aspect-square rounded-2xl cursor-pointer overflow-hidden transition-all flex",
                            "border-2 border-dashed border-border hover:border-primary active:scale-[0.98]",
                            "items-center justify-center bg-card",
                            photo && "border-solid border-primary"
                          )}
                        >
                          {photo ? (
                            <>
                              <img
                                src={photo.preview}
                                alt={`Foto ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleRemovePhoto(index);
                                }}
                                className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <div className="text-center p-4">
                              <Upload className={cn(
                                "mx-auto text-muted-foreground mb-1",
                                maxPhotos === 1 ? "w-10 h-10" : "w-6 h-6"
                              )} />
                              <span className={cn(
                                "text-muted-foreground",
                                maxPhotos === 1 ? "text-sm" : "text-xs"
                              )}>
                                {maxPhotos === 1 ? "Toque para enviar" : `Foto ${index + 1}`}
                              </span>
                            </div>
                          )}
                          <input
                            type="file"
                            id={`photo-${index}`}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handlePhotoUpload(index, e)}
                          />
                        </label>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Names - Stacked on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name1" className="text-sm">
                  {type === "pet" ? "Nome do pet" : "Primeiro nome"}
                </Label>
                <Input
                  id="name1"
                  placeholder={type === "pet" ? "Ex: Thor" : "Ex: Ana"}
                  className="input-romantic h-12 text-base"
                  {...register("name1")}
                />
                {errors.name1 && (
                  <p className="text-xs text-destructive">{errors.name1.message}</p>
                )}
              </div>

              {type !== "pet" && (
                <div className="space-y-2">
                  <Label htmlFor="name2" className="text-sm">Segundo nome</Label>
                  <Input
                    id="name2"
                    placeholder="Ex: João"
                    className="input-romantic h-12 text-base"
                    {...register("name2")}
                  />
                  {errors.name2 && (
                    <p className="text-xs text-destructive">{errors.name2.message}</p>
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
              <Label htmlFor="occasion" className="text-sm">Título/Ocasião (opcional)</Label>
              <Input
                id="occasion"
                placeholder="Ex: Nossa História de Amor"
                className="input-romantic h-12 text-base"
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
              <Label className="text-sm">
                {type === "pet" ? "Data da adoção" : "Quando começaram?"}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 justify-start text-left font-normal text-base input-romantic",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-3 h-5 w-5" />
                    {startDate ? (
                      format(startDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      if (date) {
                        setValue("startDate", date);
                        clearErrors("startDate");
                      }
                    }}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {errors.startDate && (
                <p className="text-xs text-destructive">{errors.startDate.message}</p>
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
                <Label htmlFor="message" className="text-sm">Mensagem surpresa 💜</Label>
                <span className={cn(
                  "text-xs",
                  message.length > 280 ? "text-destructive" : "text-muted-foreground"
                )}>
                  {message.length}/300
                </span>
              </div>
              <Textarea
                id="message"
                placeholder="Escreva algo que arrepia o coração..."
                className="input-romantic min-h-[120px] resize-none text-base leading-relaxed"
                {...register("message")}
              />
              {errors.message && (
                <p className="text-xs text-destructive">{errors.message.message}</p>
              )}
            </motion.div>

            {/* Plan Selection - Mobile optimized cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <Label className="text-sm font-medium">Escolha seu plano</Label>
              <div className="space-y-3">
                {plans.map((plan) => {
                  const planLimits = PLAN_LIMITS[plan.id as PlanId];
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <label
                      key={plan.id}
                      className={cn(
                        "relative flex flex-col gap-3 p-4 rounded-2xl cursor-pointer transition-all active:scale-[0.98]",
                        "border-2",
                        isSelected
                          ? plan.highlighted
                            ? "border-gold bg-gold/5 shadow-lg"
                            : "border-primary bg-primary/5 shadow-lg"
                          : "border-border bg-card"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          value={plan.id}
                          className="hidden"
                          {...register("plan")}
                        />
                        
                        {/* Radio indicator */}
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/50"
                        )}>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-primary-foreground" />
                          )}
                        </div>

                        {/* Plan info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-foreground">{plan.name}</span>
                            {plan.highlighted && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-gold text-gold-foreground font-bold uppercase tracking-wide">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{plan.description}</p>
                        </div>

                        {/* Price */}
                        <div className="text-right flex-shrink-0">
                          <div className="flex items-baseline gap-0.5">
                            <span className="text-xs text-muted-foreground">R$</span>
                            <span className="text-xl font-display font-bold text-foreground">
                              {plan.price}
                            </span>
                          </div>
                          <span className="text-[10px] text-muted-foreground">único</span>
                        </div>
                      </div>

                      {/* Features list - Always visible when selected */}
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-3 border-t border-border/30"
                        >
                          <ul className="grid gap-1.5">
                            {planLimits.features.slice(0, 4).map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                            {planLimits.features.length > 4 && (
                              <li className="text-xs text-primary font-medium mt-1">
                                +{planLimits.features.length - 4} benefícios
                              </li>
                            )}
                          </ul>
                        </motion.div>
                      )}
                    </label>
                  );
                })}
              </div>
            </motion.div>

            {/* Submit - Mobile optimized */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="pt-4 pb-2"
            >
              <Button 
                type="submit" 
                variant="neon" 
                size="xl" 
                className="w-full h-14 text-base font-semibold group"
                disabled={isLoading}
              >
                {isLoading ? "Criando..." : "Criar minha página"}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-3">
                Pagamento único · Sem assinatura · Acesso vitalício
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
