import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { formatErrorMessage } from "@/lib/utils";

export interface User {
  email: string;
  name?: string;
  role: "sales_rep" | "admin" | "manager";
  dealership_id?: string;
  id?: string;
  can_view_financial_cards?: boolean;
}

export interface ServiceRequest {
  id: number;
  requestNumber: string;
  requestedBy: string;
  requesterRole?: string;
  manager?: string;
  stockVin: string;
  poNumber?: string;
  vehicleDescription: string;
  year: number;
  make: string;
  model: string;
  color?: string;
  dateRequested: string;
  dueDate?: string;
  dueTime?: string;
  startDate?: string;
  startTime?: string;
  completionDate?: string;
  completionTime?: string;
  mainServices: string[];
  additionalServices: string[];
  notes: string;
  status: "Pending" | "Completed";
  price: number;
  service?: string;
  vin?: string;
  due?: string;
  requestType: "sales" | "service";
  roNumber?: string;
  deletedAt?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  requests: ServiceRequest[];
  addRequest: (request: Omit<ServiceRequest, "id">) => Promise<void>;
  updateRequestStatus: (id: number, status: ServiceRequest["status"]) => Promise<void>;
  updateRequestPrice: (id: number, price: number) => Promise<void>;
  updateRequestDates: (id: number, data: { dueDate?: string; dueTime?: string; startDate?: string; startTime?: string; completionDate?: string; completionTime?: string }) => Promise<void>;
  updateRequest: (id: number, data: Partial<ServiceRequest>) => Promise<void>;
  deleteRequest: (id: number) => Promise<void>;
  newRequestCount: number;
  resetNewRequestCount: () => void;
  deleteAllRequests: () => Promise<void>;
  archiveRequestsByIds: (ids: number[]) => Promise<void>;
  restoreArchivedRequest: (id: number) => Promise<void>;
  getArchivedRequests: () => Promise<ServiceRequest[]>;
  refreshRequests: () => Promise<void>;
  getRequestsByDateRange: (startDate: string, endDate: string) => Promise<ServiceRequest[]>;
  loading: boolean;
}

type ServiceRequestRow = {
  id: number;
  request_number: string;
  requested_by: string;
  requester_role: string | null;
  manager: string | null;
  stock_vin: string;
  po_number: string | null;
  vehicle_description: string | null;
  year: number | null;
  make: string | null;
  model: string | null;
  color: string | null;
  date_requested: string | null;
  due_date: string | null;
  due_time: string | null;
  start_date: string | null;
  start_time: string | null;
  completion_date: string | null;
  completion_time: string | null;
  main_services: string[] | null;
  additional_services: string[] | null;
  notes: string | null;
  status: string;
  price: number;
  request_type: string | null;
  ro_number: string | null;
  deleted_at: string | null;
};

