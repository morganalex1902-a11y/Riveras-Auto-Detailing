import { Phone } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import GoldButton from "@/components/GoldButton";

const MobileDetailingSection = () => {
  return (
    <>
      {/* Optional divider text */}
      <div className="relative py-2">
        <div className="container text-center">
          <AnimatedSection>
            <p className="text-sm md:text-base text-muted-foreground font-light tracking-wide">
              Also offering professional Mobile Auto Detailing
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Mobile Detailing Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-background via-background to-secondary/20">
        <div className="container max-w-3xl">
          <AnimatedSection className="text-center mb-6">
            <p className="text-sm uppercase tracking-widest text-primary font-display mb-2">
              Premium Mobile Auto Detailing We Come to You
            </p>
            <h2 className="text-3xl md:text-5xl font-display uppercase tracking-wider mb-4">
              Need Mobile Detailing?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-6">
              WYour car deserves more than a quick wash. We deliver professional, high-quality detailing right at your home or office — saving you time while restoring that showroom shine.
              No waiting rooms. No lines. Just convenience and exceptional results.
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
          <AnimatedSection delay={0.2} className="mt-6">
            <div className="glass-card p-4 md:p-6 text-center">
              <h3 className="font-display text-xl uppercase tracking-wider mb-3">
                Ready to Transform Your Vehicle?
              </h3>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed flex justify-center item-center">
                📅 Book your appointment today.

                📍 We come to your home or workplace.

                📞 Call or text now for a fast quote.

                Your car will thank you.
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
