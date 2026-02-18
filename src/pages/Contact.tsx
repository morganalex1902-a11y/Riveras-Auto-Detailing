import { useState } from "react";
import { Phone, MapPin, Send, MessageCircle } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import GoldButton from "@/components/GoldButton";
import contactBg from "@/assets/contact-bg.jpg";

const inputClass =
  "w-full bg-input border border-border/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";

const labelClass = "block text-sm font-display uppercase tracking-wider text-foreground mb-2";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    dealerName: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const lines = [
      "=== CONTACT REQUEST ===",
      "",
      "--- Contact Information ---",
      `Name: ${formData.name}`,
      `Dealer Name: ${formData.dealerName}`,
      `Phone: ${formData.phone}`,
      `Email: ${formData.email}`,
      "",
      "--- Message ---",
      formData.message || "No message provided",
    ];

    const subject = encodeURIComponent(`Contact Request from ${formData.name}`);
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:eliasrivera1884@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <main className="pt-12">
      {/* Hero banner */}
      <section className="relative py-12 md:py-16">
        <img src={contactBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/70" />
        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-display uppercase tracking-wider gold-gradient-text mb-2">
            Contact Us
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get in touch with Rivera's Auto Detailing for your dealership detailing needs.
          </p>
          <div className="gold-border-line max-w-[120px] mx-auto mt-3" />
        </div>
      </section>

      {/* Form */}
      <section className="py-12 md:py-16">
        <div className="container max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatedSection>
              <div className="glass-card p-4 md:p-6">
                <div className="space-y-3">
                  {/* Name */}
                  <div>
                    <label className={labelClass}>Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={inputClass}
                      placeholder="Your name"
                      required
                    />
                  </div>

                  {/* Dealer Name */}
                  <div>
                    <label className={labelClass}>Dealer Name</label>
                    <input
                      type="text"
                      value={formData.dealerName}
                      onChange={(e) => setFormData({ ...formData, dealerName: e.target.value })}
                      className={inputClass}
                      placeholder="Your dealership name"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={inputClass}
                      placeholder="(000) 000-0000"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={inputClass}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className={labelClass}>Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className={`${inputClass} resize-none`}
                      placeholder="Tell us about your dealership detailing needs..."
                      required
                    />
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Submit & Contact Info */}
            <AnimatedSection delay={0.1}>
              <div className="glass-card p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg uppercase tracking-wider text-foreground mb-1">
                      Rivera's Auto Detailing
                    </h3>
                    <div className="space-y-2 text-muted-foreground text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>6828 Barton Rd, Hyattsville, MD 20784</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                        <a href="tel:3239948612" className="hover:text-primary transition-colors">
                          (323) 994-8612
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-display uppercase text-sm tracking-widest hover:bg-gold-light transition-all duration-300 hover:shadow-[0_0_30px_hsl(43_72%_50%/0.3)]"
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                    <a
                      href="https://wa.me/13239948612"
                      className="flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 font-display uppercase text-sm tracking-widest hover:bg-green-700 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Contact;
