import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface RequestFormData {
  department: "sales" | "service";
  serviceType: string;
  roNumber: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  dueDateTime: string;
  notes: string;
}

const SALES_SERVICE_TYPES = [
  "N/C Delivery",
  "U/C Delivery",
  "U/C Detail",
  "Tint Removal",
  "Ozone Odor Removal",
  "Scratch Removal",
  "Headlight Restoration",
  "Custom Service (Other)",
];

const SERVICE_SERVICE_TYPES = [
  "Full Service Detail",
  "Complimentary Service Wash",
  "Interior Detail Only",
  "Exterior Detail Only",
  "Custom Service (Other)",
];

export default function Request() {
  const { register, handleSubmit, setValue, watch, reset } = useForm<RequestFormData>({
    defaultValues: {
      department: "sales",
      serviceType: "",
      roNumber: "",
      vin: "",
      year: new Date().getFullYear(),
      make: "",
      model: "",
      dueDateTime: "",
      notes: "",
    },
  });

  const { user, addRequest, requests } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const department = watch("department");
  const serviceType = watch("serviceType");
  const roNumber = watch("roNumber");

  // Auto-generate RO number when department changes to service
  useEffect(() => {
    if (department === "service") {
      const nextRoNumber = generateRONumber();
      setValue("roNumber", nextRoNumber);
      // Set a default service type for service requests
      if (!serviceType) {
        setValue("serviceType", SERVICE_SERVICE_TYPES[0]);
      }
    } else {
      // Reset for sales requests
      if (!serviceType) {
        setValue("serviceType", SALES_SERVICE_TYPES[0]);
      }
    }
  }, [department, setValue, serviceType]);

  const generateRONumber = () => {
    // Generate RO# based on current requests count for this dealership
    const serviceRequests = requests.filter(r => r.requestType === "service");
    const nextNumber = serviceRequests.length + 1;
    return `RO-${String(nextNumber).padStart(4, "0")}`;
  };

  const currentServiceTypes = department === "service" ? SERVICE_SERVICE_TYPES : SALES_SERVICE_TYPES;

  const onSubmit = async (data: RequestFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      await addRequest({
        requestedBy: user?.email || "unknown@dealership.com",
        requesterRole: user?.role,
        stockVin: data.vin,
        vehicleDescription: `${data.year} ${data.make} ${data.model}`,
        year: data.year,
        make: data.make,
        model: data.model,
        mainServices: [data.serviceType],
        additionalServices: [],
        notes: data.notes,
        status: "Pending",
        price: 0,
        requestNumber: "",
        dateRequested: new Date().toISOString().split("T")[0],
        poNumber: "",
        requestType: data.department,
        roNumber: data.department === "service" ? data.roNumber : undefined,
      });

      setLoading(false);
      setSuccess(true);
      reset();

      toast({
        title: "Request Submitted",
        description: `Your ${data.department} request has been successfully submitted.`,
      });

      // Redirect after success
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Error",
        description: error?.message || "Failed to submit request.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="container max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="mb-4 text-primary hover:text-primary/80 text-xs font-display uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="w-12 h-[2px] bg-primary mb-6" />
          <h1 className="text-5xl md:text-6xl font-display uppercase tracking-wider mb-2">
            Service Request
          </h1>
          <p className="text-muted-foreground uppercase tracking-widest text-sm">
            Submit a new request
          </p>
          <div className="w-12 h-[2px] bg-primary mt-6" />
        </motion.div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <div className="glass-card p-6 border-border/50 flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display uppercase tracking-wider text-primary mb-1">
                  Request Submitted
                </h3>
                <p className="text-muted-foreground text-sm">
                  Your request has been submitted. Redirecting to dashboard...
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Form */}
        {!success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-card p-8 md:p-10">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Department Selection */}
                <div>
                  <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                    Department <span className="text-destructive">*</span>
                  </label>
                  <Select value={department} onValueChange={(value) => setValue("department", value as "sales" | "service")}>
                    <SelectTrigger className="bg-background/50 border-border/50 text-foreground">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/30">
                      <SelectItem value="sales">Sales Department</SelectItem>
                      <SelectItem value="service">Service Department</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                    Service Type <span className="text-destructive">*</span>
                  </label>
                  <Select value={serviceType} onValueChange={(value) => setValue("serviceType", value)}>
                    <SelectTrigger className="bg-background/50 border-border/50 text-foreground">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/30">
                      {currentServiceTypes.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* RO Number - Service Department Only */}
                {department === "service" && (
                  <div className="border-t border-border/20 pt-8">
                    <label htmlFor="roNumber" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                      Repair Order Number <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="roNumber"
                      placeholder="Auto-generated RO number"
                      {...register("roNumber", { required: true })}
                      disabled
                      className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50 opacity-75"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Auto-generated repair order number for this service request</p>
                  </div>
                )}

                {/* Vehicle Info Section */}
                <div className="border-t border-border/20 pt-8">
                  <h3 className="font-display text-lg uppercase tracking-wider mb-6">
                    <span className="text-primary">Vehicle</span> Information
                  </h3>

                  {/* VIN */}
                  <div className="mb-6">
                    <label htmlFor="vin" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                      Stock / VIN # <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="vin"
                      placeholder="Enter Stock or VIN number"
                      {...register("vin", { required: true })}
                      className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
                    />
                  </div>

                  {/* Year, Make, Model */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="year" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                        Year <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="year"
                        type="number"
                        placeholder="2023"
                        {...register("year", { required: true, valueAsNumber: true })}
                        className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="make" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                        Make <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="make"
                        placeholder="Honda"
                        {...register("make", { required: true })}
                        className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="model" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                        Model <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="model"
                        placeholder="Accord"
                        {...register("model", { required: true })}
                        className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Due Date/Time */}
                <div className="border-t border-border/20 pt-8">
                  <label htmlFor="dueDateTime" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                    Due Date & Time <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="dueDateTime"
                    type="datetime-local"
                    {...register("dueDateTime", { required: true })}
                    className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Select when you need this service completed</p>
                </div>

                {/* Notes */}
                <div className="border-t border-border/20 pt-8">
                  <label htmlFor="notes" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                    Special Instructions / Notes
                  </label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional details or special instructions for this request..."
                    rows={4}
                    {...register("notes")}
                    className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>

                {/* Disclaimer */}
                <div className="glass-card p-4 border-border/50 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Please ensure all vehicle information is accurate. Our team will contact you to confirm pricing and schedule details.
                  </p>
                </div>

                {/* Buttons */}
                <div className="border-t border-border/20 pt-8 flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/")}
                    disabled={loading}
                    className="flex-1 border-border/30 hover:bg-card text-foreground font-display uppercase tracking-widest text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary hover:bg-primary text-primary-foreground font-display uppercase tracking-widest text-xs"
                  >
                    {loading ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
