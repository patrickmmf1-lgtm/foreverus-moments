import { useState } from "react";
import { Upload, X, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PhotoSlotProps {
  index: number;
  photo: { file: File; preview: string } | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  isRequired?: boolean;
}

export function PhotoSlot({ index, photo, onUpload, onRemove, isRequired = false }: PhotoSlotProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Imagem muito grande. Máximo 5MB.");
        return;
      }
      onUpload(file);
    }
  };

  const inputId = `photo-slot-${index}`;

  return (
    <div className="relative">
      <label
        htmlFor={inputId}
        className={cn(
          "relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl cursor-pointer overflow-hidden transition-all",
          "border-2 border-dashed hover:border-primary",
          "flex items-center justify-center bg-card",
          photo ? "border-solid border-primary/50" : "border-border",
          isRequired && !photo && "border-primary/40"
        )}
      >
        {photo ? (
          <img
            src={photo.preview}
            alt={`Foto ${index + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-2">
            {index === 0 ? (
              <>
                <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">
                  Foto principal
                </span>
              </>
            ) : (
              <>
                <ImagePlus className="w-6 h-6 mx-auto text-muted-foreground/50 mb-1" />
                <span className="text-xs text-muted-foreground/70">
                  Opcional
                </span>
              </>
            )}
          </div>
        )}
        <input
          type="file"
          id={inputId}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {/* Remove button */}
      {photo && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onRemove();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md hover:bg-destructive/90 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Photo number indicator */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground bg-background px-1.5 py-0.5 rounded">
        {index + 1}
      </div>
    </div>
  );
}
