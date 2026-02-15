import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface Props {
  to?: string;
  href?: string;
  children: ReactNode;
  className?: string;
}

const GoldButton = ({ to, href, children, className = "" }: Props) => {
  const base = `inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 font-display uppercase text-sm tracking-widest hover:bg-gold-light transition-all duration-300 hover:shadow-[0_0_30px_hsl(43_72%_50%/0.3)] ${className}`;

  if (href) return <a href={href} className={base}>{children}</a>;
  if (to) return <Link to={to} className={base}>{children}</Link>;
  return <button className={base}>{children}</button>;
};

export default GoldButton;
