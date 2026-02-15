import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import galleryPolish from "@/assets/gallery-polish.png";

const faqs = [
  { q: "Do you provide dealership services?", a: "Yes, we specialize in dealership preparation and lot services." },
  { q: "What is included in Showroom Preparation?", a: "Full detailing, presentation polish, interior refinement, and final inspection." },
  { q: "How long does detailing take?", a: "Depends on vehicle condition and service type. We'll provide an estimate after assessment." },
  { q: "Do you offer recurring lot wash services?", a: "Yes, complementary lot wash services are available on a recurring basis." },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="pt-20">
      <section className="relative py-20 md:py-28">
        <img src={galleryPolish} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/92" />
        <div className="container relative z-10 max-w-3xl">
          <SectionHeading title="Frequently Asked Questions" />
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-6 text-left"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span className="font-display text-lg uppercase tracking-wider pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="px-6 pb-6 text-muted-foreground leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default FAQ;
