import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, Share2, Crown, Loader2, ArrowLeft, Check, ExternalLink, Copy } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeartInfinity from "@/components/HeartInfinity";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getPlanFeatures } from "@/config/planLimits";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { toast } from "sonner";

interface PageData {
  id: string;
  slug: string;
  name1: string;
  name2: string | null;
  photo_url: string | null;
  photos: string[] | null;
  plan: string;
}

const Install = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { isInstalled, isIOS, isAndroid, isSafari, promptReady, promptInstall } = usePWAInstall();

  // Buscar dados da página
  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) {
        setError("Página não encontrada");
        setIsLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("pages")
        .select("id, slug, name1, name2, photo_url, photos, plan")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching page:", fetchError);
        setError("Erro ao carregar página");
        setIsLoading(false);
        return;
      }

      if (!data) {
        setError("Página não encontrada");
        setIsLoading(false);
        return;
      }

      setPage(data);
      setIsLoading(false);

      // Save slug to localStorage for PWA redirect
      localStorage.setItem("foreverus_couple_slug", slug);

      // Update page title for personalization
      const coupleNames = data.name2 ? `${data.name1} & ${data.name2}` : data.name1;
      document.title = `Instalar ${coupleNames} - ForeverUs`;
    };

    fetchPage();
  }, [slug]);

  // Instalar no Android (1 clique)
  const handleAndroidInstall = async () => {
    const success = await promptInstall();
    if (success) {
      toast.success("App instalado com sucesso!");
    }
  };

  // Copiar link
  const handleCopyLink = async () => {
    const link = window.location.href;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Compartilhar
  const handleShare = async () => {
    const installLink = window.location.href;
    const names = page?.name2 ? `${page.name1} & ${page.name2}` : page?.name1;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Instalar app de ${names}`,
          text: "Instale o app para ter acesso rápido à nossa página!",
          url: installLink,
        });
      } catch {
        await handleCopyLink();
      }
    } else {
      await handleCopyLink();
    }
  };

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </motion.div>
      </div>
    );
  }

  // Erro
  if (error || !page) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Header variant="minimal" />
        <main className="container py-20">
          <div className="max-w-lg mx-auto text-center">
            <h1 className="text-2xl font-serif font-bold text-foreground mb-4">
              {error || "Página não encontrada"}
            </h1>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const planFeatures = getPlanFeatures(page.plan);
  const coupleNames = page.name2 ? `${page.name1} & ${page.name2}` : page.name1;
  const photoUrl = page.photos?.[0] || page.photo_url || "/placeholder.svg";

  // Verificar se tem acesso ao PWA
  if (!planFeatures.hasPWA) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Header variant="minimal" />
        <main className="container py-12 md:py-20">
          <div className="max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl bg-card border border-border shadow-elevated p-8 text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center"
              >
                <Crown className="w-10 h-10 text-amber-500" />
              </motion.div>

              <div className="space-y-2">
                <h1 className="text-2xl font-serif font-bold text-foreground">Recurso Premium</h1>
                <p className="text-muted-foreground">
                  A instalação como app está disponível apenas no plano Premium.
                </p>
              </div>

              <HeartInfinity size="md" className="mx-auto opacity-50" />

              <div className="space-y-3">
                <Button variant="gold" size="lg" className="w-full" onClick={() => navigate("/criar")}>
                  <Crown className="w-4 h-4" />
                  Fazer upgrade para Premium
                </Button>

                <Button variant="outline" onClick={() => navigate(`/p/${slug}`)}>
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para a página
                </Button>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Renderizar conteúdo baseado no estado
  const renderInstallContent = () => {
    // Já instalado
    if (isInstalled) {
      return (
        <div className="space-y-4">
          <div className="rounded-xl bg-primary/20 border border-primary/30 p-4 flex items-center justify-center gap-2">
            <Check className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium">App já instalado!</span>
          </div>
          <Button variant="neon" size="lg" className="w-full" onClick={() => navigate(`/p/${slug}`)}>
            <ExternalLink className="w-4 h-4" />
            Abrir App
          </Button>
        </div>
      );
    }

    // iOS - Não é Safari
    if (isIOS && !isSafari) {
      return (
        <div className="space-y-4">
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 text-center">
            <p className="text-amber-200 font-medium mb-2">Abra no Safari para instalar</p>
            <p className="text-sm text-muted-foreground">
              No iPhone, apps só podem ser instalados pelo Safari.
            </p>
          </div>
          <Button variant="outline" size="lg" className="w-full" onClick={handleCopyLink}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Link copiado!" : "Copiar link"}
          </Button>
        </div>
      );
    }

    // iOS - Safari
    if (isIOS && isSafari) {
      return (
        <div className="space-y-4">
          <div className="rounded-xl bg-card border border-border p-4 space-y-4">
            <p className="text-sm text-muted-foreground text-center mb-2">
              Siga os passos para instalar:
            </p>

            {/* Passo 1 - iOS Share Icon */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                1
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Toque no ícone</p>
                <p className="text-xs text-muted-foreground">de compartilhar</p>
              </div>
              {/* iOS Share Icon - Square with arrow up */}
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                </svg>
              </div>
            </motion.div>

            {/* Passo 2 */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                2
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Role para baixo</p>
                <p className="text-xs text-muted-foreground">nas opções do menu</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </motion.div>

            {/* Passo 3 */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                3
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Toque em</p>
                <p className="text-xs text-muted-foreground">"Adicionar à Tela de Início"</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
            </motion.div>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            O app aparecerá na sua tela inicial como um ícone
          </p>
        </div>
      );
    }

    // Android/Desktop - Prompt pronto (1 clique!)
    if (promptReady) {
      return (
        <Button variant="neon" size="lg" className="w-full" onClick={handleAndroidInstall}>
          <Download className="w-4 h-4" />
          Instalar App
        </Button>
      );
    }

    // Android/Desktop - Prompt não disponível (fallback)
    return (
      <div className="space-y-4">
        <div className="rounded-xl bg-card border border-border p-4 space-y-3">
          <p className="text-sm text-muted-foreground text-center">
            Toque no menu do navegador (⋮) e selecione:
          </p>
          <p className="text-center font-medium text-foreground">"Adicionar à tela inicial"</p>
        </div>
        <Button variant="outline" size="lg" className="w-full" onClick={handleShare}>
          <Share2 className="w-4 h-4" />
          Compartilhar link
        </Button>
      </div>
    );
  };

  // Página de instalação para Premium
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header variant="minimal" />

      <main className="container py-12 md:py-20">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl bg-card border border-border shadow-elevated p-8 text-center space-y-6"
          >
            {/* Ícone do App (Foto do Casal) */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-28 h-28 mx-auto rounded-3xl overflow-hidden shadow-elevated border-4 border-primary/30"
            >
              <img src={photoUrl} alt={coupleNames} className="w-full h-full object-cover" />
            </motion.div>

            {/* Título */}
            <div className="space-y-2">
              <h1 className="text-2xl font-serif font-bold text-foreground">Instale o app de</h1>
              <p className="text-xl font-serif text-primary">"{coupleNames}"</p>
            </div>

            {/* Descrição */}
            <p className="text-muted-foreground text-sm">
              Acesse rapidamente direto da tela inicial do seu celular.
            </p>

            <HeartInfinity size="md" className="mx-auto" />

            {/* Conteúdo de instalação baseado no estado */}
            {renderInstallContent()}

            {/* Link para voltar */}
            {!isInstalled && (
              <Button variant="ghost" onClick={() => navigate(`/p/${slug}`)}>
                Continuar no navegador
              </Button>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Install;
