import { useState, useMemo } from "react";
import { Phone, MapPin, Send } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import contactBg from "@/assets/contact-bg.jpg";

const serviceTypes = [
  { name: "N/C Delivery", price: 35 },
  { name: "Clean for Showroom", price: 40 },
  { name: "U/C Detail", price: 120 },
  { name: "U/C Delivery", price: 25 },
  { name: "Wholesale Detail", price: 50 },
  { name: "Service Wash In/Out", price: 15 },
  { name: "Service Express Wax", price: 30 },
  { name: "Service Full Detail", price: 150 },
  { name: "Exterior Detail Only", price: 75 },
  { name: "Interior Detail Only", price: 75 },
];

const additionalServices = [
  { name: "Exterior Paint Protection", price: 50 },
  { name: "Interior Protection", price: 50 },
  { name: "Scratch Removal", price: 50 },
  { name: "Restore Headlights", price: 50 },
  { name: "Ozone Odor Removal", price: 50 },
  { name: "Tint Removal", price: 75 },
  { name: "Heavy Compound", price: 50 },
  { name: "N/C Lot Prep", price: 25 },
  { name: "Paint Overspray Removal", price: 50 },
  { name: "Excessive Dog Hair", price: 50 },
];

const allPrices: Record<string, number> = {};
serviceTypes.forEach((s) => { allPrices[s.name] = s.price; });
additionalServices.forEach((s) => { allPrices[s.name] = s.price; });

const inputClass =
  "w-full bg-input border border-border/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";

const labelClass = "block text-sm font-display uppercase tracking-wider text-foreground mb-2";

const sectionTitleClass =
  "font-display text-xl md:text-2xl uppercase tracking-wider gold-gradient-text mb-6";

