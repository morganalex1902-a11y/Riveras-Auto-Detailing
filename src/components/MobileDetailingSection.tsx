import { Phone } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import GoldButton from "@/components/GoldButton";

const MobileDetailingSection = () => {
  return (
    <>
      {/* Optional divider text */}
      <div className="relative py-8">
        <div className="container text-center">
          <AnimatedSection>
            <p className="text-sm md:text-base text-muted-foreground font-light tracking-wide">
              Also offering professional Mobile Auto Detailing
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Mobile Detailing Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background via-background to-secondary/20">
        <div className="container max-w-3xl">
          <AnimatedSection className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-primary font-display mb-2">
              Bringing Detailing to You
            </p>
            <h2 className="text-3xl md:text-5xl font-display uppercase tracking-wider mb-6">
              Need Mobile Detailing?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-8">
              We come to you for professional interior and exterior detailing. Fast, reliable, and fully mobile.
            </p>
            <div className="w-16 h-[2px] bg-primary mx-auto" />
          </AnimatedSection>

          {/* Buttons Grid */}
          <AnimatedSection delay={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GoldButton href="tel:3239948612">
              <Phone className="w-4 h-4" />
              Call for Detailing
            </GoldButton>
            <GoldButton to="/service-area">
              Service Area
            </GoldButton>
          </AnimatedSection>

          {/* Additional CTA with glass card styling */}
          <AnimatedSection delay={0.2} className="mt-12">
            <div className="glass-card p-8 md:p-10 text-center">
              <h3 className="font-display text-xl uppercase tracking-wider mb-3">
                Professional Mobile Detailing
              </h3>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                From fleet vehicles to personal cars, our mobile detailing service brings showroom-quality results directly to your location.
              </p>
              <p className="text-primary font-display uppercase text-sm tracking-widest">
                Available in the DMV Area
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default MobileDetailingSection;
