import { MapPin } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import GoldButton from "@/components/GoldButton";
import serviceAreaBg from "@/assets/service-area-bg.jpg";

const serviceRegions = [
  {
    region: "DMV",
    description: "Washington DC, Maryland & Virginia Metro Area",
    cities: ["Hyattsville, MD", "Laurel, MD", "Annapolis, MD", "Upper Marlboro, MD 20772"]
  }
];

const ServiceArea = () => (
  <main className="pt-20">
    {/* Hero banner */}
    <section className="relative py-20 md:py-28">
      <img src={serviceAreaBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-background/85" />
      <div className="container relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-display uppercase tracking-wider gold-gradient-text mb-4">
          Service Areas: DMV Area
        </h1>
        <div className="gold-border-line max-w-[120px] mx-auto mt-6" />
      </div>
    </section>

    <section className="py-20 md:py-28">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8 mb-10">
            {serviceRegions.map((item, i) => (
              <AnimatedSection key={item.region} delay={i * 0.1}>
                <div>
                  <h3 className="font-display text-2xl uppercase tracking-wider gold-gradient-text mb-4">
                    {item.region}
                  </h3>
                  {item.description && (
                    <p className="text-muted-foreground mb-4">{item.description}</p>
                  )}
                  {item.cities && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {item.cities.map((city) => (
                        <div key={city} className="glass-card p-4 flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="font-display uppercase tracking-wider text-sm">{city}</span>
                        </div>
                      ))}
                    </div>
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

          <div className="text-center mt-10">
            <GoldButton to="/contact">Schedule Service in Your Area</GoldButton>
          </div>
        </div>
      </div>
    </section>
  </main>
);

export default ServiceArea;
