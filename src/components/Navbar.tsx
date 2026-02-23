import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Phone, LogOut, LayoutDashboard, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const logo = "https://cdn.builder.io/api/v1/image/assets%2F0f00b454c21444a59a62cb373d89a358%2F7322560b6f384e6b960289838005c4ee?format=webp&width=800&height=1200";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/faq", label: "FAQ" },
  { to: "/service-area", label: "Service Area" },
  { to: "/trusted", label: "Trusted" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/30">
        <div className="container flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="Rivera's Auto Detailing" className="h-12 md:h-14" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-foreground">
              Home
            </Link>
            {links.slice(1).map((link) => (
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

          {/* Right section */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-foreground hover:text-primary">
                    <Avatar className="h-8 w-8 bg-primary/20">
                      <AvatarFallback className="bg-primary/20 text-primary text-sm font-display">
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-display uppercase tracking-wider hidden sm:inline">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card border-border/30">
                  <div className="px-2 py-1.5 text-xs font-display uppercase tracking-wider text-muted-foreground">
                    {user.role === "admin" ? "Admin" : "Sales Rep"}
                  </div>
                  <DropdownMenuSeparator className="bg-border/30" />
                  <DropdownMenuItem onClick={() => navigate("/request")} className="gap-2 text-foreground hover:bg-primary/10 hover:text-primary text-xs">
                    <FileText className="w-4 h-4" />
                    New Request
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem onClick={() => navigate("/dashboard")} className="gap-2 text-foreground hover:bg-primary/10 hover:text-primary text-xs">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-border/30" />
                  <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive hover:bg-destructive/10 text-xs">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <button className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2 font-display uppercase text-xs tracking-widest hover:bg-primary hover:shadow-[0_0_20px_hsl(43_72%_50%/0.3)] transition-all duration-300">
                  Login
                </button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
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
              <Link to="/" onClick={() => setOpen(false)} className="text-lg font-medium">
                Home
              </Link>
              {links.slice(1).map((link) => (
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

              <div className="border-t border-border/30 w-3/4 pt-6 flex flex-col gap-3">
                {isLoggedIn && user ? (
                  <>
                    <div className="text-center text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                      {user.role === "admin" ? "Admin" : "Sales Rep"} • {user.email}
                    </div>
                    <Button
                      onClick={() => {
                        navigate("/request");
                        setOpen(false);
                      }}
                      variant="outline"
                      className="w-full border-border/30 text-foreground hover:bg-primary/10 hover:text-primary text-xs"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      New Request
                    </Button>
                    {user.role === "admin" && (
                      <Button
                        onClick={() => {
                          navigate("/dashboard");
                          setOpen(false);
                        }}
                        variant="outline"
                        className="w-full border-border/30 text-foreground hover:bg-primary/10 hover:text-primary text-xs"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    )}
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full border-border/30 text-destructive hover:bg-destructive/10 text-xs"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setOpen(false)} className="w-full">
                    <button className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2 font-display uppercase text-xs tracking-widest hover:shadow-[0_0_20px_hsl(43_72%_50%/0.3)] transition-all duration-300">
                      Login
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
