import { Phone, DollarSign, RefreshCw, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import GoldButton from "@/components/GoldButton";
import GalleryLightbox from "@/components/GalleryLightbox";
import contactBg from "@/assets/contact-bg.jpg";
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
  { num: "01", title: "Schedule Service", desc: "Contact us to schedule your dealership detailing needs." },
  { num: "02", title: "We Detail & Prepare", desc: "Our team delivers high-volume, dealer-grade detailing on site." },
  { num: "03", title: "Front-Line Ready", desc: "Every vehicle returned showroom-ready and delivery-perfect." },
];

const Index = () => {
  const [showCertificate, setShowCertificate] = useState(false);

  const certificateImages = [
    {
      src: "https://cdn.builder.io/api/v1/image/assets%2F00cdbed89d7445f5b4360faac26e9e3f%2F01c620b487a54185b48d67db8b5326a5?format=webp&width=800&height=1200",
      alt: "State of Maryland Articles of Organization Certificate"
    }
  ];

  return (
    <main>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <img src={contactBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/95" />
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
            <p className="text-xl md:text-2xl font-display uppercase tracking-wider mb-4">
              <span className="gold-gradient-text">Driving Success for Every Dealership.</span>
            </p>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 font-light tracking-wide">
              The best prices and solutions for dealerships. Precision. Speed. Consistency.
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
                <div className="glass-card p-8 group hover:border-primary/50 transition-all duration-300 flex flex-col justify-between h-full">
                  <div>
                    <div className="w-10 h-[2px] bg-primary mb-4 group-hover:w-16 transition-all duration-300" />
                    <h3 className="font-display text-xl uppercase tracking-wider text-foreground mb-3">
                      {s.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{s.desc}</p>
                  </div>
                  <div className="mt-6">
                    <GoldButton to="/contact">Get Quote</GoldButton>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <div className="text-center mt-10">
            <GoldButton to="/services">View All Services</GoldButton>
          </div>
        </div>
      </section>

      {/* WHY DEALERSHIPS CHOOSE US */}
      <section className="py-20 md:py-28">
        <div className="container">
          <SectionHeading title="Why Dealerships Choose Us" subtitle="We deliver the most competitive pricing and tailored solutions directly to your dealership." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: DollarSign,
                title: "Increase Perceived Value",
                desc: "Professional detailing increases perceived value and helps justify pricing. Presentation sells vehicles.",
              },
              {
                icon: RefreshCw,
                title: "Volume Capability",
                desc: "We handle fleet and high-volume operations efficiently. Scalable detailing built around your dealership's pace.",
              },
              {
                icon: Target,
                title: "Consistent Quality Standards",
                desc: "Every vehicle delivered to showroom standards. Reliable turnaround and quality assurance on every single job.",
              },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.15}>
                <div className="glass-card p-8 text-center group hover:border-primary/50 transition-all duration-300">
                  <item.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-display text-xl uppercase tracking-wider mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section-darker py-20 md:py-28">
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
        <div className="absolute inset-0 bg-background/95" />
        <AnimatedSection className="container relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-display uppercase tracking-wider mb-8">
            Ready for a <span className="gold-gradient-text">Dealership Detailing</span> Partner?
          </h2>
          <GoldButton href="tel:3239948612">
            Call Now – (323) 994-8612
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
