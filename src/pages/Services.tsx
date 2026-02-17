import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import GoldButton from "@/components/GoldButton";
import servicesBg from "@/assets/services-bg.jpg";

const allServices = [
  {
    section: "Main Services",
    items: [
      {
        title: "U/C Detail",
        desc: "Thorough undercarriage cleaning and detailing. Removing road grime, salt, and debris for a pristine finish underneath.",
      },
      {
        title: "N/C Delivery",
        desc: "Professional preparation before new car delivery. Ensuring every vehicle meets showroom standards before reaching the customer.",
      },
      {
        title: "U/C Delivery",
        desc: "Under-car detailing and presentation for used car deliveries. Thorough cleaning and inspection of the undercarriage.",
      },
      {
        title: "Showroom Car",
        desc: "Complete cleaning and preparation for showroom display. Transform your inventory into pristine, customer-ready vehicles.",
      },
      {
        title: "Loaner Wash",
        desc: "Quick and efficient wash service for loaner vehicles. Keep customer loaner cars fresh and clean.",
      },
      {
        title: "Service Full Detail",
        desc: "Complete interior and exterior detailing service. Ultimate refresh for any vehicle condition.",
      },
      {
        title: "Service Wash",
        desc: "Interior and exterior wash service for service vehicles. Keep customer service vehicles clean and professional.",
      },
      {
        title: "Wholesale Detail",
        desc: "Comprehensive detailing for wholesale and fleet vehicles. Quick turnaround without compromising quality standards.",
      },
      {
        title: "Wet Sand Work",
        desc: "Premium wet sanding service for paint correction. Smooth imperfections and restore paint clarity.",
      },
    ],
  },
  {
    section: "Additional Services",
    items: [
      {
        title: "Tint Removal",
        desc: "Clean, professional tint removal without damage to glass surfaces. Precision removal techniques that protect your windows.",
      },
      {
        title: "Ozone Removal",
        desc: "Advanced ozone treatment for odor elimination. Permanently remove stubborn smells from any vehicle.",
      },
      {
        title: "Paint Overspray",
        desc: "Specialized overspray removal service. Restore your paint finish to factory perfection.",
      },
      {
        title: "Heavy Compound",
        desc: "Heavy-duty paint correction and compounding. Address significant oxidation and paint defects.",
      },
      {
        title: "Exterior Paint Protection",
        desc: "Professional paint protection application. Guard against environmental damage and maintain your vehicle's finish.",
      },
      {
        title: "Interior Protection",
        desc: "Advanced interior protection treatments. Protect upholstery and surfaces from stains and wear.",
      },
      {
        title: "Excessive Dog Hair",
        desc: "Specialized pet hair removal and interior sanitization. Thoroughly clean vehicles with extensive pet damage.",
      },
      {
        title: "Interior Removal (Each Piece)",
        desc: "Removal and detailed cleaning of individual interior components. Perfect for deep interior restoration.",
      },
      {
        title: "Interior Detail Only",
        desc: "Comprehensive interior cleaning and conditioning. Restore your cabin to like-new condition.",
      },
      {
        title: "New Car Lot Prep/PDI",
        desc: "Complete preparation for new car lots. Ensure every vehicle makes a stellar first impression.",
      },
      {
        title: "Restore Headlights",
        desc: "Professional headlight restoration and polishing. Improve visibility and vehicle appearance.",
      },
    ],
  },
];

const Services = () => (
  <main className="pt-20">
    {/* Hero banner */}
    <section className="relative py-20 md:py-28">
      <img src={servicesBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-background/95" />
      <div className="container relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-display uppercase tracking-wider gold-gradient-text mb-4">
          Dealership Detailing Services
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">High-volume dealership detailing solutions designed for automotive retail operations.</p>
        <div className="gold-border-line max-w-[120px] mx-auto mt-6" />
      </div>
    </section>

    <section className="py-20 md:py-28">
      <div className="container">
        <div className="space-y-16 max-w-4xl mx-auto">
          {allServices.map((section, sectionIdx) => (
            <div key={section.section}>
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-display uppercase tracking-wider gold-gradient-text mb-2">
                  {section.section}
                </h2>
                <div className="w-20 h-[2px] bg-primary" />
              </div>
              <div className="space-y-8">
                {section.items.map((service, itemIdx) => (
                  <AnimatedSection key={service.title} delay={(sectionIdx * 0.1) + (itemIdx * 0.05)}>
                    <div className="glass-card p-8 md:p-10 group hover:border-primary/50 transition-all duration-300">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="w-10 h-[2px] bg-primary mb-4 group-hover:w-20 transition-all duration-300" />
                          <h3 className="font-display text-2xl uppercase tracking-wider mb-3">{service.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">{service.desc}</p>
                        </div>
                        <GoldButton to="/contact" className="self-start mt-2">
                          Get Quote
                        </GoldButton>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </main>
);

export default Services;
