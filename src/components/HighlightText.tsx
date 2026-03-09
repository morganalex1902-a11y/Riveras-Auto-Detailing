interface HighlightTextProps {
  text: string | number;
  searchTerm: string;
  className?: string;
}

export const HighlightText = ({ text, searchTerm, className = "" }: HighlightTextProps) => {
  if (!searchTerm.trim() || !text) {
    return <span className={className}>{text}</span>;
  }

  const stringText = String(text);
  const parts = stringText.split(new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));

  return (
    <span className={className}>
      {parts.map((part, index) => 
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <mark key={index} className="bg-yellow-300/70 dark:bg-yellow-500/50 text-inherit font-medium">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};
