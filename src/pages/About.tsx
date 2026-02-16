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
          Your Dealership Detailing Partner
        </h1>
        <div className="gold-border-line max-w-[120px] mx-auto" />
      </div>
    </section>

    <section className="section-darker py-20 md:py-28">
      <div className="container max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[
            { title: "9 Years of Dealer Experience", desc: "Nearly a decade of dedicated dealership detailing experience serving automotive retail operations throughout the DMV Area." },
            { title: "Attention to Detail", desc: "Every vehicle receives meticulous care — from panel gaps to wheel wells, nothing is overlooked. Presentation sells vehicles." },
            { title: "High-Volume Dealer Solutions", desc: "We specialize in high-volume dealership preparation, ensuring every unit is front-line ready and delivery-perfect." },
            { title: "Consistent Quality Control", desc: "Structured workflow, reliable turnaround times, and accountability on every single job — that's our standard." },
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
            "Deliver dealership-grade detailing that upholds the prestige of your brand and inventory.",
            "Maintain the highest standards of service consistency on every vehicle we detail.",
            "Use only the best and highest quality chemicals that warrant satisfaction for our dealer partners.",
            "Always have a manager on duty to inspect and approve service quality before delivery.",
            "Ensure expertise and professionalism in every single detailer on your lot.",
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
        <SectionHeading title="Why Outsource Your Detailing" subtitle="Dealerships save on:" />
        <div className="space-y-6">
          {[
            { title: "Liability", desc: "We provide our own insurance covering all services, detailers, and vehicles on your lot" },
            { title: "Efficiency", desc: "Our staff are trained specifically for high-volume dealership workflow and turnaround" },
            { title: "Accountability", desc: "We take full responsibility for our work and correct any issues immediately" },
            { title: "Overhead Costs", desc: "No payroll, overtime, or staffing headaches — we handle everything as your detailing vendor" },
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
        <SectionHeading title="Why Choose Rivera's" subtitle="Your dedicated dealership detailing solution" />
        <div className="space-y-6">
          {[
            "9 years of dedicated dealer service experience serving automotive retail operations throughout the DMV Area — Toyota, Ford, Honda, Mazda, Dodge, Lincoln, Hyundai, Nissan, and more.",
            "We understand the speed, consistency, and presentation standards required to keep inventory front-line ready.",
            "We deliver quality over quantity, respecting every vehicle and every dealership we serve.",
            "All vehicles, facilities, and detailers are covered under our comprehensive insurance policy.",
            "Consistent staffing with professional appearance standards on every shift.",
            "Manager on duty every single day we operate — structured workflow and quality assurance guaranteed.",
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
