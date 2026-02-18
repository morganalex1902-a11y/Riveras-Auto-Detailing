import AnimatedSection from "./AnimatedSection";

interface Props {
  title: string;
  subtitle?: string;
}

const SectionHeading = ({ title, subtitle }: Props) => (
  <AnimatedSection className="text-center mb-8 md:mb-12">
    <h2 className="text-3xl md:text-5xl font-display uppercase tracking-wider gold-gradient-text mb-3">
      {title}
    </h2>
    {subtitle && (
      <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
    )}
    <div className="gold-border-line max-w-[120px] mx-auto mt-4" />
  </AnimatedSection>
);

export default SectionHeading;
