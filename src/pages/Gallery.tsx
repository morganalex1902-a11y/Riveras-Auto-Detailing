import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import GalleryLightbox from "@/components/GalleryLightbox";

import galleryVacuum from "@/assets/gallery-vacuum.png";
import galleryPolish from "@/assets/gallery-polish.png";

const images = [
  { src: galleryPolish, alt: "Paint polishing" },
  { src: galleryVacuum, alt: "Interior vacuuming" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2F00cdbed89d7445f5b4360faac26e9e3f%2Ff2573294973441698c1249e2312f2ef5?format=webp&width=800&height=1200", alt: "Professional car wash with foam" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2F00cdbed89d7445f5b4360faac26e9e3f%2Ff928e68e5f314df98cfb2de44bc0cf86?format=webp&width=800&height=1200", alt: "Detailing work in progress" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2F00cdbed89d7445f5b4360faac26e9e3f%2Fa8b0c7f61a1541a6a558d861eaf63039?format=webp&width=800&height=1200", alt: "Premium car detailing service" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2F00cdbed89d7445f5b4360faac26e9e3f%2F641ef59495384426863298fdd68683eb?format=webp&width=800&height=1200", alt: "High-pressure wash detailing" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2F00cdbed89d7445f5b4360faac26e9e3f%2F2566128271164a0198f95dc98e785f55?format=webp&width=800&height=1200", alt: "Professional interior cleaning" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2F00cdbed89d7445f5b4360faac26e9e3f%2Fa52be96e5d1d44d8aaccec096c3b8c34?format=webp&width=800&height=1200", alt: "Expert car washing technique" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2F00cdbed89d7445f5b4360faac26e9e3f%2F8282d05bb0b14c198d9f5848e3cc4c13?format=webp&width=800&height=1200", alt: "Modern detailing facility" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2F00cdbed89d7445f5b4360faac26e9e3f%2F25672360d7804b2989eb6a25ff59d76c?format=webp&width=800&height=1200", alt: "Premium washing service" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2F00cdbed89d7445f5b4360faac26e9e3f%2Fbd4a9d5059f94b55aeecf70d8d9cd00d?format=webp&width=800&height=1200", alt: "Interior detail work" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2F00cdbed89d7445f5b4360faac26e9e3f%2F65968102b2f14e4ca303c38b40168221?format=webp&width=800&height=1200", alt: "Professional hand detailing" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2F00cdbed89d7445f5b4360faac26e9e3f%2F35c9b58a4578431a8d0c9e0f65880033?format=webp&width=800&height=1200", alt: "Interior steam cleaning service" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2F00cdbed89d7445f5b4360faac26e9e3f%2F660192ee38c84f74b2855f666759b65b?format=webp&width=800&height=1200", alt: "Dashboard and interior detailing" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2F00cdbed89d7445f5b4360faac26e9e3f%2F9a3be73a490c4a4fa41d19401714b19b?format=webp&width=800&height=1200", alt: "Upholstery cleaning and sanitization" },
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <main className="pt-12">
      <section className="py-12 md:py-16">
        <div className="container">
          <SectionHeading title="Gallery" subtitle="See the results of our dealership detailing solutions in action." />
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
