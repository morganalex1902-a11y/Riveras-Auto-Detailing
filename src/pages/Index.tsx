import { Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import GoldButton from "@/components/GoldButton";
import heroBg from "@/assets/hero-bg.jpg";
import ctaBg from "@/assets/cta-bg.jpg";

const services = [
  { title: "N/C Delivery", desc: "Professional prep before delivery." },
  { title: "U/C Delivery", desc: "Under-car detailing & presentation." },
  { title: "U/C Detail", desc: "Thorough undercarriage cleaning." },
  { title: "Tint Removal", desc: "Clean removal without damage." },
  { title: "Showroom Preparation", desc: "High-level presentation detailing." },
  { title: "Lot Wash", desc: "Routine dealership maintenance wash." },
];

const steps = [
  { num: "01", title: "Schedule Service", desc: "Contact us to book your detailing appointment." },
  { num: "02", title: "We Detail & Prepare", desc: "Our team delivers precision detailing." },
  { num: "03", title: "Showroom Ready", desc: "Vehicle delivered in pristine condition." },
];

const Index = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <main>
      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <motion.img
          src={heroBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ y: heroY, scale: heroScale }}
        />
        <div className="image-overlay" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="container relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display uppercase tracking-wider leading-tight mb-6">
              Professional Auto Detailing in{" "}
              <span className="gold-gradient-text">Maryland</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 font-light tracking-wide">
              Precision. Presentation. Showroom-Level Results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <GoldButton href="tel:3239948612">
                <Phone className="w-4 h-4" />
                Call Now – 323-994-8612
              </GoldButton>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-3.5 border border-primary text-primary font-display uppercase text-sm tracking-widest hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                Request Service
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <SectionHeading title="Our Services" subtitle="Dealer-grade detailing services tailored for excellence." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.1}>
                <div className="glass-card p-8 group hover:border-primary/50 transition-all duration-300">
                  <div className="w-10 h-[2px] bg-primary mb-4 group-hover:w-16 transition-all duration-300" />
                  <h3 className="font-display text-xl uppercase tracking-wider mb-2 text-foreground">
                    {s.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <div className="text-center mt-10">
            <GoldButton to="/services">View All Services</GoldButton>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 md:py-28">
        <div className="container">
          <SectionHeading title="Built for Dealers & High-Standard Clients" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <AnimatedSection key={step.num} delay={i * 0.15}>
                <div className="text-center">
                  <span className="text-5xl font-display gold-gradient-text">{step.num}</span>
                  <h3 className="font-display text-xl uppercase tracking-wider mt-4 mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 md:py-36">
        <img src={ctaBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/85" />
        <AnimatedSection className="container relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-display uppercase tracking-wider mb-8">
            Ready for <span className="gold-gradient-text">Showroom-Level</span> Results?
          </h2>
          <GoldButton to="/contact" className="animate-glow-pulse">
            Book Service Today
          </GoldButton>
        </AnimatedSection>
      </section>
    </main>
  );
};

export default Index;
