import { useState } from 'react';
import { X, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SurpriseLetterProps {
  message: string;
}

const SurpriseLetter = ({ message }: SurpriseLetterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        className="relative w-full group cursor-pointer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 p-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-3xl">💌</span>
            </div>
            <div>
              <p className="text-foreground font-display font-bold text-lg">
                Toque para abrir sua surpresa
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Uma mensagem especial te aguarda
              </p>
            </div>
          </div>
        </div>
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Carta */}
          <div className="relative overflow-hidden rounded-2xl">
            {/* Header da carta com textura */}
            <div className="relative bg-gradient-to-b from-rose-900 to-rose-950 p-6 pb-8">
              {/* Padrão decorativo */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: '20px 20px'
                }} />
              </div>
              
              {/* Botão fechar */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-rose-950/50 hover:bg-rose-950 transition-colors z-10"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              
              <div className="relative text-center">
                <span className="text-5xl mb-3 block">💌</span>
                <h3 className="text-xl font-display font-bold text-white">
                  Uma mensagem especial
                </h3>
              </div>
            </div>

            {/* Corpo da carta */}
            <div className="relative bg-amber-50 p-6">
              {/* Textura de papel */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }} />
              </div>

              {/* Mensagem */}
              <div className="relative">
                <p className="text-rose-900 leading-relaxed text-lg font-serif italic text-center">
                  "{message}"
                </p>
                
                {/* Decoração inferior */}
                <div className="flex justify-center mt-6">
                  <div className="w-12 h-0.5 bg-rose-300 rounded-full" />
                </div>
              </div>
            </div>

            {/* Footer decorativo */}
            <div className="bg-rose-100 p-4 text-center">
              <p className="text-sm text-rose-700 font-medium">
                Com amor 💕
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SurpriseLetter;
