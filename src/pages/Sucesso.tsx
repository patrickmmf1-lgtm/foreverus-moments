import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Copy, Download, ExternalLink, Smartphone, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeartInfinity from "@/components/HeartInfinity";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Sucesso = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [pageStatus, setPageStatus] = useState<'loading' | 'pending_payment' | 'active'>('loading');
  const [isPolling, setIsPolling] = useState(false);

  const slug = searchParams.get("slug") || "demo";
  const baseUrl = window.location.origin;
  const pageLink = `${baseUrl}/p/${slug}`;

  // Buscar status da página
  useEffect(() => {
    const fetchPageStatus = async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('status, plan')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        console.error('Error fetching page status:', error);
        setPageStatus('active'); // Fallback para mostrar sucesso
        return;
      }

      if (!data) {
        console.log('Page not found');
        setPageStatus('active'); // Fallback
        return;
      }

      setPageStatus(data.status as 'pending_payment' | 'active');
    };

    fetchPageStatus();
  }, [slug]);

  // Polling para atualizar status quando pendente
  useEffect(() => {
    if (pageStatus !== 'pending_payment') return;

    setIsPolling(true);
    const interval = setInterval(async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('status')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data?.status === 'active') {
        setPageStatus('active');
        setIsPolling(false);
        toast.success('Pagamento confirmado!');
        clearInterval(interval);
      }
    }, 3000); // Verificar a cada 3 segundos

    return () => {
      clearInterval(interval);
      setIsPolling(false);
    };
  }, [pageStatus, slug]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(pageLink);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `qrcode-${slug}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      toast.success("QR Code baixado!");
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Estado de carregamento
  if (pageStatus === 'loading') {
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

  // Estado de pagamento pendente
  if (pageStatus === 'pending_payment') {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Header variant="minimal" />

        <main className="container py-12 md:py-20">
          <div className="max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl bg-card border border-border shadow-elevated p-8 text-center space-y-8"
            >
              {/* Loading Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center"
              >
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
              </motion.div>

              {/* Title */}
              <div className="space-y-2">
                <h1 className="text-3xl font-serif font-bold text-foreground">
                  Confirmando pagamento...
                </h1>
                <p className="text-muted-foreground">
                  Aguarde enquanto processamos seu pagamento via Pix. Isso pode levar alguns segundos.
                </p>
              </div>

              {/* Heart Infinity */}
              <HeartInfinity size="lg" className="mx-auto animate-pulse" />

              {/* Info */}
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  {isPolling ? (
                    <>Verificando automaticamente a cada 3 segundos...</>
                  ) : (
                    <>Se o pagamento foi realizado, aguarde a confirmação.</>
                  )}
                </p>
              </div>

              {/* Manual refresh */}
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Verificar manualmente
              </Button>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Estado de sucesso (pagamento confirmado)
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header variant="minimal" />

      <main className="container py-12 md:py-20">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl bg-card border border-border shadow-elevated p-8 text-center space-y-8"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 mx-auto rounded-full bg-primary flex items-center justify-center"
            >
              <Check className="w-10 h-10 text-primary-foreground" />
            </motion.div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-3xl font-serif font-bold text-foreground">
                Página criada com sucesso!
              </h1>
              <p className="text-muted-foreground">
                Sua página está pronta. Compartilhe com quem você ama!
              </p>
            </div>

            {/* Heart Infinity */}
            <HeartInfinity size="lg" className="mx-auto" />

            {/* Link Box */}
            <div className="space-y-3">
              <div className="rounded-xl bg-secondary p-4 flex items-center gap-3">
                <input
                  type="text"
                  readOnly
                  value={pageLink}
                  className="flex-1 bg-transparent text-sm text-foreground truncate outline-none"
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <Button
                variant="neon"
                size="lg"
                className="w-full"
                onClick={handleCopyLink}
              >
                <Copy className="w-4 h-4" />
                Copiar link
              </Button>
            </div>

            {/* QR Code */}
            <div className="space-y-3">
              <div className="w-44 h-44 mx-auto rounded-xl bg-white p-3 flex items-center justify-center">
                <QRCodeSVG
                  id="qr-code"
                  value={pageLink}
                  size={160}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                  includeMargin={false}
                />
              </div>
              <Button
                variant="outline"
                size="default"
                onClick={handleDownloadQR}
              >
                <Download className="w-4 h-4" />
                Baixar QR Code
              </Button>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-border">
              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={() => navigate(`/p/${slug}`)}
              >
                <ExternalLink className="w-4 h-4" />
                Ver minha página
              </Button>

              <Button
                variant="gold"
                size="lg"
                className="w-full"
              >
                <Smartphone className="w-4 h-4" />
                Instalar nosso app
              </Button>
            </div>

            {/* Email notice */}
            <p className="text-xs text-muted-foreground">
              Guarde este link para acessar sua página quando quiser!
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sucesso;
