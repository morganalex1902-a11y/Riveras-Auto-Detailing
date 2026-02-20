import AnimatedSection from "@/components/AnimatedSection";
import GoldButton from "@/components/GoldButton";
import serviceAreaBg from "@/assets/service-area-bg.jpg";

const serviceRegions = [
  {
    region: "DMV",
    description: "Providing dealership detailing solutions to automotive retail operations across Washington DC, Maryland & Virginia."
  }
];

const ServiceArea = () => (
  <main className="pt-12">
    {/* Hero banner */}
    <section className="relative py-12 md:py-16">
      <img src={serviceAreaBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-background/70" />
      <div className="container relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-display uppercase tracking-wider gold-gradient-text mb-2">
          Dealership Detailing Across the DMV
        </h1>
        <div className="gold-border-line max-w-[120px] mx-auto mt-3" />
      </div>
    </section>

    <section className="py-12 md:py-16">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4 mb-6">
            {serviceRegions.map((item, i) => (
              <AnimatedSection key={item.region} delay={i * 0.1}>
                <div>
                  <h3 className="font-display text-2xl uppercase tracking-wider gold-gradient-text mb-2">
                    {item.region}
                  </h3>
                  {item.description && (
                    <p className="text-muted-foreground mb-2">{item.description}</p>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection>
            <div className="aspect-video rounded-sm overflow-hidden border border-border/30">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d198744.0!2d-76.8!3d38.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b7b6e1e42b0b0f%3A0x1!2sUpper%20Marlboro%2C%20MD%2020772!5e0!3m2!1sen!2sus!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Service Area Map"
              />
            </div>
          </AnimatedSection>

          <div className="text-center mt-6">
            <a
              href="https://api.whatsapp.com/send?phone=13239948612"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 font-display uppercase text-sm tracking-widest hover:bg-gold-light transition-all duration-300 hover:shadow-[0_0_30px_hsl(43_72%_50%/0.3)]"
            >
              Schedule or Text Directly to WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>
);

export default ServiceArea;
