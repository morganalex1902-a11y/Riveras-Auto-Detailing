import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const SearchFilters = ({
  searchTerm,
  onSearchChange,
}: SearchFiltersProps) => {
  const handleClear = () => {
    onSearchChange("");
  };

  return (
    <div className="flex gap-2 w-full">
      <Input
        placeholder="Search by request #, name, email, role, vehicle, VIN, status, date, price, or services..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 bg-card/50 border-border/30 text-foreground placeholder:text-muted-foreground/50 h-10"
      />
      {searchTerm && (
        <Button
          type="button"
          variant="outline"
          onClick={handleClear}
          className="border-border/30 text-muted-foreground hover:text-foreground"
          title="Clear search"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
