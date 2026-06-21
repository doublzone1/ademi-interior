import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  imageUrl: string | null;
  onClose: () => void;
}

export function Lightbox({ imageUrl, onClose }: Props) {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!imageUrl) return;
    setZoom(1);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(z + 0.25, 3));
      if (e.key === '-') setZoom((z) => Math.max(z - 0.25, 1));
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [imageUrl, onClose]);

  return (
    <AnimatePresence>
      {imageUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          onClick={onClose}
        >
          <div
            className="absolute top-4 right-4 flex gap-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.25, 1))}
              className="icon-btn !bg-white/10 hover:!bg-white/20 text-white"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
              className="icon-btn !bg-white/10 hover:!bg-white/20 text-white"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="icon-btn !bg-white/10 hover:!bg-white/20 text-white"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: zoom, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            src={imageUrl}
            alt=""
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
