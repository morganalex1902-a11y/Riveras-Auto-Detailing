import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import GalleryLightbox from "@/components/GalleryLightbox";

import galleryInterior from "@/assets/gallery-interior-clean.png";
import galleryVacuum from "@/assets/gallery-vacuum.png";
import galleryPolish from "@/assets/gallery-polish.png";
import galleryBeforeAfter from "@/assets/gallery-before-after.png";
import galleryInteriorBa from "@/assets/gallery-interior-ba.png";
import galleryDealership from "@/assets/gallery-dealership.png";
import gallerySeatsBa from "@/assets/gallery-seats-ba.png";
import galleryWorkFord from "@/assets/gallery-work-ford.png";
import galleryShop from "@/assets/gallery-shop.png";

const images = [
  { src: galleryBeforeAfter, alt: "Before and after exterior detail" },
  { src: galleryInteriorBa, alt: "Before and after interior detail" },
  { src: gallerySeatsBa, alt: "Seat cleaning before and after" },
  { src: galleryPolish, alt: "Paint polishing" },
  { src: galleryVacuum, alt: "Interior vacuuming" },
  { src: galleryInterior, alt: "Clean interior result" },
  { src: galleryWorkFord, alt: "On-site dealership work" },
  { src: galleryShop, alt: "Detailing shop" },
  { src: galleryDealership, alt: "Dealership partner" },
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <main className="pt-20">
      <section className="py-20 md:py-28">
        <div className="container">
          <SectionHeading title="Gallery" subtitle="See the results of our precision detailing work." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <motion.div
                key={i}
                className="relative overflow-hidden group aspect-[4/3] bg-card cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                onClick={() => setSelectedImage(i)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {selectedImage !== null && (
        <GalleryLightbox
          images={images}
          currentIndex={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </main>
  );
};

export default Gallery;
