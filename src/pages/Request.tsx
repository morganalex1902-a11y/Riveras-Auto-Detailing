import { useState } from "react";
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
  serviceType: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  dueDateTime: string;
  notes: string;
}

const SERVICE_TYPES = [
  "N/C Delivery",
  "U/C Delivery",
  "U/C Detail",
  "Tint Removal",
  "Ozone Odor Removal",
  "Scratch Removal",
  "Headlight Restoration",
  "Custom Service (Other)",
];

export default function Request() {
  const { register, handleSubmit, setValue, watch, reset } = useForm<RequestFormData>({
    defaultValues: {
      serviceType: "N/C Delivery",
      vin: "",
      year: new Date().getFullYear(),
      make: "",
      model: "",
      dueDateTime: "",
      notes: "",
    },
  });

  const { user, addRequest } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const serviceType = watch("serviceType");

  const onSubmit = async (data: RequestFormData) => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    addRequest({
      requestedBy: user?.email || "unknown@dealership.com",
      service: data.serviceType,
      vin: data.vin,
      year: data.year,
      make: data.make,
      model: data.model,
      due: data.dueDateTime,
      notes: data.notes,
      status: "Pending",
      price: 0,
    });

    setLoading(false);
    setSuccess(true);
    reset();

    toast({
      title: "Request Submitted",
      description: "Your service request has been successfully submitted.",
    });

    // Redirect after success
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="mb-4 text-blue-900 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-gray-900">Submit Service Request</h1>
          <p className="text-gray-600 mt-2">
            Fill out the form below to request a new detailing service
          </p>
        </motion.div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900">Request Submitted Successfully!</h3>
                <p className="text-green-800 text-sm mt-1">
                  Your service request has been submitted. Redirecting to dashboard...
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
            <Card className="p-8 border-0 shadow-sm">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Service Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Service Type <span className="text-red-500">*</span>
                  </label>
                  <Select defaultValue={serviceType} onValueChange={(value) => setValue("serviceType", value)}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_TYPES.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Vehicle Info */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>

                  {/* VIN */}
                  <div className="mb-4">
                    <label htmlFor="vin" className="block text-sm font-semibold text-gray-900 mb-2">
                      Stock / VIN # <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="vin"
                      placeholder="Enter Stock or VIN number"
                      {...register("vin", { required: true })}
                      className="border-gray-300"
                    />
                  </div>

                  {/* Year, Make, Model */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="year" className="block text-sm font-semibold text-gray-900 mb-2">
                        Year <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="year"
                        type="number"
                        placeholder="2023"
                        {...register("year", { required: true, valueAsNumber: true })}
                        className="border-gray-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="make" className="block text-sm font-semibold text-gray-900 mb-2">
                        Make <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="make"
                        placeholder="Honda"
                        {...register("make", { required: true })}
                        className="border-gray-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="model" className="block text-sm font-semibold text-gray-900 mb-2">
                        Model <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="model"
                        placeholder="Accord"
                        {...register("model", { required: true })}
                        className="border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Due Date/Time */}
                <div>
                  <label htmlFor="dueDateTime" className="block text-sm font-semibold text-gray-900 mb-2">
                    Due Date & Time <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="dueDateTime"
                    type="datetime-local"
                    {...register("dueDateTime", { required: true })}
                    className="border-gray-300"
                  />
                  <p className="text-xs text-gray-500 mt-1">Select when you need this service completed</p>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-semibold text-gray-900 mb-2">
                    Special Instructions / Notes
                  </label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional details or special instructions for this request..."
                    rows={4}
                    {...register("notes")}
                    className="border-gray-300"
                  />
                </div>

                {/* Disclaimer */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    Please ensure all vehicle information is accurate. Our team will contact you to confirm pricing and schedule details.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/")}
                    disabled={loading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-900 hover:bg-blue-800 text-white"
                  >
                    {loading ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </div>
    </main>
  );
}
