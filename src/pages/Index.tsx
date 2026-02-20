import { Phone, DollarSign, RefreshCw, Target, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import GoldButton from "@/components/GoldButton";
import GalleryLightbox from "@/components/GalleryLightbox";
import MobileDetailingSection from "@/components/MobileDetailingSection";
import contactBg from "@/assets/contact-bg.jpg";
import ctaBg from "@/assets/cta-bg.jpg";

const services = [
  { title: "N/C Delivery", desc: "Professional prep before delivery. Full interior and exterior presentation to dealership-ready standards." },
  { title: "U/C Delivery", desc: "Professional prep before delivery. Full interior and exterior presentation to dealership-ready standards." },
  { title: "U/C Detail", desc: "Reconditioning pre-owned vehicles to their best possible condition. Improving appearance, value, and buyer appeal." },
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
        <img src="https://cdn.builder.io/api/v1/image/assets%2F00cdbed89d7445f5b4360faac26e9e3f%2F4fc77d9c7fda494bba8bc0b32d119427?format=webp&width=800&height=1200" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/70" />
        <div className="container relative z-10 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display uppercase tracking-wider leading-tight mb-2">
              Your{" "}
              <span className="gold-gradient-text">Dealership Detailing</span>{" "}
              Solution
            </h1>
            <p className="text-xl md:text-2xl font-display uppercase tracking-wider mb-3">
              <span className="gold-gradient-text">supporting  dealership operations with structured vehicle reconditioning solutions</span>
            </p>
            <p className="text-lg md:text-xl text-muted-foreground mb-4 font-light tracking-wide">
              The best prices and solutions for dealerships. Quality. Speed. Consistency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <GoldButton href="tel:3239948612">
                <Phone className="w-4 h-4" />
                Call Now – 323-994-8612
              </GoldButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MOBILE DETAILING */}
      <MobileDetailingSection />

      {/* SERVICES PREVIEW */}
      <section className="section-darker py-12 md:py-16">
        <div className="container">
          <SectionHeading title="Dealer Services" subtitle="High-volume dealership detailing solutions built for speed, consistency, and presentation." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.1}>
                <div className="glass-card p-4 group hover:border-primary/50 transition-all duration-300 flex flex-col justify-between h-full">
                  <div>
                    <div className="w-10 h-[2px] bg-primary mb-2 group-hover:w-16 transition-all duration-300" />
                    <h3 className="font-display text-xl uppercase tracking-wider text-foreground mb-1">
                      {s.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{s.desc}</p>
                  </div>
                  <div className="mt-3">
                    <GoldButton href="tel:3239948612">Get Quote</GoldButton>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <div className="text-center mt-6">
            <GoldButton to="/services">View All Services</GoldButton>
          </div>
        </div>
      </section>

      {/* WHY DEALERSHIPS CHOOSE US */}
      <section className="py-12 md:py-16">
        <div className="container">
          <SectionHeading title="Why Dealerships Choose Us" subtitle="We deliver the most competitive pricing and tailored solutions." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <div className="glass-card p-4 text-center group hover:border-primary/50 transition-all duration-300">
                  <item.icon className="w-10 h-10 text-primary mx-auto mb-2" />
                  <h3 className="font-display text-xl uppercase tracking-wider mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section-darker py-12 md:py-16">
        <div className="container">
          <SectionHeading title="How Our Dealership Detailing Works" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {steps.map((step, i) => (
              <AnimatedSection key={step.num} delay={i * 0.15}>
                <div className="text-center">
                  <span className="text-5xl font-display gold-gradient-text">{step.num}</span>
                  <h3 className="font-display text-xl uppercase tracking-wider mt-2 mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* OFFICIAL STATEMENT */}
      <section className="section-darker py-12 md:py-16">
        <div className="container max-w-4xl">
          <SectionHeading
            title="Officially Licensed & Certified"
            subtitle="Your trusted dealership detailing partner in the DMV Area"
          />
          <AnimatedSection>
            <div className="glass-card p-4 md:p-8">
              <div className="flex flex-col items-center">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F00cdbed89d7445f5b4360faac26e9e3f%2F01c620b487a54185b48d67db8b5326a5?format=webp&width=800&height=1200"
                  alt="State of Maryland Articles of Organization Certificate"
                  className="w-full max-w-md rounded-lg shadow-lg border border-primary/20 mb-4 cursor-pointer hover:shadow-xl hover:border-primary/50 transition-all duration-300"
                  onClick={() => setShowCertificate(true)}
                />
                <div className="text-center">
                  <h3 className="font-display text-2xl uppercase tracking-wider mb-1">Rivera's Auto Detailing, LLC</h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
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
      <section className="relative py-12 md:py-16">
        <img src={ctaBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/70" />
        <AnimatedSection className="container relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-display uppercase tracking-wider mb-4">
            Ready for a <span className="gold-gradient-text">Dealership Detailing</span> Partner?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GoldButton href="tel:3239948612">
              Call Now – (323) 994-8612
            </GoldButton>
            <a
              href="https://api.whatsapp.com/send?phone=13239948612"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-3.5 font-display uppercase text-sm tracking-widest hover:bg-green-700 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]"
            >
              <MessageCircle className="w-4 h-4" />
              Schedule or Text Directly to WhatsApp
            </a>
          </div>
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
