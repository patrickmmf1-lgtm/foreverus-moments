import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Copy, Download, ExternalLink, Smartphone } from "lucide-react";
import { useState } from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeartInfinity from "@/components/HeartInfinity";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Sucesso = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Demo data
  const pageLink = "https://foreverus.com/p/ana-joao-x7k2";
  const isPremium = true;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(pageLink);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    toast.success("QR Code baixado!");
    // In production, this would download the actual QR code
  };

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

            {/* QR Code placeholder */}
            <div className="space-y-3">
              <div className="w-40 h-40 mx-auto rounded-xl bg-secondary flex items-center justify-center border-2 border-dashed border-border">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-foreground/10 rounded-lg grid grid-cols-3 gap-1 p-2">
                    {[...Array(9)].map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${
                          Math.random() > 0.3 ? "bg-foreground" : "bg-transparent"
                        }`}
                      />
                    ))}
                  </div>
                </div>
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
                onClick={() => navigate("/p/demo")}
              >
                <ExternalLink className="w-4 h-4" />
                Ver minha página
              </Button>

              {isPremium && (
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full"
                >
                  <Smartphone className="w-4 h-4" />
                  Instalar nosso app
                </Button>
              )}
            </div>

            {/* Email notice */}
            <p className="text-xs text-muted-foreground">
              Enviamos o link e o QR Code para seu e-mail.
              <br />
              Verifique também a caixa de spam.
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sucesso;