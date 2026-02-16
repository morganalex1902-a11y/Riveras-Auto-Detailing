import { CheckCircle } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import GoldButton from "@/components/GoldButton";
import galleryWork from "@/assets/gallery-work-ford.png";

const whyChooseUs = [
  "Always fully staffed and ready to serve",
  "Full detailing completed within 24 hours",
  "Delivery turnaround in 30 minutes or less",
  "Relentless attention to detail on every single job",
];

const trustedPartners = [
  "Mazda / Mitsubishi – Fitz Auto Mall",
  "Toyota Certified at Capital Plaza",
  "Upper Marlboro Ford",
  "Waldorf Dodge Ram",
  "East West Lincoln",
  "Honda Waldorf",
  "Pohanka Honda",
  "Ourisman of Laurel Mazda Mitsubishi",
  "Ourisman of Laurel Hyundai Nissan",
];

const Trusted = () => (
  <main className="pt-20">
    {/* Hero */}
    <section className="relative py-20 md:py-28">
      <img src={galleryWork} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-background/90" />
      <div className="container relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-display uppercase tracking-wider gold-gradient-text mb-4">
          Professional Automotive Detailing Services
        </h1>
        <div className="gold-border-line max-w-[120px] mx-auto" />
      </div>
    </section>

    {/* Intro */}
    <section className="section-darker py-20 md:py-28">
      <div className="container max-w-4xl">
        <AnimatedSection>
          <div className="glass-card p-8 md:p-12 text-center">
            <p className="text-muted-foreground text-lg leading-relaxed">
              We deliver high-quality, reliable automotive detailing services with precision, speed, and consistency. Our commitment is simple: excellence on every vehicle, every time.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="py-20 md:py-28">
      <div className="container max-w-4xl">
        <SectionHeading title="Why Choose Us?" />
        <div className="space-y-6">
          {whyChooseUs.map((item, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className="glass-card p-6 md:p-8">
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                  <p className="text-foreground text-lg leading-relaxed">{item}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
        <AnimatedSection delay={0.4}>
          <p className="text-muted-foreground text-center mt-10 leading-relaxed">
            We take pride in maintaining the highest standards of service and ensuring every vehicle leaves looking its absolute best.
          </p>
        </AnimatedSection>
      </div>
    </section>

    {/* Trusted By */}
    <section className="section-darker py-20 md:py-28">
      <div className="container max-w-4xl">
        <SectionHeading
          title="Trusted By"
          subtitle="We are proud to have provided services for:"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trustedPartners.map((partner, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <div className="glass-card p-6 md:p-8 group hover:border-primary/50 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-[2px] bg-primary group-hover:w-16 transition-all duration-300" />
                  <h3 className="font-display text-lg uppercase tracking-wider text-foreground">
                    {partner}
                  </h3>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
        <div className="text-center mt-12">
          <GoldButton to="/contact">Get in Touch</GoldButton>
        </div>
      </div>
    </section>
  </main>
);

export default Trusted;
