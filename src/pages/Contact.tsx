import { useState } from "react";
import { Phone, Mail, Send } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent("Service Request from " + formData.name);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\n${formData.message}`);
    window.location.href = `mailto:eliasrivera1884@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <main className="pt-20">
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <SectionHeading title="Contact Us" subtitle="Get in touch for professional detailing services." />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <AnimatedSection>
              <div className="space-y-8">
                <a href="tel:3239948612" className="block glass-card p-8 text-center group hover:border-primary/50 transition-all">
                  <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
                  <p className="font-display text-3xl gold-gradient-text tracking-wider">323-994-8612</p>
                </a>
                <a href="mailto:eliasrivera1884@gmail.com" className="block glass-card p-8 text-center group hover:border-primary/50 transition-all">
                  <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
                  <p className="text-foreground">eliasrivera1884@gmail.com</p>
                </a>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <form onSubmit={handleSubmit} className="glass-card p-8 space-y-4">
                {(["name", "email", "phone"] as const).map((field) => (
                  <input
                    key={field}
                    type={field === "email" ? "email" : "text"}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    required={field !== "phone"}
                    value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className="w-full bg-input border border-border/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                ))}
                <textarea
                  placeholder="Message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-input border border-border/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 font-display uppercase text-sm tracking-widest hover:bg-gold-light transition-all duration-300"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
