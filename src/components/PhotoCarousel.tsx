import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PhotoCarouselProps {
  photos: string[];
  fallbackPhoto: string;
  className?: string;
  interval?: number;
}

const PhotoCarousel = ({ 
  photos, 
  fallbackPhoto, 
  className = "",
  interval = 10000 
}: PhotoCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Filter out empty strings and use fallback if no valid photos
  const validPhotos = photos.filter(p => p && p.trim() !== "");
  const displayPhotos = validPhotos.length > 0 ? validPhotos : [fallbackPhoto];
  const hasMultiplePhotos = displayPhotos.length > 1;

  const nextPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % displayPhotos.length);
  }, [displayPhotos.length]);

  // Auto-advance carousel
  useEffect(() => {
    if (!hasMultiplePhotos) return;
    
    const timer = setInterval(nextPhoto, interval);
    return () => clearInterval(timer);
  }, [hasMultiplePhotos, interval, nextPhoto]);

  // Single photo - static display
  if (!hasMultiplePhotos) {
    return (
      <div className={className}>
        <img
          src={displayPhotos[0]}
          alt="Foto"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Multiple photos - carousel with slide animation
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={currentIndex}
          src={displayPhotos[currentIndex]}
          alt={`Foto ${currentIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.4, 0, 0.2, 1] 
          }}
        />
      </AnimatePresence>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {displayPhotos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-white w-6" 
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Ir para foto ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoCarousel;
