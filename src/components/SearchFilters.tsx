import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, X } from "lucide-react";

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: {
    requestNumber: string;
    requestedBy: string;
    vehicle: string;
    stockVin: string;
    services: string;
    dateFrom: string;
    dateTo: string;
    priceFrom: string;
    priceTo: string;
  };
  onFiltersChange: (filters: SearchFiltersProps["filters"]) => void;
}

export const SearchFilters = ({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
}: SearchFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleClearFilters = () => {
    onSearchChange("");
    onFiltersChange({
      requestNumber: "",
      requestedBy: "",
      vehicle: "",
      stockVin: "",
      services: "",
      dateFrom: "",
      dateTo: "",
      priceFrom: "",
      priceTo: "",
    });
  };

  const hasActiveFilters = 
    searchTerm.trim() !== "" ||
    Object.values(filters).some((v) => v.trim() !== "");

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <Input
          placeholder="Search by request #, name, vehicle, VIN, or services..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 bg-card/50 border-border/30 text-foreground placeholder:text-muted-foreground/50"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`border-border/30 ${showAdvanced ? "bg-primary/10 text-primary" : "text-foreground hover:bg-card"}`}
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
          />
          Filters
        </Button>
        {hasActiveFilters && (
          <Button
            type="button"
            variant="outline"
            onClick={handleClearFilters}
            className="border-border/30 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="glass-card p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Request Number */}
            <div>
              <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                Request #
              </label>
              <Input
                placeholder="Filter by request number"
                value={filters.requestNumber}
                onChange={(e) => handleFilterChange("requestNumber", e.target.value)}
                className="bg-background/50 border-border/30 text-foreground placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Requested By */}
            <div>
              <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                Requested By
              </label>
              <Input
                placeholder="Filter by person name/email"
                value={filters.requestedBy}
                onChange={(e) => handleFilterChange("requestedBy", e.target.value)}
                className="bg-background/50 border-border/30 text-foreground placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Vehicle */}
            <div>
              <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                Vehicle
              </label>
              <Input
                placeholder="Filter by year/make/model"
                value={filters.vehicle}
                onChange={(e) => handleFilterChange("vehicle", e.target.value)}
                className="bg-background/50 border-border/30 text-foreground placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Stock/VIN */}
            <div>
              <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                Stock/VIN
              </label>
              <Input
                placeholder="Filter by stock or VIN"
                value={filters.stockVin}
                onChange={(e) => handleFilterChange("stockVin", e.target.value)}
                className="bg-background/50 border-border/30 text-foreground placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Services */}
            <div>
              <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                Services
              </label>
              <Input
                placeholder="Filter by service type"
                value={filters.services}
                onChange={(e) => handleFilterChange("services", e.target.value)}
                className="bg-background/50 border-border/30 text-foreground placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Date Range */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                Date Range
              </label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                  className="flex-1 bg-background/50 border-border/30 text-foreground"
                />
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  className="flex-1 bg-background/50 border-border/30 text-foreground"
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                Price Range ($)
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.priceFrom}
                  onChange={(e) => handleFilterChange("priceFrom", e.target.value)}
                  className="flex-1 bg-background/50 border-border/30 text-foreground placeholder:text-muted-foreground/50"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.priceTo}
                  onChange={(e) => handleFilterChange("priceTo", e.target.value)}
                  className="flex-1 bg-background/50 border-border/30 text-foreground placeholder:text-muted-foreground/50"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
