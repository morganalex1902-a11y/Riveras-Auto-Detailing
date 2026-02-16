import { Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import GoldButton from "@/components/GoldButton";
import GalleryLightbox from "@/components/GalleryLightbox";
import heroBg from "@/assets/hero-bg.jpg";
import ctaBg from "@/assets/cta-bg.jpg";

const services = [
  { title: "N/C Delivery", price: "$35.00", desc: "Professional prep before delivery." },
  { title: "U/C Delivery", price: "$25.00", desc: "Under-car detailing & presentation." },
  { title: "U/C Detail", price: "$120.00", desc: "Thorough undercarriage cleaning." },
  { title: "Tint Removal", price: "$75.00", desc: "Clean removal without damage." },
  { title: "Showroom Preparation", price: "$40.00", desc: "High-level presentation detailing." },
  { title: "Lot Wash", desc: "Routine dealership maintenance wash.", complementaryNote: "Complimentary with monthly contract" },
];

const steps = [
  { num: "01", title: "Schedule Service", desc: "Contact us to schedule your dealership detailing needs." },
  { num: "02", title: "We Detail & Prepare", desc: "Our team delivers high-volume, dealer-grade detailing on site." },
  { num: "03", title: "Front-Line Ready", desc: "Every vehicle returned showroom-ready and delivery-perfect." },
];

const Index = () => {
  const [showCertificate, setShowCertificate] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const certificateImages = [
    {
      src: "https://cdn.builder.io/api/v1/image/assets%2F00cdbed89d7445f5b4360faac26e9e3f%2F01c620b487a54185b48d67db8b5326a5?format=webp&width=800&height=1200",
      alt: "State of Maryland Articles of Organization Certificate"
    }
  ];

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
              Your{" "}
              <span className="gold-gradient-text">Dealership Detailing</span>{" "}
              Solution
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 font-light tracking-wide">
              High-Volume Dealer-Focused Detailing. Precision. Speed. Consistency.
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
          <SectionHeading title="Our Services" subtitle="High-volume dealership detailing solutions built for speed, consistency, and presentation." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.1}>
                <div className="glass-card p-8 group hover:border-primary/50 transition-all duration-300">
                  <div className="w-10 h-[2px] bg-primary mb-4 group-hover:w-16 transition-all duration-300" />
                  <div className="flex items-baseline gap-3 mb-2">
                    <h3 className="font-display text-xl uppercase tracking-wider text-foreground">
                      {s.title}
                    </h3>
                    {s.price && <span className="text-primary font-semibold whitespace-nowrap">{s.price}</span>}
                  </div>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                  {s.complementaryNote && (
                    <p className="text-primary text-xs font-medium mt-3 italic">{s.complementaryNote}</p>
                  )}
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
          <SectionHeading title="How Our Dealership Detailing Works" />
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

      {/* OFFICIAL STATEMENT */}
      <section className="section-darker py-20 md:py-28">
        <div className="container max-w-4xl">
          <SectionHeading
            title="Officially Licensed & Certified"
            subtitle="Your trusted dealership detailing partner in the DMV Area"
          />
          <AnimatedSection>
            <div className="glass-card p-8 md:p-12">
              <div className="flex flex-col items-center">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F00cdbed89d7445f5b4360faac26e9e3f%2F01c620b487a54185b48d67db8b5326a5?format=webp&width=800&height=1200"
                  alt="State of Maryland Articles of Organization Certificate"
                  className="w-full max-w-md rounded-lg shadow-lg border border-primary/20 mb-8 cursor-pointer hover:shadow-xl hover:border-primary/50 transition-all duration-300"
                  onClick={() => setShowCertificate(true)}
                />
                <div className="text-center">
                  <h3 className="font-display text-2xl uppercase tracking-wider mb-3">Rivera's Auto Detailing, LLC</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Officially registered with the State of Maryland, Department of Assessments and Taxation.
                    Our company is fully licensed and authorized to provide dealership detailing solutions
                    to automotive retail operations throughout the DMV Area.
                  </p>
                  <div className="w-20 h-[2px] bg-primary mx-auto" />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 md:py-36">
        <img src={ctaBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/85" />
        <AnimatedSection className="container relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-display uppercase tracking-wider mb-8">
            Ready for a <span className="gold-gradient-text">Dealership Detailing</span> Partner?
          </h2>
          <GoldButton to="/contact" className="animate-glow-pulse">
            Partner With Us Today
          </GoldButton>
        </AnimatedSection>
      </section>

      {/* Certificate Lightbox */}
      {showCertificate && (
        <GalleryLightbox
          images={certificateImages}
          currentIndex={0}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </main>
  );
};

export default Index;
