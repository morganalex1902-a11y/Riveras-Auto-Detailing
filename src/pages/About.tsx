import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import GoldButton from "@/components/GoldButton";
import galleryWork from "@/assets/gallery-work-ford.png";

const About = () => (
  <main className="pt-20">
    {/* Hero */}
    <section className="relative py-20 md:py-28">
      <img src={galleryWork} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-background/90" />
      <div className="container relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-display uppercase tracking-wider gold-gradient-text mb-4">
          Detailing Built on Precision
        </h1>
        <div className="gold-border-line max-w-[120px] mx-auto" />
      </div>
    </section>

    <section className="section-darker py-20 md:py-28">
      <div className="container max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[
            { title: "Experience", desc: "Years of hands-on detailing experience serving top dealerships and private clients throughout the DMV, DC, Maryland, and Virginia." },
            { title: "Attention to Detail", desc: "Every vehicle receives meticulous care — from panel gaps to wheel wells, nothing is overlooked." },
            { title: "Dealer-Focused Service", desc: "We specialize in high-volume dealership preparation, ensuring every unit is showroom ready." },
            { title: "Commitment to Presentation", desc: "Our work speaks for itself. We deliver vehicles that exceed expectations every time." },
          ].map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 0.1}>
              <div className="glass-card p-8">
                <div className="w-10 h-[2px] bg-primary mb-4" />
                <h3 className="font-display text-xl uppercase tracking-wider mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
        <div className="text-center mt-12">
          <GoldButton to="/contact">Get in Touch</GoldButton>
        </div>
      </div>
    </section>

    {/* Our Mission Section */}
    <section className="py-20 md:py-28">
      <div className="container max-w-4xl">
        <SectionHeading title="Our Mission" subtitle="" />
        <div className="space-y-6">
          {[
            "Provide the best service to our clients to keep the Prestige of your brand.",
            "Commitment to keep the highest standards for our services in every vehicle we clean.",
            "Use the best and highest quality chemicals that warrants satisfaction to our customers.",
            "Always have a manager on duty to inspect and approve the service quality.",
            "Expertise in every single detailer.",
          ].map((item, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <div className="glass-card p-6 md:p-8">
                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground leading-relaxed">{item}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* Why Outsourcing Section */}
    <section className="section-darker py-20 md:py-28">
      <div className="container max-w-4xl">
        <SectionHeading title="Why Outsourcing" subtitle="Dealers save on:" />
        <div className="space-y-6">
          {[
            { title: "Liability", desc: "We provide our own insurance that covers our services and detailers" },
            { title: "Efficiency", desc: "Our staff are well trained" },
            { title: "Responsibility", desc: "We take responsibility for mistakes and correct them" },
            { title: "Overtime Costs", desc: "No need to pay overtime to your own staff" },
          ].map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 0.08}>
              <div className="glass-card p-6 md:p-8">
                <div className="w-10 h-[2px] bg-primary mb-4" />
                <h3 className="font-display text-lg uppercase tracking-wider mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>

    {/* Why Us Section */}
    <section className="py-20 md:py-28">
      <div className="container max-w-4xl">
        <SectionHeading title="Why Us" subtitle="" />
        <div className="space-y-6">
          {[
            "We are a committed Company with more than 12 years of experience serving Car Dealers throughout the DMV, DC, Maryland, and Virginia. Brands like: Mercedes Benz, Lexus, Toyota, Ford, Nissan, and more.",
            "We know what it takes to serve Brands that expect high standards and quality labor.",
            "We offer quality over quantity respecting all services.",
            "Our garages, cars and detailers are covered under our insurance policy.",
            "Our staff are required to look professional.",
            "Manager on duty every single day we operate.",
          ].map((item, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <div className="glass-card p-6 md:p-8">
                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground leading-relaxed">{item}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  </main>
);

export default About;
