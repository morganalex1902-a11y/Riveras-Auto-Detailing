import { Star } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import GoldButton from "@/components/GoldButton";
import heroBg from "@/assets/hero-bg.jpg";

const reviews = [
  { name: "Mike T.", text: "Rivera's team made our entire lot look brand new. Professional, fast, and consistent. Highly recommend for any dealership." },
  { name: "Sarah L.", text: "The best detailing service in Maryland. Every vehicle comes back showroom-ready. We've been using them for months." },
  { name: "James R.", text: "Outstanding attention to detail. They handle our new and used car prep flawlessly. True professionals." },
  { name: "Angela M.", text: "Reliable, high-quality work every single time. Rivera's Auto Detailing is our go-to for all dealership prep services." },
];

const Testimonials = () => (
  <main className="pt-20">
    <section className="relative py-20 md:py-28">
      <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-background/90" />
      <div className="container relative z-10">
        <SectionHeading title="What Our Clients Say" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              className="glass-card p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/90 italic mb-4 leading-relaxed">"{r.text}"</p>
              <p className="text-primary font-display uppercase tracking-wider text-sm">— {r.name}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <GoldButton to="/contact">Schedule Your Detail</GoldButton>
        </div>
      </div>
    </section>
  </main>
);

export default Testimonials;
