import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import galleryPolish from "@/assets/gallery-polish.png";

const faqs = [
  { q: "What kind of dealerships do you work with?", a: "We partner with franchise and independent dealerships across the DMV Area, including Toyota, Ford, Honda, Mazda, Dodge, Lincoln, Hyundai, and Nissan operations." },
  { q: "How does your dealership detailing solution work?", a: "We operate as a dedicated third-party detailing vendor on your lot. Our team handles high-volume prep, delivery details, reconditioning, and lot maintenance with structured workflow and quality control." },
  { q: "What is your turnaround time?", a: "Full detailing is completed within 24 hours and delivery turnaround is 30 minutes or less. We understand that speed moves inventory." },
  { q: "Do you provide your own insurance and staffing?", a: "Yes. We carry our own comprehensive insurance covering all services, detailers, and vehicles. We handle all staffing, training, and management — no payroll or overtime costs for your dealership." },
  { q: "Can you scale for high-volume needs?", a: "Absolutely. Our systems are built around dealership workflow and operational efficiency. We offer scalable volume capability with consistent staffing and reliable turnaround." },
  { q: "Do you offer recurring lot wash services?", a: "Yes, complimentary lot wash services are included with monthly dealership contracts to keep your inventory presentation-ready at all times." },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="pt-16">
      <section className="relative py-16 md:py-20">
        <img src={galleryPolish} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/70" />
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
