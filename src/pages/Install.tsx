import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Smartphone, Download, Share2, Crown, Loader2, ArrowLeft, Check } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeartInfinity from "@/components/HeartInfinity";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getPlanLimits } from "@/lib/planLimits";
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
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copied, setCopied] = useState(false);

  // Capturar o evento beforeinstallprompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Verificar se já está instalado
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

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

      // Injetar manifest dinâmico
      injectDynamicManifest(data);
    };

    fetchPage();
  }, [slug]);

  // Injetar manifest dinâmico para PWA personalizado
  const injectDynamicManifest = (pageData: PageData) => {
    const coupleNames = pageData.name2
      ? `${pageData.name1} & ${pageData.name2}`
      : pageData.name1;

    const shortName = pageData.name2
      ? `${pageData.name1.charAt(0)} & ${pageData.name2.charAt(0)}`
      : pageData.name1.substring(0, 12);

    const photoUrl = pageData.photos?.[0] || pageData.photo_url || "/placeholder.svg";

    const manifest = {
      name: coupleNames,
      short_name: shortName,
      description: `Página de ${coupleNames} - ForeverUs`,
      start_url: `/p/${pageData.slug}`,
      display: "standalone",
      background_color: "#0D0D0F",
      theme_color: "#722F37",
      icons: [
        {
          src: photoUrl,
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: photoUrl,
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    };

    // Remover manifest existente se houver
    const existingManifest = document.querySelector('link[rel="manifest"]');
    if (existingManifest) {
      existingManifest.remove();
    }

    // Criar blob URL para o manifest
    const blob = new Blob([JSON.stringify(manifest)], { type: "application/json" });
    const manifestUrl = URL.createObjectURL(blob);

    // Adicionar link do manifest
    const link = document.createElement("link");
    link.rel = "manifest";
    link.href = manifestUrl;
    document.head.appendChild(link);

    // Atualizar apple-touch-icon
    let appleIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
    if (!appleIcon) {
      appleIcon = document.createElement("link");
      appleIcon.rel = "apple-touch-icon";
      document.head.appendChild(appleIcon);
    }
    appleIcon.href = photoUrl;

    // Atualizar título
    document.title = `${coupleNames} - ForeverUs`;
  };

  // Detectar se é iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Instalar PWA
  const handleInstall = async () => {
    if (!page) return;
    
    const names = page.name2 ? `${page.name1} & ${page.name2}` : page.name1;
    
    if (deferredPrompt) {
      // Android - usar beforeinstallprompt
      const promptEvent = deferredPrompt as any;
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      
      if (outcome === "accepted") {
        toast.success("App instalado com sucesso!");
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS && navigator.share) {
      // iOS - abrir menu de compartilhamento nativo
      try {
        await navigator.share({
          title: names,
          text: `Instale o app de ${names}`,
          url: window.location.href,
        });
        toast.info("Use 'Adicionar à Tela de Início' para instalar o app");
      } catch (err) {
        // Usuário cancelou
      }
    } else {
      // Fallback - mostrar instrução simples
      toast.info("Toque no menu do navegador e selecione 'Adicionar à Tela de Início'");
    }
  };

  // Copiar link para compartilhar
  const handleShare = async () => {
    const installLink = `${window.location.origin}/install/${slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Instalar app de ${page?.name1} ${page?.name2 ? `& ${page.name2}` : ""}`,
          text: "Instale o app para ter acesso rápido à nossa página!",
          url: installLink,
        });
      } catch (err) {
        // User cancelled or error
        await copyToClipboard(installLink);
      }
    } else {
      await copyToClipboard(installLink);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
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

  const limits = getPlanLimits(page.plan);
  const coupleNames = page.name2 ? `${page.name1} & ${page.name2}` : page.name1;
  const photoUrl = page.photos?.[0] || page.photo_url || "/placeholder.svg";
  
  // Detectar se é iOS (movido para cima para usar em handleInstall)
  const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Verificar se tem acesso ao PWA
  if (!limits.hasPWA) {
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
                <h1 className="text-2xl font-serif font-bold text-foreground">
                  Recurso Premium
                </h1>
                <p className="text-muted-foreground">
                  A instalação como app está disponível apenas no plano Premium.
                </p>
              </div>

              <HeartInfinity size="md" className="mx-auto opacity-50" />

              <div className="space-y-3">
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate("/criar")}
                >
                  <Crown className="w-4 h-4" />
                  Fazer upgrade para Premium
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate(`/p/${slug}`)}
                >
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
              <img
                src={photoUrl}
                alt={coupleNames}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Título */}
            <div className="space-y-2">
              <h1 className="text-2xl font-serif font-bold text-foreground">
                Instalar o app de
              </h1>
              <p className="text-xl font-serif text-primary">
                "{coupleNames}"
              </p>
            </div>

            {/* Descrição */}
            <p className="text-muted-foreground text-sm">
              Tenha acesso rápido ao contador e atividades do casal direto na tela inicial do seu celular.
            </p>

            <HeartInfinity size="md" className="mx-auto" />

            {/* Botões de Ação */}
            <div className="space-y-3">
              {isInstalled ? (
                <div className="rounded-xl bg-primary/20 border border-primary/30 p-4 flex items-center justify-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span className="text-primary font-medium">App já instalado!</span>
                </div>
              ) : (
                <Button
                  variant="neon"
                  size="lg"
                  className="w-full"
                  onClick={handleInstall}
                >
                  <Download className="w-4 h-4" />
                  Instalar App
                </Button>
              )}

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleShare}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Link copiado!
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    Compartilhar link para instalar
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate(`/p/${slug}`)}
              >
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
};

export default Install;
