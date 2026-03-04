import { useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useAuth, ServiceRequest } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
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
import { Edit2, Download, DollarSign, Clock, CheckCircle2, AlertCircle, Plus, Users, Copy, Eye, EyeOff, Trash2, RefreshCw } from "lucide-react";
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
import { useUnactedNotifications } from "@/hooks/useUnactedNotifications";
import { NewRequestsNotification } from "@/components/NewRequestsNotification";
import { RequestDetailModal } from "@/components/RequestDetailModal";

const formatDateInput = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 4) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`;
};

const formatTimeInput = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 2) return cleaned;
  return `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
};

interface RequestFormData {
  manager: string;
  stockVin: string;
  poNumber: string;
  vehicleDescription: string;
  year: number;
  make: string;
  model: string;
  mainServices: string[];
  additionalServices: string[];
  notes: string;
  price?: number;
}

interface AccountFormData {
  name: string;
  email: string;
  password: string;
  role: "sales_rep" | "admin" | "manager";
  securityQuestion: string;
  securityAnswer: string;
}

const SECURITY_QUESTIONS = [
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "In what city were you born?",
  "What is your favorite color?",
  "What was your first car make/model?",
  "What is your favorite food?",
  "What was the name of your elementary school?",
  "What is your favorite movie?",
];

