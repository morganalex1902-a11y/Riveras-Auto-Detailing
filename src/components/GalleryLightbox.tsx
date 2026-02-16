import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryLightboxProps {
  images: Array<{ src: string; alt: string }>;
  currentIndex: number;
  onClose: () => void;
}

const GalleryLightbox = ({ images, currentIndex, onClose }: GalleryLightboxProps) => {
  const [index, setIndex] = useState(currentIndex);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, onClose]);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Main image container */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.img
            key={index}
            src={images[index].src}
            alt={images[index].alt}
            className="max-w-full sm:max-w-4xl max-h-[85vh] sm:max-h-[90vh] object-contain px-4 sm:px-0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          />

          {/* Close button */}
          <motion.button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-6 sm:right-6 p-1.5 sm:p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Close lightbox"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </motion.button>

          {/* Previous button */}
          <motion.button
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Previous image"
          >
            <ChevronLeft size={20} className="sm:w-7 sm:h-7" />
          </motion.button>

          {/* Next button */}
          <motion.button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Next image"
          >
            <ChevronRight size={20} className="sm:w-7 sm:h-7" />
          </motion.button>

          {/* Image counter and title */}
          <motion.div
            className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 text-center text-white px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xs sm:text-sm font-medium line-clamp-2">{images[index].alt}</p>
            <p className="text-xs text-white/60 mt-1">
              {index + 1} / {images.length}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GalleryLightbox;
