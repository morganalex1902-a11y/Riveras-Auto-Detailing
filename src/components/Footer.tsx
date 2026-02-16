import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import logo from "@/assets/logo.png";

const footerLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/faq", label: "FAQ" },
  { to: "/service-area", label: "Service Area" },
  { to: "/contact", label: "Contact" },
];

const Footer = () => (
  <footer className="section-darker border-t border-border/30">
    <div className="gold-border-line" />
    <div className="container py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <img src={logo} alt="Rivera's Auto Detailing" className="h-16 mb-4" />
          <p className="text-muted-foreground text-sm leading-relaxed">
            Professional auto detailing services in the DMV Area. Precision. Presentation. Showroom-Level Results.
          </p>
        </div>

        <div>
          <h4 className="font-display uppercase tracking-widest text-primary mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {footerLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display uppercase tracking-widest text-primary mb-4">Contact</h4>
          <div className="space-y-3">
            <a href="tel:3239948612" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Phone className="w-4 h-4 text-primary" />
              323-994-8612
            </a>
            <a href="mailto:eliasrivera1884@gmail.com" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors text-sm">
              <Mail className="w-4 h-4 text-primary" />
              eliasrivera1884@gmail.com
            </a>
          </div>
        </div>
      </div>

      <div className="gold-border-line mt-10" />
      <p className="text-center text-muted-foreground text-xs mt-6">
        © {new Date().getFullYear()} Rivera's Auto Detailing. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