const MAIN_SERVICES = [
  "N/C Delivery",
  "Clean for Showroom",
  "U/C Detail",
  "U/C Delivery",
  "Wholesale Detail",
  "Service Wash In/Out",
  "Loaner wash",
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

const STATUSES = ["Pending", "Completed"];

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
      mainServices: [],
      additionalServices: [],
      notes: "",
    },
  });

  const { requests, updateRequestStatus, updateRequestPrice, updateRequestDates, updateRequest, deleteRequest, user, addRequest, newRequestCount, resetNewRequestCount, loading, refreshRequests, deleteAllRequests, getRequestsByDateRange } = useAuth();
  const { toast } = useToast();
  const { unactedNotifications, addUnactedNotification, markAsActed, clearAll, isLoaded } = useUnactedNotifications();

  // Request management state
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingPrice, setEditingPrice] = useState<number>(0);
  const [editingStatus, setEditingStatus] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState<ServiceRequest | null>(null);
  const [editingDates, setEditingDates] = useState<{
    dueDate: string;
    dueTime: string;
    startDate: string;
    startTime: string;
    completionDate: string;
    completionTime: string;
  }>({
    dueDate: "",
    dueTime: "",
    startDate: "",
    startTime: "",
    completionDate: "",
    completionTime: "",
  });
  const [editingMainServices, setEditingMainServices] = useState<string[]>([]);
  const [editingAdditionalServices, setEditingAdditionalServices] = useState<string[]>([]);
  const [mainServicesInput, setMainServicesInput] = useState("");
  const [additionalServicesInput, setAdditionalServicesInput] = useState("");
  const [editingNotes, setEditingNotes] = useState("");
  const [editingVehicle, setEditingVehicle] = useState<{
    year: number;
    make: string;
    model: string;
    color: string;
  }>({ year: new Date().getFullYear(), make: "", model: "", color: "" });
  const [editingStockVin, setEditingStockVin] = useState("");
  const [isSavingDates, setIsSavingDates] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<ServiceRequest | null>(null);
  const [showDeleteRequestDialog, setShowDeleteRequestDialog] = useState(false);
  const [deletingRequestId, setDeletingRequestId] = useState<number | null>(null);

  // Admin/Manager account management state
  const [activeTab, setActiveTab] = useState<"requests" | "accounts" | "activity">("requests");
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [teamUsers, setTeamUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [accountActivity, setAccountActivity] = useState<any[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState<any>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resettingPasswordId, setResettingPasswordId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRequestForDetail, setSelectedRequestForDetail] = useState<ServiceRequest | null>(null);
  const [isDeletingAllRequests, setIsDeletingAllRequests] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [showDateRangeDialog, setShowDateRangeDialog] = useState(false);
  const [dateRangeOption, setDateRangeOption] = useState("thisWeek");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [isExportingByDate, setIsExportingByDate] = useState(false);
  const { register: registerAccount, handleSubmit: handleAccountSubmit, reset: resetAccountForm, watch: watchAccount } = useForm<AccountFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "sales_rep",
      securityQuestion: SECURITY_QUESTIONS[0],
      securityAnswer: "",
    },
  });

  // Fetch all users in the dealership
  const fetchTeamUsers = async () => {
    if (!user?.dealership_id) return;

    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('dealership_id', user.dealership_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeamUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  // Delete user account
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setDeletingUserId(userToDelete.id);
    try {
      // Log the activity before deletion
      await logAccountActivity('delete', userToDelete.id, userToDelete.email, userToDelete.name);

      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userToDelete.id);

      if (error) throw error;

      setTeamUsers(teamUsers.filter(u => u.id !== userToDelete.id));
      toast({
        title: "Account Deleted",
        description: `${userToDelete.email} has been removed from your team.`,
      });
      setShowDeleteDialog(false);
      setUserToDelete(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingUserId(null);
    }
  };

  // Reset user password
  const handleResetPassword = async () => {
    if (!userToResetPassword) return;

    setResettingPasswordId(userToResetPassword.id);
    try {
      // Generate a new random password
      const tempPassword = generatePassword();

      // Hash the new password
      const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(tempPassword));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Update the user's password
      const { error } = await supabase
        .from('users')
        .update({ password_hash: passwordHash })
        .eq('id', userToResetPassword.id);

      if (error) throw error;

      // Log the activity
      await logAccountActivity('password_reset', userToResetPassword.id, userToResetPassword.email, userToResetPassword.name);

      setNewPassword(tempPassword);
      toast({
        title: "Password Reset",
        description: `A new password has been generated for ${userToResetPassword.email}. Copy and share it with them.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setResettingPasswordId(null);
    }
  };

  // Log account activity
  const logAccountActivity = async (actionType: 'create' | 'delete' | 'password_reset', targetUserId: string, targetUserEmail: string, targetUserName: string) => {
    if (!user?.dealership_id || !user?.id) return;

    try {
      const { error } = await supabase
        .from('account_activity')
        .insert({
          dealership_id: user.dealership_id,
          actor_id: user.id,
          action_type: actionType,
          target_user_id: targetUserId,
          target_user_email: targetUserEmail,
          target_user_name: targetUserName,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging account activity:', error);
    }
  };

  // Fetch account activity
  const fetchAccountActivity = async () => {
    if (!user?.dealership_id) return;

    setLoadingActivity(true);
    try {
      const { data, error } = await supabase
        .from('account_activity')
        .select(`
          *,
          actor:actor_id(name, email),
          target_user:target_user_id(name, email)
        `)
        .eq('dealership_id', user.dealership_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccountActivity(data || []);
    } catch (error) {
      console.error('Error fetching account activity:', error);
      toast({
        title: "Error",
        description: "Failed to load account activity",
        variant: "destructive",
      });
    } finally {
      setLoadingActivity(false);
    }
  };

  // Load users and activity when switching tabs
  useEffect(() => {
    if (activeTab === "accounts" && user?.role === "admin") {
      fetchTeamUsers();
    }
    if (activeTab === "activity" && user?.role === "admin") {
      fetchAccountActivity();
    }
  }, [activeTab, user?.role]);

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
  }, [user?.role, toast]);

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
  }, [newRequestCount, user?.role, requests, toast]);

  // Add new pending requests to unacted notifications
  useEffect(() => {
    // Only process pending requests after dismissed IDs have been loaded from localStorage
    if (user?.role === "admin" && isLoaded) {
      const pendingRequests = requests.filter((r) => r.status === "Pending");
      pendingRequests.forEach((request) => {
        // Check if this request is already in unacted notifications
        const alreadyNotified = unactedNotifications.some((n) => n.id === request.id);
        if (!alreadyNotified) {
          addUnactedNotification(request);
        }
      });
    }
  }, [requests, user?.role, unactedNotifications, addUnactedNotification, isLoaded]);

  // Auto-refresh requests list periodically (every 15 seconds)
  useEffect(() => {
    // Only start polling for admins to check for new requests
    if (user?.role !== "admin") return;

    const POLL_INTERVAL_MS = 15 * 1000; // 15 seconds

    const interval = setInterval(async () => {
      try {
        await refreshRequests();
      } catch (error) {
        console.error("Error refreshing requests:", error);
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [user?.role, refreshRequests]);

  // Generate request number
  const generateRequestNumber = () => {
    const maxId = Math.max(...requests.map((r) => r.id), 0);
    return `REQ-${String(maxId + 1).padStart(3, "0")}`;
  };

  // Get today's date formatted (US timezone)
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
    const completed = userRequests.filter((r) => r.status === "Completed").length;
    const amountDue = userRequests
      .filter((r) => r.status === "Pending")
      .reduce((sum, r) => sum + r.price, 0);
    const amountPaid = userRequests
      .filter((r) => r.status === "Completed")
      .reduce((sum, r) => sum + r.price, 0);

    return { total, pending, completed, amountDue, amountPaid };
  }, [userRequests]);

  const handleSavePrice = (id: number, newPrice: number) => {
    updateRequestPrice(id, newPrice);
    setEditingId(null);
  };

  const handleSaveStatus = (id: number, newStatus: string) => {
    updateRequestStatus(id, newStatus as ServiceRequest["status"]);
    setEditingId(null);
  };

  const handleOpenRequestDetails = (request: ServiceRequest) => {
    setEditingRequest(request);
    setEditingDates({
      dueDate: request.dueDate || "",
      dueTime: request.dueTime || "",
      startDate: request.startDate || "",
      startTime: request.startTime || "",
      completionDate: request.completionDate || "",
      completionTime: request.completionTime || "",
    });
    setEditingPrice(request.price);
    setEditingStatus(request.status);
    setEditingMainServices(request.mainServices || []);
    setEditingAdditionalServices(request.additionalServices || []);
    setMainServicesInput((request.mainServices || []).join(", "));
    setAdditionalServicesInput((request.additionalServices || []).join(", "));
    setEditingNotes(request.notes || "");
    setEditingVehicle({
      year: request.year || new Date().getFullYear(),
      make: request.make || "",
      model: request.model || "",
      color: request.color || "",
    });
    setEditingStockVin(request.stockVin || "");
    // Mark this request as acted upon
    markAsActed(request.id);
  };

  const handleDeleteRequest = async () => {
    if (!requestToDelete) return;

    setDeletingRequestId(requestToDelete.id);
    try {
      await deleteRequest(requestToDelete.id);
      toast({
        title: "Deleted",
        description: `Request ${requestToDelete.requestNumber} has been deleted.`,
      });
      setShowDeleteRequestDialog(false);
      setRequestToDelete(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingRequestId(null);
    }
  };

  const handleSaveDates = async () => {
    if (!editingRequest) return;

    setIsSavingDates(true);
    try {
      await updateRequestDates(editingRequest.id, editingDates);
      toast({
        title: "Updated",
        description: "Request dates updated successfully.",
      });
      setEditingRequest(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to update request.",
        variant: "destructive",
      });
    } finally {
      setIsSavingDates(false);
    }
  };

  const handleExport = () => {
    const headers = [
      "Request #",
      "Requested By",
      "Manager",
      "Vehicle",
      "Stock/VIN",
      "PO#",
      "Date Requested",
      "Main Services",
      "Additional Services",
      "Status",
      "Completion Date",
      "Price",
    ];

    // Filter to only include Completed requests
    const completedRequests = filteredRequests.filter(
      (r) => r.status === "Completed"
    );

    const rows = completedRequests.map((r) => [
      r.requestNumber,
      r.requestedBy,
      r.manager || "-",
      `${r.year} ${r.make} ${r.model}`,
      r.stockVin,
      r.poNumber || "-",
      r.dateRequested || "-",
      r.mainServices.join("; "),
      r.additionalServices.join("; "),
      r.status,
      r.completionDate || "-",
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
    a.download = `weekly-services-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshRequests();
      toast({
        title: "Refreshed",
        description: "Service request list has been refreshed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh service requests.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteAllRequests = async () => {
    setIsDeletingAllRequests(true);
    try {
      await deleteAllRequests();
      setShowDeleteAllDialog(false);
      toast({
        title: "Deleted",
        description: "All service requests have been deleted. The list will refresh automatically.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service requests.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingAllRequests(false);
    }
  };

  const getDateRangeFromOption = (option: string): { start: string; end: string } => {
    const today = new Date();
    const start = new Date();

    switch (option) {
      case "thisWeek":
        start.setDate(today.getDate() - today.getDay()); // Sunday
        return {
          start: start.toISOString().split("T")[0],
          end: today.toISOString().split("T")[0],
        };
      case "lastWeek":
        const lastWeekEnd = new Date(start);
        lastWeekEnd.setDate(today.getDate() - today.getDay() - 1);
        const lastWeekStart = new Date(lastWeekEnd);
        lastWeekStart.setDate(lastWeekEnd.getDate() - 6);
        return {
          start: lastWeekStart.toISOString().split("T")[0],
          end: lastWeekEnd.toISOString().split("T")[0],
        };
      case "thisMonth":
        start.setDate(1);
        return {
          start: start.toISOString().split("T")[0],
          end: today.toISOString().split("T")[0],
        };
      case "lastMonth":
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        return {
          start: lastMonthStart.toISOString().split("T")[0],
          end: lastMonthEnd.toISOString().split("T")[0],
        };
      case "custom":
        return {
          start: customStartDate,
          end: customEndDate,
        };
      default:
        return {
          start: today.toISOString().split("T")[0],
          end: today.toISOString().split("T")[0],
        };
    }
  };

  const handleExportByDateRange = async () => {
    if (dateRangeOption === "custom" && (!customStartDate || !customEndDate)) {
      toast({
        title: "Error",
        description: "Please select both start and end dates.",
        variant: "destructive",
      });
      return;
    }

    setIsExportingByDate(true);
    try {
      const { start, end } = getDateRangeFromOption(dateRangeOption);
      const dateRangeRequests = await getRequestsByDateRange(start, end);

      const headers = [
        "Request #",
        "Requested By",
        "Manager",
        "Vehicle",
        "Stock/VIN",
        "PO#",
        "Date Requested",
        "Main Services",
        "Additional Services",
        "Status",
        "Completion Date",
        "Price",
      ];

      const rows = dateRangeRequests.map((r) => [
        r.requestNumber,
        r.requestedBy,
        r.manager || "-",
        `${r.year} ${r.make} ${r.model}`,
        r.stockVin,
        r.poNumber || "-",
        r.dateRequested || "-",
        r.mainServices.join("; "),
        r.additionalServices.join("; "),
        r.status,
        r.completionDate || "-",
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

      // Create filename with date range
      const { start: startDate, end: endDate } = getDateRangeFromOption(dateRangeOption);
      let fileName = `services-${startDate}-to-${endDate}.csv`;
      if (dateRangeOption === "thisWeek") fileName = `services-this-week-${new Date().toISOString().split("T")[0]}.csv`;
      if (dateRangeOption === "lastWeek") fileName = `services-last-week-${new Date().toISOString().split("T")[0]}.csv`;
      if (dateRangeOption === "thisMonth") fileName = `services-this-month-${new Date().toISOString().split("T")[0]}.csv`;
      if (dateRangeOption === "lastMonth") fileName = `services-last-month-${new Date().toISOString().split("T")[0]}.csv`;

      a.download = fileName;
      a.click();

      toast({
        title: "Exported",
        description: `CSV exported with ${dateRangeRequests.length} request(s).`,
      });

      setShowDateRangeDialog(false);
      setCustomStartDate("");
      setCustomEndDate("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export CSV by date range.",
        variant: "destructive",
      });
    } finally {
      setIsExportingByDate(false);
    }
  };

  // Generate random password
  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  // Create new user account
  const onAccountSubmit = async (data: AccountFormData) => {
    setCreatingAccount(true);

    try {
      const password = data.password && data.password.trim() ? data.password : generatePassword();

      // Hash the password using SHA-256
      const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Create user directly in the database
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          email: data.email,
          name: data.name,
          dealership_id: user?.dealership_id,
          role: data.role,
          password_hash: passwordHash,
          is_active: true,
          security_question: data.securityQuestion,
          security_answer: data.securityAnswer.toLowerCase().trim(),
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(insertError.message || "Failed to create account");
      }

      // Log the activity
      await logAccountActivity('create', newUser.id, data.email, data.name);

      toast({
        title: "Account Created",
        description: `New account created for ${data.email}.`,
      });

      setGeneratedPassword(password);
      resetAccountForm();
      fetchTeamUsers(); // Refresh team users list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreatingAccount(false);
    }
  };

  const onFormSubmit = async (data: RequestFormData) => {
    setSubmittingForm(true);

    try {
      await addRequest({
        requestNumber: generateRequestNumber(),
        requestedBy: user?.email || "unknown@dealership.com",
        requesterRole: user?.role,
        manager: data.manager || undefined,
        stockVin: data.stockVin,
        poNumber: data.poNumber || undefined,
        vehicleDescription: data.vehicleDescription,
        year: data.year,
        make: data.make,
        model: data.model,
        dateRequested: getTodayDate(),
        mainServices: data.mainServices,
        additionalServices: data.additionalServices,
        notes: data.notes,
        status: "Pending",
        price: data.price || 0,
        service: data.mainServices[0] || "Custom Service",
        vin: data.stockVin,
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
              <div className="flex items-center gap-6 mb-2">
                <h1 className="text-5xl md:text-6xl font-display uppercase tracking-wider">
                  Dashboard
                </h1>
                {user?.role === "admin" && (
                  <NewRequestsNotification
                    newRequestCount={newRequestCount}
                    newRequests={requests.filter((r) => r.status === "Pending")}
                    unactedNotifications={unactedNotifications}
                    onDismiss={resetNewRequestCount}
                    onRequestSelect={handleOpenRequestDetails}
                    onClearAll={clearAll}
                  />
                )}
              </div>
              <p className="text-muted-foreground uppercase tracking-widest text-sm">
                {activeTab === "requests" ? "Service Requests Management" : "Account Management"}
              </p>
            </div>
            {activeTab === "requests" && (
              <Button
                onClick={() => setShowForm(!showForm)}
                className="bg-primary hover:bg-primary text-primary-foreground font-display uppercase tracking-widest text-xs h-auto py-2 px-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                {showForm ? "Close" : "New Request"}
              </Button>
            )}
            {user?.role === "admin" && activeTab === "accounts" && (
              <Button
                onClick={() => setShowAccountForm(!showAccountForm)}
                className="bg-primary hover:bg-primary text-primary-foreground font-display uppercase tracking-widest text-xs h-auto py-2 px-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                {showAccountForm ? "Close" : "Create Account"}
              </Button>
            )}
          </div>

          {/* Manager Account Creation (Managers Only) */}
          {user?.role === "manager" && (
            <div className="flex gap-4 mb-6">
              <Button
                onClick={() => setShowAccountForm(!showAccountForm)}
                className="bg-primary hover:bg-primary text-primary-foreground font-display uppercase tracking-widest text-xs h-auto py-2 px-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                {showAccountForm ? "Close" : "Create Account"}
              </Button>
            </div>
          )}

          {/* Admin Tab Navigation */}
          {user?.role === "admin" && (
            <div className="flex gap-4 mb-6 flex-wrap">
              <button
                onClick={() => setActiveTab("requests")}
                className={`flex items-center gap-2 px-6 py-3 font-display uppercase tracking-wider text-sm transition-all ${
                  activeTab === "requests"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border/30 text-foreground hover:border-primary/50"
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                Service Requests
              </button>
              <button
                onClick={() => setActiveTab("accounts")}
                className={`flex items-center gap-2 px-6 py-3 font-display uppercase tracking-wider text-sm transition-all ${
                  activeTab === "accounts"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border/30 text-foreground hover:border-primary/50"
                }`}
              >
                <Users className="w-4 h-4" />
                Account Management
              </button>
              <button
                onClick={() => setActiveTab("activity")}
                className={`flex items-center gap-2 px-6 py-3 font-display uppercase tracking-wider text-sm transition-all ${
                  activeTab === "activity"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border/30 text-foreground hover:border-primary/50"
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                Activity Log
              </button>
            </div>
          )}

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
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="border-t border-border/20 pt-6">
                    <h4 className="font-display text-sm uppercase tracking-wider mb-4 text-primary">
                      Request Date
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
                          step="1"
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

        {/* Manager Account Creation Form - Manager Only */}
        {user?.role === "manager" && (
          <AnimatePresence>
            {showAccountForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-12 overflow-hidden"
              >
                <div className="glass-card p-8 md:p-10">
                  <h3 className="font-display text-2xl uppercase tracking-wider mb-8">
                    Create <span className="text-primary">New Account</span>
                  </h3>

                  <form onSubmit={handleAccountSubmit(onAccountSubmit)} className="space-y-6">
                    {/* Account Info */}
                    <div>
                      <h4 className="font-display text-sm uppercase tracking-wider mb-4 text-primary">
                        Account Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="mgr-name" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                            Full Name <span className="text-destructive">*</span>
                          </label>
                          <Input
                            id="mgr-name"
                            placeholder="John Doe"
                            {...registerAccount("name", { required: true })}
                            disabled={creatingAccount}
                            className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
                          />
                        </div>
                        <div>
                          <label htmlFor="mgr-email" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                            Email <span className="text-destructive">*</span>
                          </label>
                          <Input
                            id="mgr-email"
                            type="email"
                            placeholder="john@dealership.com"
                            {...registerAccount("email", { required: true })}
                            disabled={creatingAccount}
                            className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
                          />
                        </div>
                        <div>
                          <label htmlFor="mgr-password" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                            Password
                          </label>
                          <div className="relative">
                            <Input
                              id="mgr-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Leave empty to auto-generate"
                              {...registerAccount("password")}
                              disabled={creatingAccount}
                              className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="mgr-role" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                            Role <span className="text-destructive">*</span>
                          </label>
                          <select
                            {...registerAccount("role")}
                            disabled={creatingAccount}
                            className="w-full bg-background/50 border border-border/50 text-foreground px-3 py-2 rounded-sm text-sm"
                          >
                            <option value="sales_rep">Sales Rep</option>
                            <option value="manager">Manager</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Security Question */}
                    <div className="border-t border-border/20 pt-6">
                      <h4 className="font-display text-sm uppercase tracking-wider mb-4 text-primary">
                        Account Recovery
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="mgr-question" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                            Security Question <span className="text-destructive">*</span>
                          </label>
                          <select
                            {...registerAccount("securityQuestion", { required: true })}
                            disabled={creatingAccount}
                            className="w-full bg-background/50 border border-border/50 text-foreground px-3 py-2 rounded-sm text-sm"
                          >
                            {SECURITY_QUESTIONS.map((q) => (
                              <option key={q} value={q}>
                                {q}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="mgr-answer" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                            Answer <span className="text-destructive">*</span>
                          </label>
                          <Input
                            id="mgr-answer"
                            placeholder="Your answer"
                            {...registerAccount("securityAnswer", { required: true })}
                            disabled={creatingAccount}
                            className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="border-t border-border/20 pt-6 flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowAccountForm(false);
                          resetAccountForm();
                        }}
                        disabled={creatingAccount}
                        className="flex-1 border-border/30 hover:bg-card text-foreground font-display uppercase tracking-widest text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={creatingAccount}
                        className="flex-1 bg-primary hover:bg-primary text-primary-foreground font-display uppercase tracking-widest text-xs"
                      >
                        {creatingAccount ? "Creating Account..." : "Create Account"}
                      </Button>
                    </div>
                  </form>

                  {generatedPassword && (
                    <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-sm">
                      <p className="text-xs font-display uppercase tracking-wider text-primary mb-2">
                        Generated Password
                      </p>
                      <div className="flex gap-2">
                        <code className="flex-1 bg-background/50 p-2 rounded text-sm text-foreground font-mono">
                          {generatedPassword}
                        </code>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedPassword);
                            toast({
                              title: "Copied",
                              description: "Password copied to clipboard",
                            });
                          }}
                          className="border-border/30 hover:bg-card"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Account Management Form - Admin Only */}
        {user?.role === "admin" && activeTab === "accounts" && (
          <AnimatePresence>
            {showAccountForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-12 overflow-hidden"
              >
                <div className="glass-card p-8 md:p-10">
                  <h3 className="font-display text-2xl uppercase tracking-wider mb-8">
                    Create <span className="text-primary">New Account</span>
                  </h3>

                  <form onSubmit={handleAccountSubmit(onAccountSubmit)} className="space-y-6">
                    {/* Account Info */}
                    <div>
                      <h4 className="font-display text-sm uppercase tracking-wider mb-4 text-primary">
                        Account Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="acc-name" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                            Full Name <span className="text-destructive">*</span>
                          </label>
                          <Input
                            id="acc-name"
                            placeholder="John Doe"
                            {...registerAccount("name", { required: true })}
                            disabled={creatingAccount}
                            className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
                          />
                        </div>
                        <div>
                          <label htmlFor="acc-email" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                            Email <span className="text-destructive">*</span>
                          </label>
                          <Input
                            id="acc-email"
                            type="email"
                            placeholder="email@dealership.com"
                            {...registerAccount("email", { required: true })}
                            disabled={creatingAccount}
                            className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Password & Role */}
                    <div className="border-t border-border/20 pt-6">
                      <h4 className="font-display text-sm uppercase tracking-wider mb-4 text-primary">
                        Access Settings
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="acc-password" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                            Password <span className="text-destructive">*</span>
                          </label>
                          <div className="relative">
                            <Input
                              id="acc-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Leave empty to auto-generate"
                              {...registerAccount("password")}
                              disabled={creatingAccount}
                              className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="acc-role" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                            Role <span className="text-destructive">*</span>
                          </label>
                          <select
                            {...registerAccount("role")}
                            disabled={creatingAccount}
                            className="w-full bg-background/50 border border-border/50 text-foreground px-3 py-2 rounded-sm text-sm"
                          >
                            <option value="sales_rep">Sales Rep</option>
                            <option value="manager">Manager</option>
                            {user?.role === "admin" && <option value="admin">Admin</option>}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Security Question */}
                    <div className="border-t border-border/20 pt-6">
                      <h4 className="font-display text-sm uppercase tracking-wider mb-4 text-primary">
                        Account Recovery
                      </h4>
                      <p className="text-xs text-muted-foreground mb-4">
                        Set up a security question for account recovery if the password is forgotten.
                      </p>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="sec-question" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                            Security Question <span className="text-destructive">*</span>
                          </label>
                          <select
                            id="sec-question"
                            {...registerAccount("securityQuestion", { required: true })}
                            disabled={creatingAccount}
                            className="w-full bg-background/50 border border-border/50 text-foreground px-3 py-2 rounded-sm text-sm"
                          >
                            {SECURITY_QUESTIONS.map((q) => (
                              <option key={q} value={q}>{q}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="sec-answer" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                            Answer <span className="text-destructive">*</span>
                          </label>
                          <Input
                            id="sec-answer"
                            type="text"
                            placeholder="Your answer"
                            {...registerAccount("securityAnswer", { required: true })}
                            disabled={creatingAccount}
                            className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50"
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            This answer is case-insensitive and will be trimmed of spaces.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Generated Password Display */}
                    {generatedPassword && (
                      <div className="border-t border-border/20 pt-6">
                        <div className="bg-primary/10 border border-primary/30 p-4 rounded-sm">
                          <p className="text-xs font-display uppercase tracking-wider text-primary mb-3">
                            Auto-Generated Password
                          </p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 bg-background/50 px-3 py-2 rounded text-sm font-mono text-foreground break-all">
                              {generatedPassword}
                            </code>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(generatedPassword);
                                toast({
                                  title: "Copied",
                                  description: "Password copied to clipboard",
                                });
                              }}
                              className="p-2 hover:bg-primary/20 transition-colors rounded"
                            >
                              <Copy className="w-4 h-4 text-primary" />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Share this password securely with the new user. They can change it after logging in.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Form Actions */}
                    <div className="border-t border-border/20 pt-6 flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowAccountForm(false);
                          setGeneratedPassword("");
                          resetAccountForm();
                        }}
                        disabled={creatingAccount}
                        className="flex-1 border-border/30 hover:bg-card text-foreground font-display uppercase tracking-widest text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={creatingAccount}
                        className="flex-1 bg-primary hover:bg-primary text-primary-foreground font-display uppercase tracking-widest text-xs"
                      >
                        {creatingAccount ? "Creating Account..." : "Create Account"}
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Account Management Info - Admin Only */}
        {user?.role === "admin" && activeTab === "accounts" && !showAccountForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            {/* Header Section */}
            <div className="glass-card p-8 text-center mb-8">
              <Users className="w-12 h-12 text-primary/20 mx-auto mb-4" />
              <h3 className="font-display text-xl uppercase tracking-wider mb-2">
                Account Management
              </h3>
              <p className="text-muted-foreground mb-6">
                Create and manage user accounts for your dealership team. Click "Create Account" to add new team members.
              </p>
            </div>

            {/* Team Members List */}
            <div className="glass-card p-8">
              <h4 className="font-display text-lg uppercase tracking-wider mb-6">Team Members</h4>

              {loadingUsers ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading team members...</p>
                </div>
              ) : teamUsers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No team members created yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/20">
                        <TableHead className="font-display uppercase tracking-wider text-xs">Email</TableHead>
                        <TableHead className="font-display uppercase tracking-wider text-xs">Name</TableHead>
                        <TableHead className="font-display uppercase tracking-wider text-xs">Role</TableHead>
                        <TableHead className="font-display uppercase tracking-wider text-xs">Status</TableHead>
                        <TableHead className="font-display uppercase tracking-wider text-xs">Created</TableHead>
                        <TableHead className="font-display uppercase tracking-wider text-xs">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamUsers.map((member) => (
                        <TableRow key={member.id} className="border-border/20 hover:bg-background/50 transition-colors">
                          <TableCell className="font-mono text-sm">{member.email}</TableCell>
                          <TableCell>{member.name || "—"}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-display uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                              {member.role}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-display uppercase tracking-wider ${
                              member.is_active
                                ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                                : 'bg-red-500/10 text-red-600 border border-red-500/20'
                            }`}>
                              {member.is_active ? "Active" : "Inactive"}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {member.created_at ? new Date(member.created_at).toLocaleDateString() : "—"}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setUserToResetPassword(member);
                                  setNewPassword("");
                                  setShowResetDialog(true);
                                }}
                                className="inline-flex items-center gap-1 px-2 py-1.5 rounded text-xs text-primary hover:bg-primary/10 transition-colors"
                                title="Reset password"
                              >
                                <span>Reset</span>
                              </button>
                              <button
                                onClick={() => {
                                  setUserToDelete(member);
                                  setShowDeleteDialog(true);
                                }}
                                className="inline-flex items-center gap-1 px-2 py-1.5 rounded text-xs text-destructive hover:bg-destructive/10 transition-colors"
                                title="Delete user account"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Account Activity Log - Admin Only */}
        {user?.role === "admin" && activeTab === "activity" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-card overflow-hidden">
              <div className="p-6 border-b border-border/20">
                <h3 className="font-display text-xl uppercase tracking-wider">
                  Account <span className="text-primary">Activity Log</span>
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Track all account creation, deletion, and password reset activities
                </p>
              </div>

              {loadingActivity ? (
                <div className="p-12 text-center text-muted-foreground">
                  Loading activity log...
                </div>
              ) : accountActivity.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  No account activities recorded yet
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="border-b border-border/30">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                          Date & Time
                        </TableHead>
                        <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                          Action
                        </TableHead>
                        <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                          Target Account
                        </TableHead>
                        <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                          Performed By
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accountActivity.map((activity: any) => (
                        <TableRow key={activity.id} className="border-b border-border/20 hover:bg-card/50 transition-colors">
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(activity.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <span className={`text-xs font-display uppercase tracking-wider px-3 py-1 rounded-sm inline-block ${
                              activity.action_type === 'create'
                                ? 'bg-primary/20 text-primary'
                                : activity.action_type === 'delete'
                                  ? 'bg-destructive/20 text-destructive'
                                  : 'bg-blue-500/20 text-blue-500'
                            }`}>
                              {activity.action_type === 'create' && 'Account Created'}
                              {activity.action_type === 'delete' && 'Account Deleted'}
                              {activity.action_type === 'password_reset' && 'Password Reset'}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs text-foreground">
                            <div>
                              <p className="font-medium">{activity.target_user_name || activity.target_user?.name || '-'}</p>
                              <p className="text-muted-foreground">{activity.target_user_email || activity.target_user?.email || '-'}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-foreground">
                            <div>
                              <p className="font-medium">{activity.actor?.name || 'System'}</p>
                              <p className="text-muted-foreground">{activity.actor?.email || '-'}</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Show Stats and Requests only on Requests Tab */}
        {activeTab === "requests" && (
          <>
        {/* Admin View - Stats Cards */}
        {user?.role === "admin" && (
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
        )}

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

          {user?.role === "admin" && (
            <div className="flex gap-2 ml-auto">
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-primary hover:bg-primary text-primary-foreground font-display uppercase tracking-widest text-xs"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <Button
                onClick={handleExport}
                className="bg-primary hover:bg-primary text-primary-foreground font-display uppercase tracking-widest text-xs"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Dialog open={showDateRangeDialog} onOpenChange={setShowDateRangeDialog}>
                <Button
                  onClick={() => setShowDateRangeDialog(true)}
                  className="bg-primary hover:bg-primary text-primary-foreground font-display uppercase tracking-widest text-xs"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export by Date
                </Button>
                <DialogContent className="bg-card border-border/30">
                  <DialogHeader>
                    <DialogTitle className="font-display uppercase tracking-wider">
                      Export by Date Range
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Select a date range or time period to export service requests
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded border border-border/30 hover:bg-background/50 transition-colors">
                        <input
                          type="radio"
                          name="dateRange"
                          value="thisWeek"
                          checked={dateRangeOption === "thisWeek"}
                          onChange={(e) => setDateRangeOption(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">This Week</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded border border-border/30 hover:bg-background/50 transition-colors">
                        <input
                          type="radio"
                          name="dateRange"
                          value="lastWeek"
                          checked={dateRangeOption === "lastWeek"}
                          onChange={(e) => setDateRangeOption(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">Last Week</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded border border-border/30 hover:bg-background/50 transition-colors">
                        <input
                          type="radio"
                          name="dateRange"
                          value="thisMonth"
                          checked={dateRangeOption === "thisMonth"}
                          onChange={(e) => setDateRangeOption(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">This Month</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded border border-border/30 hover:bg-background/50 transition-colors">
                        <input
                          type="radio"
                          name="dateRange"
                          value="lastMonth"
                          checked={dateRangeOption === "lastMonth"}
                          onChange={(e) => setDateRangeOption(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">Last Month</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded border border-border/30 hover:bg-background/50 transition-colors">
                        <input
                          type="radio"
                          name="dateRange"
                          value="custom"
                          checked={dateRangeOption === "custom"}
                          onChange={(e) => setDateRangeOption(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">Custom Range</span>
                      </label>
                    </div>

                    {dateRangeOption === "custom" && (
                      <div className="space-y-3 border-t border-border/30 pt-4">
                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">Start Date</label>
                          <input
                            type="date"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                            className="w-full px-3 py-2 bg-background/50 border border-border/30 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">End Date</label>
                          <input
                            type="date"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                            className="w-full px-3 py-2 bg-background/50 border border-border/30 rounded text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-border/30">
                    <Button
                      variant="outline"
                      onClick={() => setShowDateRangeDialog(false)}
                      disabled={isExportingByDate}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleExportByDateRange}
                      disabled={isExportingByDate}
                      className="bg-primary hover:bg-primary text-primary-foreground"
                    >
                      {isExportingByDate ? "Exporting..." : "Export"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
                <Button
                  onClick={() => setShowDeleteAllDialog(true)}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-display uppercase tracking-widest text-xs"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete All
                </Button>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete All Requests?</DialogTitle>
                    <DialogDescription>
                      This will permanently delete all service requests from your dashboard. This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex gap-3 justify-end mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteAllDialog(false)}
                      disabled={isDeletingAllRequests}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAllRequests}
                      disabled={isDeletingAllRequests}
                    >
                      {isDeletingAllRequests ? "Deleting..." : "Delete All"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </motion.div>

        {/* Requests Table - Admin Only */}
        {user?.role === "admin" && (
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
                      Date Requested
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
                      Status
                    </TableHead>
                    <TableHead className="font-display uppercase tracking-wider text-xs text-muted-foreground">
                      Completion Date
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
                      <TableCell colSpan={11} className="text-center py-12 text-muted-foreground">
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
                        <TableCell className="text-xs">
                          <div className="flex flex-col gap-1">
                            <span className="text-foreground font-medium">{request.requestedBy}</span>
                            {request.requesterRole && (
                              <span className="text-muted-foreground capitalize text-xs">
                                {request.requesterRole.replace(/_/g, ' ')}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {request.dateRequested || "-"}
                        </TableCell>
                        <TableCell className="text-xs text-foreground">
                          {request.year} {request.make} {request.model}
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
                                  : "bg-card/50 text-muted-foreground border border-border/30"
                              }`}
                            >
                              {request.status}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {request.status === "Completed" && request.completionDate
                            ? request.completionDate
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {user?.role === "admin" && editingId === request.id ? (
                            <div className="flex gap-1">
                              <Input
                                type="number"
                                step="1"
                                value={editingPrice || ""}
                                onChange={(e) => setEditingPrice(e.target.value ? parseFloat(e.target.value) : 0)}
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
                            <Dialog open={editingRequest?.id === request.id} onOpenChange={(open) => !open && setEditingRequest(null)}>
                            <DialogTrigger asChild>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleOpenRequestDetails(request)}
                                  title="Edit request details"
                                  className="h-7 px-2 text-primary hover:bg-card"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                {request.status === "Pending" && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setRequestToDelete(request);
                                      setShowDeleteRequestDialog(true);
                                    }}
                                    title="Delete pending request"
                                    className="h-7 px-2 text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </DialogTrigger>
                            {editingRequest?.id === request.id && (
                            <DialogContent className="bg-card border-border/30 max-w-3xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="font-display text-xl uppercase tracking-wider">
                                  Manage Request {editingRequest.requestNumber}
                                </DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                  {editingRequest.status === "Pending"
                                    ? "Update all details for this pending request"
                                    : "Edit completion date and pricing for this request"}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-6">
                                {/* Request Info */}
                                <div className="border-b border-border/20 pb-6">
                                  <h4 className="font-display text-sm uppercase tracking-wider mb-4 text-primary">
                                    Request Information
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label htmlFor="stock-vin" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                                        Stock/VIN
                                      </label>
                                      <Input
                                        id="stock-vin"
                                        type="text"
                                        value={editingStockVin}
                                        onChange={(e) => setEditingStockVin(e.target.value)}
                                        className="bg-card/50 border-border/30 text-foreground"
                                      />
                                    </div>
                                    <div>
                                      <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                                        PO#
                                      </p>
                                      <p className="text-sm text-foreground">{editingRequest.poNumber || "-"}</p>
                                    </div>
                                    <div>
                                      <label htmlFor="vehicle-year" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                                        Vehicle Year
                                      </label>
                                      <Input
                                        id="vehicle-year"
                                        type="number"
                                        value={editingVehicle.year}
                                        onChange={(e) => setEditingVehicle({ ...editingVehicle, year: parseInt(e.target.value) || new Date().getFullYear() })}
                                        className="bg-card/50 border-border/30 text-foreground"
                                      />
                                    </div>
                                    <div>
                                      <label htmlFor="vehicle-make" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                                        Make
                                      </label>
                                      <Input
                                        id="vehicle-make"
                                        type="text"
                                        value={editingVehicle.make}
                                        onChange={(e) => setEditingVehicle({ ...editingVehicle, make: e.target.value })}
                                        className="bg-card/50 border-border/30 text-foreground"
                                      />
                                    </div>
                                    <div>
                                      <label htmlFor="vehicle-model" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                                        Model
                                      </label>
                                      <Input
                                        id="vehicle-model"
                                        type="text"
                                        value={editingVehicle.model}
                                        onChange={(e) => setEditingVehicle({ ...editingVehicle, model: e.target.value })}
                                        className="bg-card/50 border-border/30 text-foreground"
                                      />
                                    </div>
                                    <div>
                                      <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                                        Requested By
                                      </p>
                                      <p className="text-sm text-foreground">{editingRequest.requestedBy}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Manager & Services */}
                                <div className="border-b border-border/20 pb-6">
                                  <h4 className="font-display text-sm uppercase tracking-wider mb-4 text-primary">
                                    Manager & Services
                                  </h4>
                                  <div className="space-y-4">
                                    <div>
                                      <label htmlFor="main-services" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                                        Main Services
                                      </label>
                                      <Input
                                        id="main-services"
                                        type="text"
                                        value={mainServicesInput}
                                        onChange={(e) => setMainServicesInput(e.target.value)}
                                        onBlur={(e) => {
                                          const services = e.target.value.split(",").map(s => s.trim()).filter(s => s);
                                          setEditingMainServices(services);
                                          setMainServicesInput(services.join(", "));
                                        }}
                                        placeholder="Enter services separated by commas"
                                        className="bg-card/50 border-border/30 text-foreground"
                                      />
                                    </div>
                                    <div>
                                      <label htmlFor="additional-services" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                                        Additional Services
                                      </label>
                                      <Input
                                        id="additional-services"
                                        type="text"
                                        value={additionalServicesInput}
                                        onChange={(e) => setAdditionalServicesInput(e.target.value)}
                                        onBlur={(e) => {
                                          const services = e.target.value.split(",").map(s => s.trim()).filter(s => s);
                                          setEditingAdditionalServices(services);
                                          setAdditionalServicesInput(services.join(", "));
                                        }}
                                        placeholder="Enter services separated by commas"
                                        className="bg-card/50 border-border/30 text-foreground"
                                      />
                                    </div>
                                    {editingRequest.status === "Pending" ? (
                                      <div>
                                        <label htmlFor="notes" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                                          Notes
                                        </label>
                                        <Textarea
                                          id="notes"
                                          value={editingNotes}
                                          onChange={(e) => setEditingNotes(e.target.value)}
                                          placeholder="Add any notes for this request"
                                          className="bg-card/50 border-border/30 text-foreground min-h-20"
                                        />
                                      </div>
                                    ) : (
                                      editingRequest.notes && (
                                        <div>
                                          <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                                            Notes
                                          </p>
                                          <p className="text-sm text-foreground bg-background/50 p-3 rounded-sm border border-border/30">
                                            {editingRequest.notes}
                                          </p>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>


                                {/* Status & Price */}
                                <div className="border-b border-border/20 pb-6">
                                  <h4 className="font-display text-sm uppercase tracking-wider mb-4 text-primary">
                                    Status & Pricing
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                                        Status
                                      </label>
                                      <Select value={editingStatus} onValueChange={setEditingStatus}>
                                        <SelectTrigger className="bg-card/50 border-border/30 text-foreground">
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
                                    </div>
                                    <div>
                                      <label htmlFor="dialog-price" className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-3">
                                        Price
                                      </label>
                                      <Input
                                        id="dialog-price"
                                        type="number"
                                        step="1"
                                        value={editingPrice || ""}
                                        onChange={(e) => setEditingPrice(e.target.value ? parseFloat(e.target.value) : 0)}
                                        className="bg-card/50 border-border/30 text-foreground"
                                      />
                                    </div>
                                  </div>
                                </div>


                                {/* Save Buttons */}
                                <div className="border-t border-border/20 pt-6 flex gap-4">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingRequest(null)}
                                    disabled={isSavingDates}
                                    className="flex-1 border-border/30 hover:bg-card text-foreground"
                                  >
                                    Close
                                  </Button>
                                  {editingRequest.status === "Pending" && (
                                    <Button
                                      type="button"
                                      onClick={async () => {
                                        setIsSavingDates(true);
                                        try {
                                          const completionDate = editingStatus === "Completed" ? new Date().toISOString().split('T')[0] : editingDates.completionDate;
                                          const completionTime = editingStatus === "Completed" ? new Date().toTimeString().split(' ')[0] : editingDates.completionTime;

                                          await updateRequest(editingRequest.id, {
                                            status: editingStatus as ServiceRequest["status"],
                                            price: editingPrice,
                                            mainServices: editingMainServices,
                                            additionalServices: editingAdditionalServices,
                                            notes: editingNotes,
                                            year: editingVehicle.year,
                                            make: editingVehicle.make,
                                            model: editingVehicle.model,
                                            color: editingVehicle.color,
                                            stockVin: editingStockVin,
                                            completionDate: completionDate,
                                            completionTime: completionTime,
                                          });
                                          markAsActed(editingRequest.id);
                                          toast({
                                            title: "Updated",
                                            description: "Request has been updated successfully.",
                                          });
                                          setEditingRequest(null);
                                        } catch (error: any) {
                                          toast({
                                            title: "Error",
                                            description: error?.message || "Failed to update request.",
                                            variant: "destructive",
                                          });
                                        } finally {
                                          setIsSavingDates(false);
                                        }
                                      }}
                                      disabled={isSavingDates}
                                      className="flex-1 bg-primary hover:bg-primary text-primary-foreground"
                                    >
                                      {isSavingDates ? "Saving..." : "Save All Changes"}
                                    </Button>
                                  )}
                                  {editingRequest.status !== "Pending" && (
                                    <Button
                                      type="button"
                                      onClick={async () => {
                                        setIsSavingDates(true);
                                        try {
                                          const completionDate = editingStatus === "Completed" ? new Date().toISOString().split('T')[0] : editingDates.completionDate;
                                          const completionTime = editingStatus === "Completed" ? new Date().toTimeString().split(' ')[0] : editingDates.completionTime;

                                          await updateRequest(editingRequest.id, {
                                            price: editingPrice,
                                            mainServices: editingMainServices,
                                            additionalServices: editingAdditionalServices,
                                            year: editingVehicle.year,
                                            make: editingVehicle.make,
                                            model: editingVehicle.model,
                                            color: editingVehicle.color,
                                            stockVin: editingStockVin,
                                            status: editingStatus as ServiceRequest["status"],
                                          });
                                          markAsActed(editingRequest.id);
                                          toast({
                                            title: "Updated",
                                            description: "Request has been updated successfully.",
                                          });
                                          setEditingRequest(null);
                                        } catch (error: any) {
                                          toast({
                                            title: "Error",
                                            description: error?.message || "Failed to update request.",
                                            variant: "destructive",
                                          });
                                        } finally {
                                          setIsSavingDates(false);
                                        }
                                      }}
                                      disabled={isSavingDates}
                                      className="flex-1 bg-primary hover:bg-primary text-primary-foreground"
                                    >
                                      {isSavingDates ? "Saving..." : "Save Changes"}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                            )}
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
        )}

        {/* Sales Rep View - Request Cards */}
        {user?.role !== "admin" && (
        <div className="space-y-6">
          {filteredRequests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-card p-12 text-center"
            >
              <AlertCircle className="w-12 h-12 text-primary/20 mx-auto mb-4" />
              <h3 className="font-display text-xl uppercase tracking-wider mb-2">
                No Requests Yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Create your first service request by clicking "New Request" above.
              </p>
            </motion.div>
          ) : (
            filteredRequests.map((request, idx) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="glass-card p-6"
              >
                {/* Request Header */}
                <div className="flex items-start justify-between mb-6 pb-6 border-b border-border/20">
                  <div>
                    <p className="text-xs font-display uppercase tracking-wider text-primary mb-2">
                      {request.requestNumber}
                    </p>
                    <h3 className="text-lg font-display uppercase tracking-wider">
                      {request.year} {request.make} {request.model}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{request.color} • Stock: {request.stockVin}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-display uppercase tracking-wider px-3 py-1 rounded-sm inline-block ${
                        request.status === "Completed"
                          ? "bg-primary/20 text-primary"
                          : "bg-card/50 text-muted-foreground border border-border/30"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                </div>

                {/* Services */}
                <div className="mb-6 pb-6 border-b border-border/20">
                  <p className="text-xs font-display uppercase tracking-wider text-primary mb-3">
                    Services
                  </p>
                  <div className="space-y-2">
                    {request.mainServices.length > 0 && (
                      <p className="text-sm text-foreground">
                        <span className="text-muted-foreground">Main:</span> {request.mainServices.join(", ")}
                      </p>
                    )}
                    {request.additionalServices.length > 0 && (
                      <p className="text-sm text-foreground">
                        <span className="text-muted-foreground">Additional:</span> {request.additionalServices.join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-6 pb-6 border-b border-border/20">
                  <div>
                    <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                      Price
                    </p>
                    <p className="text-2xl font-display text-primary">${request.price.toFixed(2)}</p>
                  </div>
                </div>

                {/* Timeline - Job Start and Completion */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-background/30 p-4 rounded-sm border border-border/20">
                    <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                      Job Start
                    </p>
                    {request.startDate && request.startTime ? (
                      <p className="text-sm text-foreground font-medium">
                        {request.startDate} at {request.startTime}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">Not scheduled yet</p>
                    )}
                  </div>
                  <div className="bg-background/30 p-4 rounded-sm border border-border/20">
                    <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                      Completion
                    </p>
                    {request.completionDate && request.completionTime ? (
                      <p className="text-sm text-foreground font-medium">
                        {request.completionDate} at {request.completionTime}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">Not completed yet</p>
                    )}
                  </div>
                </div>

                {request.notes && (
                  <div className="mt-6 pt-6 border-t border-border/20">
                    <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                      Notes
                    </p>
                    <p className="text-sm text-foreground">{request.notes}</p>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
        )}
          </>
        )}
      </div>

      {/* Delete Request Dialog */}
      <Dialog open={showDeleteRequestDialog} onOpenChange={setShowDeleteRequestDialog}>
        <DialogContent className="bg-card border-border/30">
          <DialogHeader>
            <DialogTitle className="font-display uppercase tracking-wider">
              Delete Request {requestToDelete?.requestNumber}?
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This action cannot be undone. The request will be permanently deleted from the system.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-end mt-6">
            <Button
              variant="outline"
              onClick={() => setShowDeleteRequestDialog(false)}
              disabled={deletingRequestId !== null}
              className="border-border/30 hover:bg-card"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteRequest}
              disabled={deletingRequestId !== null}
            >
              {deletingRequestId !== null ? "Deleting..." : "Delete Request"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="glass-card border-border/50">
          <DialogHeader>
            <DialogTitle className="font-display uppercase tracking-wider">
              Reset Password
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Reset the password for <span className="font-semibold text-foreground">{userToResetPassword?.email}</span>
            </DialogDescription>
          </DialogHeader>

          {newPassword ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                  New Temporary Password
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPassword}
                    readOnly
                    className="flex-1 px-3 py-2 bg-background/50 border border-border/50 rounded text-sm font-mono"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(newPassword);
                      toast({
                        title: "Copied",
                        description: "Password copied to clipboard",
                      });
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground bg-background/50 p-3 rounded border border-border/30">
                Share this password with the user. They can change it after logging in.
              </p>
              <div className="flex gap-3 justify-end pt-4">
                <Button
                  onClick={() => {
                    setShowResetDialog(false);
                    setUserToResetPassword(null);
                    setNewPassword("");
                  }}
                >
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowResetDialog(false);
                  setUserToResetPassword(null);
                }}
                disabled={resettingPasswordId !== null}
              >
                Cancel
              </Button>
              <Button
                onClick={handleResetPassword}
                disabled={resettingPasswordId !== null}
              >
                {resettingPasswordId ? "Resetting..." : "Generate New Password"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="glass-card border-border/50">
          <DialogHeader>
            <DialogTitle className="font-display uppercase tracking-wider">
              Delete Account
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete the account for{" "}
              <span className="font-semibold text-foreground">{userToDelete?.email}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setUserToDelete(null);
              }}
              disabled={deletingUserId !== null}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={deletingUserId !== null}
            >
              {deletingUserId ? "Deleting..." : "Delete Account"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Request Detail Modal */}
      <RequestDetailModal
        isOpen={selectedRequestForDetail !== null}
        request={selectedRequestForDetail}
        onClose={() => setSelectedRequestForDetail(null)}
        onUpdate={updateRequest}
        onDelete={deleteRequest}
      />
    </main>
  );
}
