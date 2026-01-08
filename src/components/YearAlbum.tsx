import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Camera, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from '@/integrations/supabase/client';
import { generateSafeFileName } from '@/utils/sanitizeFileName';
import { toast } from 'sonner';

interface MonthPhoto {
  month_key: string;
  month_number: number;
  photo_url?: string;
}

interface YearAlbumProps {
  pageId: string;
  pageSlug: string;
  plan: string;
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

export const YearAlbum = ({ pageId, pageSlug, plan }: YearAlbumProps) => {
  const isPremium = plan === '29_90';
  const [photos, setPhotos] = useState<MonthPhoto[]>([]);
  
  useEffect(() => {
    if (isPremium) {
      fetchMonthlyPhotos();
    }
  }, [pageSlug, isPremium]);

  const fetchMonthlyPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('monthly_photos')
        .select('*')
        .eq('page_slug', pageSlug)
        .order('month_number');
      
      if (!error && data) {
        setPhotos(data);
      }
    } catch (error) {
      console.error('Erro ao buscar fotos:', error);
    }
  };
  
  if (!isPremium) {
    return null;
  }

  const getPhotoForMonth = (monthKey: string) => {
    return photos.find(p => p.month_key === monthKey)?.photo_url;
  };

  const handleAddPhoto = async (monthKey: string, monthNumber: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/jpg,image/png,image/webp';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error('Use apenas JPG, PNG ou WebP');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Arquivo muito grande. Máximo 5MB');
        return;
      }

      const loadingToast = toast.loading("Enviando foto...");

      try {
        const sanitizedFileName = generateSafeFileName(file.name);
        const finalFileName = `${pageSlug}_${monthKey}_${sanitizedFileName}`;

        const { error: uploadError } = await supabase.storage
          .from('couple-photos')
          .upload(finalFileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error('Erro ao fazer upload');
        }

        const { data: { publicUrl } } = supabase.storage
          .from('couple-photos')
          .getPublicUrl(finalFileName);

        const { error: dbError } = await supabase
          .from('monthly_photos')
          .upsert({
            page_id: pageId,
            page_slug: pageSlug,
            month_key: monthKey,
            month_number: monthNumber,
            photo_url: publicUrl
          }, {
            onConflict: 'page_id,month_key'
          });

        if (dbError) {
          console.error('Database error:', dbError);
          throw new Error('Erro ao salvar foto');
        }

        toast.success("Foto adicionada!", { id: loadingToast });
        await fetchMonthlyPhotos();

      } catch (error: any) {
        console.error('Erro completo:', error);
        toast.error(error.message || "Erro ao adicionar foto", { id: loadingToast });
      }
    };

    input.click();
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
            <div key={month.key} className="aspect-square relative overflow-hidden rounded-xl group">
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
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={() => handleAddPhoto(month.key, month.number)}
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Trocar
                    </Button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => handleAddPhoto(month.key, month.number)}
                  className="w-full h-full bg-muted/50 border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted transition-colors flex flex-col items-center justify-center gap-1 cursor-pointer rounded-xl"
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
    </motion.div>
  );
};

export default YearAlbum;
