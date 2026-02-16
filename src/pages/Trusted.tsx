import { CheckCircle, MapPin, Phone } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import GoldButton from "@/components/GoldButton";
import galleryWork from "@/assets/gallery-work-ford.png";

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

const solutions = [
  "Increase resale value",
  "Reduce turnaround time",
  "Enhance showroom presentation",
  "Maintain front-line inventory standards",
  "Support reconditioning departments",
  "Improve delivery satisfaction",
];

const differentiators = [
  "9 Years of Dedicated Dealer Service Experience",
  "Structured Workflow & Process Control",
  "Reliable Turnaround Times",
  "Consistent Staffing",
  "Scalable Volume Capability",
  "Accountability & Quality Assurance",
];

const Trusted = () => (
  <main className="pt-20">
    {/* Hero */}
    <section className="relative py-20 md:py-28">
      <img src={galleryWork} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-background/90" />
      <div className="container relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-display uppercase tracking-wider gold-gradient-text mb-4">
          Dealer-Focused Detailing Solutions
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide mt-4">
          Your Trusted Dealership Detailing Partner
        </p>
        <div className="gold-border-line max-w-[120px] mx-auto mt-6" />
      </div>
    </section>

    {/* Intro */}
    <section className="section-darker py-20 md:py-28">
      <div className="container max-w-4xl">
        <AnimatedSection>
          <div className="glass-card p-8 md:p-12">
            <div className="space-y-6 text-center">
              <p className="text-muted-foreground text-lg leading-relaxed">
                Rivera's Auto Detailing is a professional, dealership-focused detailing partner — not just a car cleaner.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We operate as a dedicated third-party vendor providing high-volume detailing solutions designed specifically for automotive retail operations.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                With 9 years of experience in dealer services, we understand the speed, consistency, and presentation standards required to keep inventory front-line ready and delivery-perfect.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* Proven Performance & Experience */}
    <section className="py-20 md:py-28">
      <div className="container max-w-4xl">
        <SectionHeading
          title="Proven Performance & Experience"
          subtitle="Our team has supported operations for:"
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
        <AnimatedSection delay={0.7}>
          <p className="text-muted-foreground text-center mt-10 leading-relaxed">
            Our long-term relationships reflect reliability, turnaround efficiency, and consistent quality control.
          </p>
        </AnimatedSection>
      </div>
    </section>

    {/* Dealership Detailing Solutions */}
    <section className="section-darker py-20 md:py-28">
      <div className="container max-w-4xl">
        <SectionHeading
          title="Dealership Detailing Solutions"
          subtitle="We specialize in high-volume, dealership-focused auto detailing designed to:"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {solutions.map((item, i) => (
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
        <AnimatedSection delay={0.6}>
          <p className="text-muted-foreground text-center mt-10 leading-relaxed">
            From lot prep to final delivery detail, our systems are built around dealership workflow and operational efficiency.
          </p>
        </AnimatedSection>
      </div>
    </section>

    {/* What Sets Us Apart */}
    <section className="py-20 md:py-28">
      <div className="container max-w-4xl">
        <SectionHeading title="What Sets Us Apart" />
        <div className="space-y-6">
          {differentiators.map((item, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <div className="glass-card p-6 md:p-8">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                  <p className="text-foreground text-lg leading-relaxed">{item}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
        <AnimatedSection delay={0.5}>
          <p className="text-muted-foreground text-center mt-10 leading-relaxed italic">
            We understand that presentation sells vehicles — and speed moves inventory.
          </p>
        </AnimatedSection>
      </div>
    </section>

    {/* Partner CTA */}
    <section className="section-darker py-20 md:py-28">
      <div className="container max-w-4xl">
        <SectionHeading title="Partner With a Reliable Detailing Vendor" />
        <AnimatedSection>
          <div className="glass-card p-8 md:p-12 text-center">
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              If you're looking for a professional detailing operation that understands dealership pace, expectations, and performance standards, Rivera's Auto Detailing delivers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-foreground">
                <MapPin className="w-5 h-5 text-primary" />
                <span>6828 Barton Rd, Hyattsville, MD 20784</span>
              </div>
              <a href="tel:3239948612" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                <Phone className="w-5 h-5 text-primary" />
                <span>(323) 994-8612</span>
              </a>
            </div>
            <GoldButton to="/contact">Get in Touch</GoldButton>
          </div>
        </AnimatedSection>
      </div>
    </section>
  </main>
);

export default Trusted;
