import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import GoldButton from "@/components/GoldButton";
import servicesBg from "@/assets/services-bg.jpg";

const allServices = [
  {
    title: "N/C Delivery",
    desc: "Professional preparation before new car delivery. Ensuring every vehicle meets showroom standards before reaching the customer.",
  },
  {
    title: "U/C Delivery",
    desc: "Under-car detailing and presentation for used car deliveries. Thorough cleaning and inspection of the undercarriage.",
  },
  {
    title: "U/C Detail",
    desc: "Thorough undercarriage cleaning and detailing. Removing road grime, salt, and debris for a pristine finish underneath.",
  },
  {
    title: "Tint Removal",
    desc: "Clean, professional tint removal without damage to glass surfaces. Precision removal techniques that protect your windows.",
  },
  {
    title: "Showroom Car Preparation / Detailing",
    desc: "High-level presentation detailing for display vehicles. Full exterior and interior refinement to make every vehicle stand out on the lot.",
  },
  {
    title: "Complementary Lot Wash",
    desc: "Routine dealership lot maintenance wash service. Keep your entire inventory looking fresh and presentable at all times.",
  },
];

const Services = () => (
  <main className="pt-20">
    {/* Hero banner */}
    <section className="relative py-20 md:py-28">
      <img src={servicesBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-background/88" />
      <div className="container relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-display uppercase tracking-wider gold-gradient-text mb-4">
          Our Services
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Premium detailing solutions for dealerships and discerning clients.</p>
        <div className="gold-border-line max-w-[120px] mx-auto mt-6" />
      </div>
    </section>

    <section className="py-20 md:py-28">
      <div className="container">
        <div className="space-y-8 max-w-4xl mx-auto">
          {allServices.map((s, i) => (
            <AnimatedSection key={s.title} delay={i * 0.08}>
              <div className="glass-card p-8 md:p-10 group hover:border-primary/50 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="w-10 h-[2px] bg-primary mb-4 group-hover:w-20 transition-all duration-300" />
                    <h3 className="font-display text-2xl uppercase tracking-wider mb-3">{s.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                  <GoldButton to="/contact" className="self-start mt-2">
                    Request Service
                  </GoldButton>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  </main>
);

export default Services;
