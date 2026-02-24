import { useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useAuth, ServiceRequest } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Download, DollarSign, Clock, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface RequestFormData {
  manager: string;
  stockVin: string;
  poNumber: string;
  vehicleDescription: string;
  year: number;
  make: string;
  model: string;
  color: string;
  dueDate: string;
  dueTime: string;
  mainServices: string[];
  additionalServices: string[];
  notes: string;
  price?: number;
}

const MAIN_SERVICES = [
  "N/C Delivery",
  "Clean for Showroom",
  "U/C Detail",
  "U/C Delivery",
  "Wholesale Detail",
  "Service Wash In/Out",
  "Service Express Wax",
  "Service Full Detail",
  "Exterior Detail Only",
  "Interior Detail Only",
];

const ADDITIONAL_SERVICES = [
  "Exterior Paint Protection",
  "Interior Protection",
  "Scratch Removal",
  "Restore Headlights",
  "Ozone Odor Removal",
  "Tint Removal",
  "Heavy Compound",
  "N/C Lot Prep.",
  "Paint Overspray Removal",
  "Excessive Dog Hair",
];

const STATUSES = ["Pending", "In Progress", "Completed"];

export default function Dashboard() {
  const { register, handleSubmit, control, setValue, watch, reset } = useForm<RequestFormData>({
    defaultValues: {
      manager: "",
      stockVin: "",
      poNumber: "",
      vehicleDescription: "",
      year: new Date().getFullYear(),
      make: "",
      model: "",
      color: "",
      dueDate: "",
      dueTime: "",
      mainServices: [],
      additionalServices: [],
      notes: "",
      price: 0,
    },
  });

  const { requests, updateRequestStatus, updateRequestPrice, user, addRequest, newRequestCount, resetNewRequestCount, loading } = useAuth();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingPrice, setEditingPrice] = useState<number>(0);
  const [editingStatus, setEditingStatus] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);

  const mainServices = watch("mainServices");
  const additionalServices = watch("additionalServices");

  // Listen for new request notifications
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "new-request-notification" && user?.role === "admin" && e.newValue) {
        const notification = JSON.parse(e.newValue);
        toast({
          title: "New Request Received!",
          description: `New request from ${notification.requestedBy} - ${notification.requestNumber}`,
        });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user, toast]);

  // Show notification toast when admin has new requests
  useEffect(() => {
    if (user?.role === "admin" && newRequestCount > 0) {
      const unreadRequests = requests.filter((r) => r.status === "Pending");
      if (unreadRequests.length > 0) {
        toast({
          title: `${newRequestCount} New Request${newRequestCount > 1 ? "s" : ""}`,
          description: "Click 'New Requests' badge to review.",
        });
      }
    }
  }, [newRequestCount, user, requests, toast]);

  // Generate request number
  const generateRequestNumber = () => {
    const maxId = Math.max(...requests.map((r) => r.id), 0);
    return `REQ-${String(maxId + 1).padStart(3, "0")}`;
  };

  // Get today's date formatted
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Filter requests based on user role
  const userRequests = useMemo(() => {
    if (user?.role === "admin") {
      return requests;
    }
    // Sales reps only see their own requests
    return requests.filter((r) => r.requestedBy === user?.email);
  }, [requests, user]);

  // Filter by status
  const filteredRequests = useMemo(() => {
    return statusFilter === "All"
      ? userRequests
      : userRequests.filter((r) => r.status === statusFilter);
  }, [userRequests, statusFilter]);

  // Calculate stats based on user's visible requests
  const stats = useMemo(() => {
    const total = userRequests.length;
    const pending = userRequests.filter((r) => r.status === "Pending").length;
    const inProgress = userRequests.filter((r) => r.status === "In Progress").length;
    const completed = userRequests.filter((r) => r.status === "Completed").length;
    const amountDue = userRequests
      .filter((r) => r.status === "Pending" || r.status === "In Progress")
      .reduce((sum, r) => sum + r.price, 0);
    const amountPaid = userRequests
      .filter((r) => r.status === "Completed")
      .reduce((sum, r) => sum + r.price, 0);

    return { total, pending, inProgress, completed, amountDue, amountPaid };
  }, [userRequests]);

  const handleSavePrice = (id: number, newPrice: number) => {
    updateRequestPrice(id, newPrice);
    setEditingId(null);
  };

  const handleSaveStatus = (id: number, newStatus: string) => {
    updateRequestStatus(id, newStatus as ServiceRequest["status"]);
    setEditingId(null);
  };

  const handleExport = () => {
    const headers = [
      "Request #",
      "Requested By",
      "Manager",
      "Vehicle",
      "Color",
      "Stock/VIN",
      "PO#",
      "Due Date",
      "Main Services",
      "Additional Services",
      "Status",
      "Price",
    ];
    
    const rows = filteredRequests.map((r) => [
      r.requestNumber,
      r.requestedBy,
      r.manager || "-",
      `${r.year} ${r.make} ${r.model}`,
      r.color,
      r.stockVin,
      r.poNumber || "-",
      `${r.dueDate} ${r.dueTime}`,
      r.mainServices.join("; "),
      r.additionalServices.join("; "),
      r.status,
      `$${r.price.toFixed(2)}`,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `requests-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const onFormSubmit = async (data: RequestFormData) => {
    setSubmittingForm(true);

    try {
      await addRequest({
        requestNumber: generateRequestNumber(),
        requestedBy: user?.email || "unknown@dealership.com",
        manager: data.manager || undefined,
        stockVin: data.stockVin,
        poNumber: data.poNumber || undefined,
        vehicleDescription: data.vehicleDescription,
        year: data.year,
        make: data.make,
        model: data.model,
        color: data.color,
        dateRequested: getTodayDate(),
        dueDate: data.dueDate,
        dueTime: data.dueTime,
        mainServices: data.mainServices,
        additionalServices: data.additionalServices,
        notes: data.notes,
        status: "Pending",
        price: data.price || 0,
        service: data.mainServices[0] || "Custom Service",
        vin: data.stockVin,
        due: `${data.dueDate} ${data.dueTime}`,
      });

      reset();
      setShowForm(false);

      toast({
        title: "Request Submitted",
        description: "Your service request has been successfully created.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to create request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmittingForm(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground font-display uppercase tracking-wider">
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <div className="w-12 h-[2px] bg-primary mb-6" />
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-5xl md:text-6xl font-display uppercase tracking-wider">
                  Dashboard
                </h1>
                {user?.role === "admin" && newRequestCount > 0 && (
                  <button
                    onClick={resetNewRequestCount}
                    className="relative inline-flex items-center justify-center w-8 h-8 bg-destructive text-white text-xs font-bold rounded-full hover:bg-destructive/80 transition-colors"
                    title={`${newRequestCount} new request${newRequestCount > 1 ? "s" : ""}`}
                  >
                    {newRequestCount}
                  </button>
                )}
              </div>
              <p className="text-muted-foreground uppercase tracking-widest text-sm">
                Service Requests Management
              </p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary hover:bg-primary text-primary-foreground font-display uppercase tracking-widest text-xs h-auto py-2 px-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              {showForm ? "Close" : "New Request"}
            </Button>
          </div>
          <div className="w-12 h-[2px] bg-primary mt-6" />
        </motion.div>

        {/* New Request Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-12 overflow-hidden"
            >
              <div className="glass-card p-8 md:p-10">
                <h3 className="font-display text-2xl uppercase tracking-wider mb-8">
                  Create <span className="text-primary">New Request</span>
                </h3>

                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
                  {/* Request Header Info */}
                  <div>
                    <h4 className="font-display text-sm uppercase tracking-wider mb-4 text-primary">
                      Request Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                          Request Number (Auto-Generated)
                        </label>
                        <Input
                          type="text"
                          disabled
                          value={generateRequestNumber()}
                          className="bg-background/50 border-border/50 text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                          Sales/Service Advisor (Auto-Filled)
                        </label>
                        <Input
                          type="text"
                          disabled
                          value={user?.email || ""}
                          className="bg-background/50 border-border/50 text-foreground"
                        />
                      </div>
                      <div>
                        <label htmlFor="manager" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                          Manager (Optional)
                        </label>
                        <Input
                          id="manager"
                          placeholder="Manager name or email"
                          {...register("manager")}
                          className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Stock/PO Info */}
                  <div className="border-t border-border/20 pt-6">
                    <h4 className="font-display text-sm uppercase tracking-wider mb-4 text-primary">
                      Stock & Order Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="stockVin" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                          Stock or VIN # <span className="text-destructive">*</span>
                        </label>
                        <Input
                          id="stockVin"
                          placeholder="Enter Stock or VIN number"
                          {...register("stockVin", { required: true })}
                          className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
                        />
                      </div>
                      <div>
                        <label htmlFor="poNumber" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                          PO# (Optional)
                        </label>
                        <Input
                          id="poNumber"
                          placeholder="Purchase Order number"
                          {...register("poNumber")}
                          className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div className="border-t border-border/20 pt-6">
                    <h4 className="font-display text-sm uppercase tracking-wider mb-4 text-primary">
                      Vehicle Description
                    </h4>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div>
                        <label htmlFor="vehicleDescription" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                          Vehicle Description <span className="text-destructive">*</span>
                        </label>
                        <Input
                          id="vehicleDescription"
                          placeholder="e.g., Customer vehicle, Trade-in, Lot vehicle, Fleet vehicle"
                          {...register("vehicleDescription", { required: true })}
                          className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                      <div className="md:col-span-2">
                        <label htmlFor="color" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                          Color <span className="text-destructive">*</span>
                        </label>
                        <Input
                          id="color"
                          placeholder="Silver"
                          {...register("color", { required: true })}
                          className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="border-t border-border/20 pt-6">
                    <h4 className="font-display text-sm uppercase tracking-wider mb-4 text-primary">
                      Request Dates & Times
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                          Date Requested (Auto-Filled)
                        </label>
                        <Input
                          type="text"
                          disabled
                          value={getTodayDate()}
                          className="bg-background/50 border-border/50 text-foreground"
                        />
                      </div>
                      <div>
                        <label htmlFor="dueDate" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                          Due Date <span className="text-destructive">*</span>
                        </label>
                        <Input
                          id="dueDate"
                          type="date"
                          {...register("dueDate", { required: true })}
                          className="bg-background/50 border-border/50 text-foreground"
                        />
                      </div>
                      <div>
                        <label htmlFor="dueTime" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                          Due Time <span className="text-destructive">*</span>
                        </label>
                        <Input
                          id="dueTime"
                          type="time"
                          {...register("dueTime", { required: true })}
                          className="bg-background/50 border-border/50 text-foreground"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Main Services */}
                  <div className="border-t border-border/20 pt-6">
                    <h4 className="font-display text-sm uppercase tracking-wider mb-4 text-primary">
                      Main Services (Multi-Select)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {MAIN_SERVICES.map((service) => (
                        <div key={service} className="flex items-center space-x-3">
                          <Controller
                            name="mainServices"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                id={`main-${service}`}
                                checked={field.value.includes(service)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, service]);
                                  } else {
                                    field.onChange(
                                      field.value.filter((s) => s !== service)
                                    );
                                  }
                                }}
                              />
                            )}
                          />
                          <label
                            htmlFor={`main-${service}`}
                            className="text-sm text-foreground cursor-pointer font-medium"
                          >
                            {service}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Services */}
                  <div className="border-t border-border/20 pt-6">
                    <h4 className="font-display text-sm uppercase tracking-wider mb-4 text-primary">
                      Additional Services (Multi-Select)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ADDITIONAL_SERVICES.map((service) => (
                        <div key={service} className="flex items-center space-x-3">
                          <Controller
                            name="additionalServices"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                id={`additional-${service}`}
                                checked={field.value.includes(service)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, service]);
                                  } else {
                                    field.onChange(
                                      field.value.filter((s) => s !== service)
                                    );
                                  }
                                }}
                              />
                            )}
                          />
                          <label
                            htmlFor={`additional-${service}`}
                            className="text-sm text-foreground cursor-pointer font-medium"
                          >
                            {service}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes & Price */}
                  <div className="border-t border-border/20 pt-6 space-y-6">
                    <div>
                      <label htmlFor="notes" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                        Special Instructions / Notes
                      </label>
                      <Textarea
                        id="notes"
                        placeholder="Any additional details or special instructions for this request..."
                        rows={3}
                        {...register("notes")}
                        className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
                      />
                    </div>

                    {user?.role === "admin" && (
                      <div>
                        <label htmlFor="price" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                          Total $ (Admin Only)
                        </label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...register("price", { valueAsNumber: true })}
                          className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
                        />
                      </div>
                    )}
                  </div>

                  {/* Form Actions */}
                  <div className="border-t border-border/20 pt-6 flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      disabled={submittingForm}
                      className="flex-1 border-border/30 hover:bg-card text-foreground font-display uppercase tracking-widest text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submittingForm}
                      className="flex-1 bg-primary hover:bg-primary text-primary-foreground font-display uppercase tracking-widest text-xs"
                    >
                      {submittingForm ? "Submitting..." : "Submit Request"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12"
        >
          {/* Total Requests */}
          <div className="glass-card p-6 group hover:border-primary/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                  Total Requests
                </p>
                <p className="text-4xl font-display text-foreground">{stats.total}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-primary/20" />
            </div>
            <div className="w-8 h-[1px] bg-primary" />
          </div>

          {/* Pending */}
          <div className="glass-card p-6 group hover:border-primary/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                  Pending
                </p>
                <p className="text-4xl font-display text-foreground">{stats.pending}</p>
              </div>
              <Clock className="w-10 h-10 text-primary/20" />
            </div>
            <div className="w-8 h-[1px] bg-primary" />
          </div>

          {/* In Progress */}
          <div className="glass-card p-6 group hover:border-primary/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                  In Progress
                </p>
                <p className="text-4xl font-display text-foreground">{stats.inProgress}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-primary/20" />
            </div>
            <div className="w-8 h-[1px] bg-primary" />
          </div>

          {/* Completed */}
          <div className="glass-card p-6 group hover:border-primary/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                  Completed
                </p>
                <p className="text-4xl font-display text-foreground">{stats.completed}</p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-primary/20" />
            </div>
            <div className="w-8 h-[1px] bg-primary" />
          </div>

          {/* Amount Due */}
          <div className="glass-card p-6 group hover:border-primary/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                  Amount Due
                </p>
                <p className="text-3xl font-display text-primary gold-gradient-text">
                  ${stats.amountDue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-primary/20" />
            </div>
            <div className="w-8 h-[1px] bg-primary" />
          </div>

          {/* Amount Paid */}
          <div className="glass-card p-6 group hover:border-primary/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                  Amount Paid
                </p>
                <p className="text-3xl font-display text-primary gold-gradient-text">
                  ${stats.amountPaid.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-primary/20" />
            </div>
            <div className="w-8 h-[1px] bg-primary" />
          </div>
        </motion.div>

        {/* Filters and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-card/50 border-border/30 text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border/30">
              <SelectItem value="All">All Statuses</SelectItem>
              {STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2 ml-auto">
            <Button
              onClick={handleExport}
              className="bg-primary hover:bg-primary text-primary-foreground font-display uppercase tracking-widest text-xs"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </motion.div>

        {/* Requests Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-border/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                      Request #
                    </TableHead>
                    <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                      Requested By
                    </TableHead>
                    <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                      Vehicle
                    </TableHead>
                    <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                      Stock/VIN
                    </TableHead>
                    <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                      Services
                    </TableHead>
                    <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                      Due Date
                    </TableHead>
                    <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                      Price
                    </TableHead>
                    <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                        No requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((request) => (
                      <TableRow
                        key={request.id}
                        className="border-b border-border/20 hover:bg-card/50 transition-colors"
                      >
                        <TableCell className="font-display text-sm text-primary">
                          {request.requestNumber}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {request.requestedBy}
                        </TableCell>
                        <TableCell className="text-xs text-foreground">
                          {request.year} {request.make} {request.model} ({request.color})
                        </TableCell>
                        <TableCell className="text-xs text-foreground">
                          {request.stockVin}
                        </TableCell>
                        <TableCell className="text-xs text-foreground">
                          <div className="max-w-xs">
                            {request.mainServices.length > 0 && (
                              <p className="text-primary font-medium">
                                {request.mainServices.slice(0, 2).join(", ")}
                                {request.mainServices.length > 2 && ` +${request.mainServices.length - 2}`}
                              </p>
                            )}
                            {request.additionalServices.length > 0 && (
                              <p className="text-muted-foreground text-xs">
                                {request.additionalServices.slice(0, 2).join(", ")}
                                {request.additionalServices.length > 2 && ` +${request.additionalServices.length - 2}`}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-foreground">
                          {request.dueDate} {request.dueTime}
                        </TableCell>
                        <TableCell>
                          {user?.role === "admin" && editingId === request.id ? (
                            <div className="flex gap-1">
                              <Select
                                defaultValue={request.status}
                                onValueChange={(value) => setEditingStatus(value)}
                              >
                                <SelectTrigger className="w-32 h-7 text-xs bg-card/50 border-border/30">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border/30">
                                  {STATUSES.map((status) => (
                                    <SelectItem key={status} value={status}>
                                      {status}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleSaveStatus(request.id, editingStatus || request.status)
                                }
                                className="h-7 px-2 text-primary hover:bg-card"
                              >
                                ✓
                              </Button>
                            </div>
                          ) : (
                            <span
                              className={`text-xs font-display uppercase tracking-wider px-3 py-1 rounded-sm inline-block ${
                                request.status === "Completed"
                                  ? "bg-primary/20 text-primary"
                                  : request.status === "In Progress"
                                    ? "bg-card/50 text-primary border border-primary/30"
                                    : "bg-card/50 text-muted-foreground border border-border/30"
                              }`}
                            >
                              {request.status}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {user?.role === "admin" && editingId === request.id ? (
                            <div className="flex gap-1">
                              <Input
                                type="number"
                                value={editingPrice}
                                onChange={(e) => setEditingPrice(parseFloat(e.target.value) || 0)}
                                className="w-20 h-7 text-xs bg-card/50 border-border/30"
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSavePrice(request.id, editingPrice)}
                                className="h-7 px-2 text-primary hover:bg-card"
                              >
                                ✓
                              </Button>
                            </div>
                          ) : (
                            <span className="font-display text-sm text-primary">
                              ${request.price.toFixed(2)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {user?.role === "admin" && (
                            <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingId(request.id);
                                  setEditingPrice(request.price);
                                  setEditingStatus(request.status);
                                }}
                                className="h-7 px-2 text-primary hover:bg-card"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card border-border/30 max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="font-display text-xl uppercase tracking-wider">
                                  Request Details
                                </DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                  View details for request {request.requestNumber}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                                      Stock/VIN
                                    </p>
                                    <p className="text-sm text-foreground">{request.stockVin}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                                      PO#
                                    </p>
                                    <p className="text-sm text-foreground">{request.poNumber || "-"}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                                      Vehicle
                                    </p>
                                    <p className="text-sm text-foreground">
                                      {request.year} {request.make} {request.model} ({request.color})
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                                      Manager
                                    </p>
                                    <p className="text-sm text-foreground">{request.manager || "-"}</p>
                                  </div>
                                </div>

                                <div>
                                  <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                                    Main Services
                                  </p>
                                  <p className="text-sm text-foreground bg-background/50 p-3 rounded-sm border border-border/30">
                                    {request.mainServices.length > 0
                                      ? request.mainServices.join(", ")
                                      : "None selected"}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                                    Additional Services
                                  </p>
                                  <p className="text-sm text-foreground bg-background/50 p-3 rounded-sm border border-border/30">
                                    {request.additionalServices.length > 0
                                      ? request.additionalServices.join(", ")
                                      : "None selected"}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                                    Notes
                                  </p>
                                  <p className="text-sm text-foreground bg-background/50 p-3 rounded-sm border border-border/30">
                                    {request.notes || "No notes provided"}
                                  </p>
                                </div>
                              </div>
                            </DialogContent>
                            </Dialog>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
