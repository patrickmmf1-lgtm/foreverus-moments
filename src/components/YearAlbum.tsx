import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Camera } from "lucide-react";
import { motion } from "framer-motion";

interface MonthPhoto {
  month_key: string;
  month_number: number;
  photo_url?: string;
}

interface YearAlbumProps {
  pageId: string;
  pageSlug: string;
  plan: string;
  monthlyPhotos?: MonthPhoto[];
  isOwner?: boolean;
}

const MONTHS = [
  { key: 'jan', number: 1, label: 'Jan' },
  { key: 'fev', number: 2, label: 'Fev' },
  { key: 'mar', number: 3, label: 'Mar' },
  { key: 'abr', number: 4, label: 'Abr' },
  { key: 'mai', number: 5, label: 'Mai' },
  { key: 'jun', number: 6, label: 'Jun' },
  { key: 'jul', number: 7, label: 'Jul' },
  { key: 'ago', number: 8, label: 'Ago' },
  { key: 'set', number: 9, label: 'Set' },
  { key: 'out', number: 10, label: 'Out' },
  { key: 'nov', number: 11, label: 'Nov' },
  { key: 'dez', number: 12, label: 'Dez' },
];

export const YearAlbum = ({ pageId, pageSlug, plan, monthlyPhotos = [], isOwner = false }: YearAlbumProps) => {
  const isPremium = plan === '29_90';
  
  if (!isPremium) {
    return null;
  }

  const getPhotoForMonth = (monthKey: string) => {
    return monthlyPhotos.find(p => p.month_key === monthKey)?.photo_url;
  };

  const handleAddPhoto = (monthKey: string) => {
    if (!isOwner) return;
    // TODO: Implementar upload de foto
    console.log('Adicionar foto para:', monthKey);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl bg-card border border-border/50 p-6"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-3">
          <Camera className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Nosso Ano em Fotos</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Um pedacinho de vocês, mês a mês
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {MONTHS.map((month) => {
          const photoUrl = getPhotoForMonth(month.key);
          
          return (
            <div key={month.key} className="aspect-square relative overflow-hidden rounded-xl">
              {photoUrl ? (
                <>
                  <img
                    src={photoUrl}
                    alt={month.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <span className="text-xs font-medium text-white">
                      {month.label}
                    </span>
                  </div>
                  {isOwner && (
                    <div className="absolute top-1 right-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 bg-black/50 hover:bg-black/70 text-white"
                        onClick={() => handleAddPhoto(month.key)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => handleAddPhoto(month.key)}
                  disabled={!isOwner}
                  className="w-full h-full bg-muted/50 border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted transition-colors flex flex-col items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
                >
                  <Plus className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-medium">
                    {month.label}
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {!isOwner && (
        <p className="text-xs text-muted-foreground text-center mt-4">
          Apenas o criador da página pode adicionar fotos
        </p>
      )}
    </motion.div>
  );
};

export default YearAlbum;
