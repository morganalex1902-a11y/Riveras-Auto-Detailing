import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/faq", label: "FAQ" },
  { to: "/service-area", label: "Service Area" },
  { to: "/trusted", label: "Trusted" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/30">
        <div className="container flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="Rivera's Auto Detailing" className="h-12 md:h-14" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-display uppercase tracking-widest transition-colors hover:text-primary ${
                  location.pathname === link.to ? "text-primary" : "text-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <a
            href="tel:3239948612"
            className="hidden md:flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 font-display uppercase text-sm tracking-wider hover:bg-gold-light transition-colors"
          >
            <Phone className="w-4 h-4" />
            Call Now
          </a>

          <button
            className="lg:hidden text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-background pt-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex flex-col items-center gap-6 pt-8">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`text-lg font-display uppercase tracking-widest transition-colors hover:text-primary ${
                    location.pathname === link.to ? "text-primary" : "text-foreground/80"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="tel:3239948612"
                className="mt-4 flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-display uppercase tracking-wider"
              >
                <Phone className="w-5 h-5" />
                323-994-8612
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile sticky call button */}
      <a
        href="tel:3239948612"
        className="fixed bottom-4 right-4 z-50 md:hidden flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-sm shadow-lg animate-glow-pulse font-display uppercase text-sm tracking-wider"
      >
        <Phone className="w-5 h-5" />
        Call Now
      </a>
    </>
  );
};

export default Navbar;
