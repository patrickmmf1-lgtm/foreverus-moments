import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, QrCode } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';

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
      
      // Gerar QR Code como base64
      const qrCodeDataUrl = await QRCode.toDataURL(pageUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      // Criar PDF A4 Portrait
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = 210;
      const pageHeight = 297;
      
      // Background escuro
      pdf.setFillColor(13, 13, 15);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Logo/Título PraSempre
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(36);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PraSempre', pageWidth / 2, 40, { align: 'center' });
      
      // Linha decorativa
      pdf.setDrawColor(114, 47, 55); // #722F37
      pdf.setLineWidth(0.5);
      pdf.line(70, 50, 140, 50);
      
      // Nomes do casal
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'normal');
      const coupleNames = name2 ? `${name1} & ${name2}` : name1;
      pdf.text(coupleNames, pageWidth / 2, 70, { align: 'center' });
      
      // Data de início (se existir)
      if (startDate) {
        pdf.setFontSize(14);
        pdf.setTextColor(156, 163, 175);
        const date = new Date(startDate);
        const formattedDate = date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });
        pdf.text(`Juntos desde ${formattedDate}`, pageWidth / 2, 85, { align: 'center' });
      }
      
      // QR Code centralizado
      const qrSize = 100;
      const qrX = (pageWidth - qrSize) / 2;
      const qrY = 100;
      pdf.addImage(qrCodeDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
      
      // Borda decorativa ao redor do QR
      pdf.setDrawColor(114, 47, 55);
      pdf.setLineWidth(1);
      pdf.rect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10);
      
      // Texto abaixo do QR
      pdf.setFontSize(12);
      pdf.setTextColor(156, 163, 175);
      pdf.text('Escaneie para ver nossa página', pageWidth / 2, 215, { align: 'center' });
      
      // URL pequena
      pdf.setFontSize(9);
      pdf.setTextColor(107, 114, 128);
      pdf.text(pageUrl, pageWidth / 2, 225, { align: 'center' });
      
      // Mensagem romântica
      pdf.setFontSize(10);
      pdf.setTextColor(156, 163, 175);
      pdf.text('Nossa história, para sempre', pageWidth / 2, 245, { align: 'center' });
      
      // Rodapé
      pdf.setFontSize(8);
      pdf.setTextColor(75, 85, 99);
      pdf.text('Criado com amor em PraSempre', pageWidth / 2, 280, { align: 'center' });
      
      // Salvar PDF
      const fileName = `prasempre_${pageSlug}_${Date.now()}.pdf`;
      pdf.save(fileName);
      
      toast.success("Cartão gerado com sucesso!");
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error("Erro ao gerar cartão. Tente novamente.");
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