const Contact = () => {
  const [formData, setFormData] = useState({
    advisor: "",
    manager: "",
    stockVin: "",
    poNumber: "",
    year: "",
    make: "",
    model: "",
    color: "",
    dateSubmitted: "",
    dueDate: "",
    selectedServices: [] as string[],
    selectedAdditional: [] as string[],
    specialInstructions: "",
    managerAuth: "",
    receivedBy: "",
    completedBy: "",
  });

  const toggleCheckbox = (field: "selectedServices" | "selectedAdditional", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const calculatedTotal = useMemo(() => {
    let sum = 0;
    formData.selectedServices.forEach((s) => { sum += allPrices[s] || 0; });
    formData.selectedAdditional.forEach((s) => { sum += allPrices[s] || 0; });
    return sum;
  }, [formData.selectedServices, formData.selectedAdditional]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const lines = [
      "=== DEALERSHIP SERVICE ORDER ===",
      "",
      "--- Dealership Information ---",
      `Sales or Service Advisor: ${formData.advisor}`,
      `Manager: ${formData.manager}`,
      `Stock Number / VIN #: ${formData.stockVin}`,
      `PO #: ${formData.poNumber}`,
      "",
      "--- Vehicle Information ---",
      `Year: ${formData.year}`,
      `Make: ${formData.make}`,
      `Model: ${formData.model}`,
      `Color: ${formData.color}`,
      `Date Submitted: ${formData.dateSubmitted}`,
      `Due Date: ${formData.dueDate}`,
      "",
      "--- Service Type ---",
      formData.selectedServices.length > 0
        ? formData.selectedServices.map((s) => `${s} ($${allPrices[s]?.toFixed(2)})`).join(", ")
        : "None selected",
      "",
      "--- Additional Services ---",
      formData.selectedAdditional.length > 0
        ? formData.selectedAdditional.map((s) => `${s} ($${allPrices[s]?.toFixed(2)})`).join(", ")
        : "None selected",
      "",
      "--- Special Instructions ---",
      formData.specialInstructions || "None",
      "",
      "--- Authorization ---",
      `Manager Authorization: ${formData.managerAuth}`,
      `Total: $${calculatedTotal.toFixed(2)}`,
      "",
      "--- Completion Details ---",
      `Received & Inspected By (Manager): ${formData.receivedBy}`,
      `Completed By (Detailer): ${formData.completedBy}`,
    ];

    const subject = encodeURIComponent(
      `Dealership Service Order — ${formData.year} ${formData.make} ${formData.model} — PO# ${formData.poNumber}`
    );
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:eliasrivera1884@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <main className="pt-20">
      {/* Hero banner */}
      <section className="relative py-20 md:py-28">
        <img src={contactBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/88" />
        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-display uppercase tracking-wider gold-gradient-text mb-4">
            Service Order Form
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Submit a dealership detailing service request directly to our team.
          </p>
          <div className="gold-border-line max-w-[120px] mx-auto mt-6" />
        </div>
      </section>

      {/* Form */}
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Dealership Information */}
            <AnimatedSection>
              <div className="glass-card p-8 md:p-10">
                <h2 className={sectionTitleClass}>Dealership Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Sales or Service Advisor</label>
                    <input
                      type="text"
                      value={formData.advisor}
                      onChange={(e) => setFormData({ ...formData, advisor: e.target.value })}
                      className={inputClass}
                      placeholder="Advisor name"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Manager</label>
                    <input
                      type="text"
                      value={formData.manager}
                      onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                      className={inputClass}
                      placeholder="Manager name"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Stock Number or VIN #</label>
                    <input
                      type="text"
                      value={formData.stockVin}
                      onChange={(e) => setFormData({ ...formData, stockVin: e.target.value })}
                      className={inputClass}
                      placeholder="Stock # or VIN"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>PO #</label>
                    <input
                      type="text"
                      value={formData.poNumber}
                      onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                      className={inputClass}
                      placeholder="Purchase order number"
                    />
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Vehicle Information */}
            <AnimatedSection delay={0.1}>
              <div className="glass-card p-8 md:p-10">
                <h2 className={sectionTitleClass}>Vehicle Information</h2>
                <p className="text-muted-foreground text-sm mb-6">Vehicle Description</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div>
                    <label className={labelClass}>Year</label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className={inputClass}
                      placeholder="2024"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Make</label>
                    <input
                      type="text"
                      value={formData.make}
                      onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                      className={inputClass}
                      placeholder="Toyota"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Model</label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className={inputClass}
                      placeholder="Camry"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Color</label>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className={inputClass}
                      placeholder="White"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Date Submitted</label>
                    <input
                      type="date"
                      value={formData.dateSubmitted}
                      onChange={(e) => setFormData({ ...formData, dateSubmitted: e.target.value })}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Due Date</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Select Service Type */}
            <AnimatedSection delay={0.15}>
              <div className="glass-card p-8 md:p-10">
                <h2 className={sectionTitleClass}>Select Service Type</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {serviceTypes.map((service) => (
                    <label
                      key={service.name}
                      className={`flex items-center gap-3 p-3 border rounded-sm cursor-pointer transition-all duration-200 ${
                        formData.selectedServices.includes(service.name)
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border/50 hover:border-primary/50 text-muted-foreground"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedServices.includes(service.name)}
                        onChange={() => toggleCheckbox("selectedServices", service.name)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center flex-shrink-0 transition-colors ${
                          formData.selectedServices.includes(service.name)
                            ? "border-primary bg-primary"
                            : "border-border"
                        }`}
                      >
                        {formData.selectedServices.includes(service.name) && (
                          <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm flex-1">{service.name}</span>
                      <span className="text-primary text-sm font-semibold">${service.price.toFixed(2)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Additional Services */}
            <AnimatedSection delay={0.2}>
              <div className="glass-card p-8 md:p-10">
                <h2 className={sectionTitleClass}>Additional Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {additionalServices.map((service) => (
                    <label
                      key={service.name}
                      className={`flex items-center gap-3 p-3 border rounded-sm cursor-pointer transition-all duration-200 ${
                        formData.selectedAdditional.includes(service.name)
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border/50 hover:border-primary/50 text-muted-foreground"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedAdditional.includes(service.name)}
                        onChange={() => toggleCheckbox("selectedAdditional", service.name)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center flex-shrink-0 transition-colors ${
                          formData.selectedAdditional.includes(service.name)
                            ? "border-primary bg-primary"
                            : "border-border"
                        }`}
                      >
                        {formData.selectedAdditional.includes(service.name) && (
                          <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm flex-1">{service.name}</span>
                      <span className="text-primary text-sm font-semibold">${service.price.toFixed(2)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Special Instructions */}
            <AnimatedSection delay={0.25}>
              <div className="glass-card p-8 md:p-10">
                <h2 className={sectionTitleClass}>Special Instructions</h2>
                <p className="text-muted-foreground text-sm mb-4">
                  Please provide any additional service instructions or notes below:
                </p>
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                  rows={5}
                  className={`${inputClass} resize-none`}
                  placeholder="Enter any special instructions or notes..."
                />
              </div>
            </AnimatedSection>

            {/* Authorization */}
            <AnimatedSection delay={0.3}>
              <div className="glass-card p-8 md:p-10">
                <h2 className={sectionTitleClass}>Authorization</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Manager Authorization</label>
                    <input
                      type="text"
                      value={formData.managerAuth}
                      onChange={(e) => setFormData({ ...formData, managerAuth: e.target.value })}
                      className={inputClass}
                      placeholder="Manager signature / name"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Total $</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-semibold">$</span>
                      <input
                        type="text"
                        readOnly
                        value={calculatedTotal.toFixed(2)}
                        className={`${inputClass} pl-8 font-semibold text-primary cursor-default`}
                      />
                    </div>
                    {(formData.selectedServices.length > 0 || formData.selectedAdditional.length > 0) && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {formData.selectedServices.length + formData.selectedAdditional.length} service(s) selected
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Completion Details */}
            <AnimatedSection delay={0.35}>
              <div className="glass-card p-8 md:p-10">
                <h2 className={sectionTitleClass}>Completion Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Received & Inspected By (Manager)</label>
                    <input
                      type="text"
                      value={formData.receivedBy}
                      onChange={(e) => setFormData({ ...formData, receivedBy: e.target.value })}
                      className={inputClass}
                      placeholder="Manager name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Completed By (Detailer)</label>
                    <input
                      type="text"
                      value={formData.completedBy}
                      onChange={(e) => setFormData({ ...formData, completedBy: e.target.value })}
                      className={inputClass}
                      placeholder="Detailer name"
                    />
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Submit & Contact Info */}
            <AnimatedSection delay={0.4}>
              <div className="glass-card p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                  <div>
                    <h3 className="font-display text-lg uppercase tracking-wider text-foreground mb-3">
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
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-10 py-4 font-display uppercase text-sm tracking-widest hover:bg-gold-light transition-all duration-300 hover:shadow-[0_0_30px_hsl(43_72%_50%/0.3)]"
                  >
                    <Send className="w-4 h-4" />
                    Submit Service Order
                  </button>
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
