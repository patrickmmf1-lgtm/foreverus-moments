import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, QrCode } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeCardProps {
  pageSlug: string;
  name1: string;
  name2?: string;
  startDate?: string;
  plan: string;
}

export const QRCodeCard = ({ pageSlug, name1, name2, startDate, plan }: QRCodeCardProps) => {
  const isPremium = plan === '29_90';
  
  if (!isPremium) {
    return null;
  }

  const pageUrl = `${window.location.origin}/p/${pageSlug}`;
  
  const handleDownloadPDF = async () => {
    try {
      toast.info("Gerando seu cartão...");
      
      // TODO: Implementar geração de PDF
      toast.success("Funcionalidade em desenvolvimento!");
      
    } catch (error) {
      toast.error("Erro ao gerar cartão");
    }
  };

  return (
    <Card className="bg-card border border-border/50 p-6 rounded-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
          <QrCode className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-bold text-foreground">Seu QR Code</h3>
          <p className="text-xs text-muted-foreground">Compartilhe de forma especial</p>
        </div>
      </div>

      <div className="flex justify-center py-6">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <QRCodeSVG 
            value={pageUrl} 
            size={120}
            level="M"
            includeMargin={false}
          />
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleDownloadPDF}
      >
        <Download className="w-4 h-4 mr-2" />
        Baixar Cartão PDF
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-3">
        Imprima e presenteie de forma única
      </p>
    </Card>
  );
};

export default QRCodeCard;