const mapServiceRequest = (req: ServiceRequestRow): ServiceRequest => ({
  id: req.id,
  requestNumber: req.request_number,
  requestedBy: req.requested_by,
  requesterRole: req.requester_role || undefined,
  manager: req.manager || undefined,
  stockVin: req.stock_vin,
  poNumber: req.po_number || undefined,
  vehicleDescription: req.vehicle_description || "",
  year: req.year as number,
  make: req.make || "",
  model: req.model || "",
  color: req.color || undefined,
  dateRequested: req.date_requested || "",
  dueDate: req.due_date || undefined,
  dueTime: req.due_time || undefined,
  startDate: req.start_date || undefined,
  startTime: req.start_time || undefined,
  completionDate: req.completion_date || undefined,
  completionTime: req.completion_time || undefined,
  mainServices: req.main_services || [],
  additionalServices: req.additional_services || [],
  notes: req.notes || "",
  status: req.status as ServiceRequest["status"],
  price: req.price,
  service: req.main_services?.[0],
  vin: req.stock_vin,
  due: `${req.due_date} ${req.due_time}`,
  requestType: (req.request_type || "sales") as ServiceRequest["requestType"],
  roNumber: req.ro_number || undefined,
  deletedAt: req.deleted_at || undefined,
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [newRequestCount, setNewRequestCount] = useState(0);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize auth session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check localStorage for existing session
        const savedSession = localStorage.getItem("dealership-session");
        if (savedSession) {
          const session = JSON.parse(savedSession);
          // Invalidate old sessions that are missing required fields
          if (session?.user && session.user.id && session.user.role) {
            setUser(session.user);
            setIsLoggedIn(true);
            if (session.user.dealership_id) {
              fetchRequests(session.user.dealership_id, session.user.role, session.user.email, session.user.id);
            }
          } else {
            localStorage.removeItem("dealership-session");
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("dealership-session");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchRequests = useCallback(async (dealershipId: string, role: string, userEmail?: string, userId?: string) => {
    try {
      if (userId) {
        const hiddenKey = `hidden_requests_${userId}`;
        const rawHiddenIds = localStorage.getItem(hiddenKey);
        if (rawHiddenIds) {
          const hiddenIds = JSON.parse(rawHiddenIds) as number[];
          if (hiddenIds.length > 0) {
            const { error: archiveError } = await supabase
              .from("service_requests")
              .update({ deleted_at: new Date().toISOString(), deleted_by: userId })
              .eq("dealership_id", dealershipId)
              .in("id", hiddenIds)
              .is("deleted_at", null);
            if (archiveError) throw archiveError;
          }
          localStorage.removeItem(hiddenKey);
        }
      }

      let query = supabase
        .from("service_requests")
        .select("*")
        .eq("dealership_id", dealershipId)
        .is("deleted_at", null);

      if (role === "sales_rep" && userEmail) {
        query = query.eq("requested_by", userEmail);
      }

      const data: ServiceRequestRow[] = [];
      for (let offset = 0; ; offset += 1000) {
        const { data: page, error } = await query
          .order("created_at", { ascending: false })
          .order("id", { ascending: false })
          .range(offset, offset + 999);

        if (error) throw error;
        data.push(...(page || []));
        if (!page || page.length < 1000) break;
      }

      setRequests(data.map(mapServiceRequest));
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      console.error("Error fetching requests:", errorMessage);
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      // Fetch user from database
      const { data: userList, error: queryError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (queryError) {
        console.error("Database query error:", queryError.message);
        throw new Error("Invalid email or password.");
      }

      if (!userList) {
        console.warn("User not found:", email);
        throw new Error("Invalid email or password.");
      }

      if (!userList.is_active) {
        throw new Error("This account is inactive. Contact your administrator.");
      }

      // Verify password hash
      const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      if (passwordHash !== userList.password_hash) {
        console.error("Password hash mismatch for user:", email);
        console.error("Expected:", userList.password_hash);
        console.error("Got:", passwordHash);
        throw new Error("Invalid email or password.");
      }

      // Set user data in context
      setUser({
        email: userList.email,
        name: userList.name,
        role: userList.role,
        dealership_id: userList.dealership_id,
        id: userList.id,
        can_view_financial_cards: userList.can_view_financial_cards,
      });
      setIsLoggedIn(true);

      // Fetch requests for this user
      if (userList.dealership_id) {
        fetchRequests(userList.dealership_id, userList.role, userList.email, userList.id);
      }

      // Store session in localStorage
      localStorage.setItem("dealership-session", JSON.stringify({
        user: {
          email: userList.email,
          name: userList.name,
          role: userList.role,
          dealership_id: userList.dealership_id,
          id: userList.id,
          can_view_financial_cards: userList.can_view_financial_cards,
        }
      }));
    } catch (error: any) {
      console.error("Login error:", error?.message);
      throw new Error(error?.message || "Login failed. Please try again.");
    }
  };

  const logout = async () => {
    try {
      setIsLoggedIn(false);
      setUser(null);
      setRequests([]);
      localStorage.removeItem("dealership-session");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const addRequest = async (requestData: Omit<ServiceRequest, "id">) => {
    try {
      if (!user?.dealership_id) throw new Error("User dealership not found");

      // Generate request number server-side to avoid race conditions
      const { data: lastRequest, error: queryError } = await supabase
        .from("service_requests")
        .select("request_number")
        .eq("dealership_id", user.dealership_id)
        .order("id", { ascending: false })
        .limit(1)
        .single();

      let nextRequestNumber = "REQ-001";
      if (lastRequest?.request_number) {
        const lastNumber = parseInt(lastRequest.request_number.replace("REQ-", ""), 10);
        nextRequestNumber = `REQ-${String(lastNumber + 1).padStart(3, "0")}`;
      }

      const { data, error } = await supabase
        .from("service_requests")
        .insert({
          request_number: nextRequestNumber,
          dealership_id: user.dealership_id,
          requested_by: requestData.requestedBy,
          requester_role: requestData.requesterRole || user.role,
          manager: requestData.manager,
          stock_vin: requestData.stockVin,
          po_number: requestData.poNumber,
          vehicle_description: requestData.vehicleDescription,
          year: requestData.year,
          make: requestData.make,
          model: requestData.model,
          color: requestData.color,
          date_requested: requestData.dateRequested,
          main_services: requestData.mainServices,
          additional_services: requestData.additionalServices,
          notes: requestData.notes,
          status: requestData.status,
          price: requestData.price,
          request_type: requestData.requestType,
          ro_number: requestData.roNumber,
        })
        .select()
        .single();

      if (error) throw error;

      // Broadcast to admins so they refresh instantly (works with anon key, no DB config needed)
      supabase.channel(`new-requests-${user.dealership_id}`)
        .send({ type: "broadcast", event: "new_request", payload: { requestNumber: nextRequestNumber } })
        .catch(() => {/* non-critical */});

      // Refresh requests list
      if (user.dealership_id) {
        fetchRequests(user.dealership_id, user.role, user.email, user.id);
      }

      // Notify admins
      setNewRequestCount((prev) => prev + 1);
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      console.error("Error adding request:", errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateRequestStatus = async (id: number, status: ServiceRequest["status"]) => {
    try {
      const updateData: any = { status };

      // Auto-set completion date and time when status is changed to Completed
      if (status === "Completed") {
        const now = new Date();
        const completionDate = now.toISOString().split("T")[0];
        const completionTime = now.toTimeString().slice(0, 5); // HH:MM format
        updateData.completion_date = completionDate;
        updateData.completion_time = completionTime;
      }

      const { error } = await supabase
        .from("service_requests")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setRequests(requests.map((r) => {
        if (r.id === id) {
          const updatedRequest = { ...r, status };
          if (status === "Completed") {
            const now = new Date();
            updatedRequest.completionDate = now.toISOString().split("T")[0];
            updatedRequest.completionTime = now.toTimeString().slice(0, 5);
          }
          return updatedRequest;
        }
        return r;
      }));
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      console.error("Error updating request status:", errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateRequestPrice = async (id: number, price: number) => {
    try {
      const { error } = await supabase
        .from("service_requests")
        .update({ price })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setRequests(requests.map((r) => (r.id === id ? { ...r, price } : r)));
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      console.error("Error updating request price:", errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateRequestDates = async (id: number, data: { dueDate?: string; dueTime?: string; startDate?: string; startTime?: string; completionDate?: string; completionTime?: string }) => {
    try {
      const updateData: any = {};
      if (data.dueDate) updateData.due_date = data.dueDate;
      if (data.dueTime) updateData.due_time = data.dueTime;
      if (data.startDate) updateData.start_date = data.startDate;
      if (data.startTime) updateData.start_time = data.startTime;
      if (data.completionDate) updateData.completion_date = data.completionDate;
      if (data.completionTime) updateData.completion_time = data.completionTime;

      const { error } = await supabase
        .from("service_requests")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setRequests(requests.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            dueDate: data.dueDate || r.dueDate,
            dueTime: data.dueTime || r.dueTime,
            startDate: data.startDate || r.startDate,
            startTime: data.startTime || r.startTime,
            completionDate: data.completionDate || r.completionDate,
            completionTime: data.completionTime || r.completionTime,
          };
        }
        return r;
      }));
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      console.error("Error updating request dates:", errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateRequest = async (id: number, data: Partial<ServiceRequest>) => {
    try {
      const updateData: any = {};
      const stateUpdate = { ...data };

      // Helper function to handle empty strings for date fields (convert to null)
      const sanitizeDateValue = (value: any) => {
        return value === "" ? null : value;
      };

      // Map ServiceRequest fields to database columns
      if (data.status) {
        updateData.status = data.status;
        // Auto-set completion date and time when status is changed to Completed
        if (data.status === "Completed") {
          const now = new Date();
          const completionDate = now.toISOString().split("T")[0];
          const completionTime = now.toTimeString().slice(0, 5); // HH:MM format
          updateData.completion_date = completionDate;
          updateData.completion_time = completionTime;
          stateUpdate.completionDate = completionDate;
          stateUpdate.completionTime = completionTime;
        }
      }
      if (data.price !== undefined) updateData.price = data.price;
      if (data.manager !== undefined) updateData.manager = data.manager;
      if (data.dueDate !== undefined) updateData.due_date = sanitizeDateValue(data.dueDate);
      if (data.dueTime !== undefined) updateData.due_time = sanitizeDateValue(data.dueTime);
      if (data.startDate !== undefined) updateData.start_date = sanitizeDateValue(data.startDate);
      if (data.startTime !== undefined) updateData.start_time = sanitizeDateValue(data.startTime);
      if (data.completionDate !== undefined) updateData.completion_date = sanitizeDateValue(data.completionDate);
      if (data.completionTime !== undefined) updateData.completion_time = sanitizeDateValue(data.completionTime);
      if (data.mainServices !== undefined) updateData.main_services = data.mainServices;
      if (data.additionalServices !== undefined) updateData.additional_services = data.additionalServices;
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.year !== undefined) updateData.year = data.year;
      if (data.make !== undefined) updateData.make = data.make;
      if (data.model !== undefined) updateData.model = data.model;
      if (data.color !== undefined) updateData.color = data.color;
      if (data.stockVin !== undefined) updateData.stock_vin = data.stockVin;
      if (data.roNumber !== undefined) updateData.ro_number = data.roNumber;

      const { error } = await supabase
        .from("service_requests")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setRequests(requests.map((r) => (r.id === id ? { ...r, ...stateUpdate } : r)));
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      console.error("Error updating request:", errorMessage);
      throw new Error(errorMessage);
    }
  };

  const archiveRequestsByIds = async (ids: number[]) => {
    try {
      if (user?.role !== "admin" || !user.id || !user.dealership_id) throw new Error("Admin access required");
      if (ids.length === 0) return;

      const { error } = await supabase
        .from("service_requests")
        .update({ deleted_at: new Date().toISOString(), deleted_by: user.id })
        .eq("dealership_id", user.dealership_id)
        .in("id", ids)
        .is("deleted_at", null);

      if (error) throw error;
      const archivedIds = new Set(ids);
      setRequests((currentRequests) => currentRequests.filter((request) => !archivedIds.has(request.id)));
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      console.error("Error archiving requests:", errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteRequest = async (id: number) => archiveRequestsByIds([id]);

  const deleteAllRequests = async () => {
    try {
      if (user?.role !== "admin" || !user.id || !user.dealership_id) throw new Error("Admin access required");

      const { error } = await supabase
        .from("service_requests")
        .update({ deleted_at: new Date().toISOString(), deleted_by: user.id })
        .eq("dealership_id", user.dealership_id)
        .is("deleted_at", null);

      if (error) throw error;
      setRequests([]);
      setNewRequestCount(0);
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      console.error("Error archiving all requests:", errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getArchivedRequests = useCallback(async () => {
    try {
      if (user?.role !== "admin" || !user.dealership_id) throw new Error("Admin access required");

      const data: ServiceRequestRow[] = [];
      for (let offset = 0; ; offset += 1000) {
        const { data: page, error } = await supabase
          .from("service_requests")
          .select("*")
          .eq("dealership_id", user.dealership_id)
          .not("deleted_at", "is", null)
          .order("deleted_at", { ascending: false })
          .order("id", { ascending: false })
          .range(offset, offset + 999);

        if (error) throw error;
        data.push(...(page || []));
        if (!page || page.length < 1000) break;
      }
      return data.map(mapServiceRequest);
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      console.error("Error fetching archived requests:", errorMessage);
      throw new Error(errorMessage);
    }
  }, [user?.role, user?.dealership_id]);

  const restoreArchivedRequest = async (id: number) => {
    try {
      if (user?.role !== "admin" || !user.dealership_id) throw new Error("Admin access required");

      const { error } = await supabase
        .from("service_requests")
        .update({ deleted_at: null, deleted_by: null })
        .eq("dealership_id", user.dealership_id)
        .eq("id", id)
        .not("deleted_at", "is", null);

      if (error) throw error;
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      console.error("Error restoring archived request:", errorMessage);
      throw new Error(errorMessage);
    }
  };

  const resetNewRequestCount = () => {
    setNewRequestCount(0);
  };

  const refreshRequests = useCallback(async () => {
    try {
      if (user?.dealership_id) {
        await fetchRequests(user.dealership_id, user.role, user.email, user.id);
      }
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      console.error("Error refreshing requests:", errorMessage);
      throw new Error(errorMessage);
    }
  }, [user?.dealership_id, user?.role, user?.email, user?.id, fetchRequests]);

  const getRequestsByDateRange = async (startDate: string, endDate: string): Promise<ServiceRequest[]> => {
    try {
      if (!user?.dealership_id) throw new Error("User dealership not found");

      // Add one day to endDate to include the entire end date
      const endDateObj = new Date(endDate);
      endDateObj.setDate(endDateObj.getDate() + 1);
      const adjustedEndDate = endDateObj.toISOString().split("T")[0];

      const data: ServiceRequestRow[] = [];
      for (let offset = 0; ; offset += 1000) {
        const { data: page, error } = await supabase
          .from("service_requests")
          .select("*")
          .eq("dealership_id", user.dealership_id)
          .is("deleted_at", null)
          .gte("date_requested", startDate)
          .lt("date_requested", adjustedEndDate)
          .order("date_requested", { ascending: false })
          .order("id", { ascending: false })
          .range(offset, offset + 999);

        if (error) throw error;
        data.push(...(page || []));
        if (!page || page.length < 1000) break;
      }

      return data.map(mapServiceRequest);
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      console.error("Error fetching requests by date range:", errorMessage);
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        requests,
        addRequest,
        updateRequestStatus,
        updateRequestPrice,
        updateRequestDates,
        updateRequest,
        deleteRequest,
        newRequestCount,
        resetNewRequestCount,
        deleteAllRequests,
        archiveRequestsByIds,
        restoreArchivedRequest,
        getArchivedRequests,
        refreshRequests,
        getRequestsByDateRange,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
