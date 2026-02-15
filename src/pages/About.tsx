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
            { title: "Experience", desc: "Years of hands-on detailing experience serving Maryland's top dealerships and private clients." },
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
  </main>
);

export default About;
