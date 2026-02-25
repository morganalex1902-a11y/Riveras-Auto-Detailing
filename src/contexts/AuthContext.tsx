import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface User {
  email: string;
  name?: string;
  role: "sales_rep" | "admin" | "manager";
  dealership_id?: string;
  id?: string;
}

export interface ServiceRequest {
  id: number;
  requestNumber: string;
  requestedBy: string;
  manager?: string;
  stockVin: string;
  poNumber?: string;
  vehicleDescription: string;
  year: number;
  make: string;
  model: string;
  color: string;
  dateRequested: string;
  dueDate: string;
  dueTime: string;
  startDate?: string;
  startTime?: string;
  completionDate?: string;
  completionTime?: string;
  mainServices: string[];
  additionalServices: string[];
  notes: string;
  status: "Pending" | "In Progress" | "Completed";
  price: number;
  service?: string;
  vin?: string;
  due?: string;
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
  newRequestCount: number;
  resetNewRequestCount: () => void;
  loading: boolean;
}

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
          if (session?.user) {
            setUser(session.user);
            setIsLoggedIn(true);
            // Fetch requests for this user's dealership
            if (session.user.dealership_id) {
              fetchRequests(session.user.dealership_id, session.user.role, session.user.email);
            }
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

  const fetchRequests = async (dealershipId: string, role: string, userEmail?: string) => {
    try {
      let query = supabase
        .from("service_requests")
        .select("*")
        .eq("dealership_id", dealershipId);

      if (role === "sales_rep" && userEmail) {
        query = query.eq("requested_by", userEmail);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;

      const formattedRequests: ServiceRequest[] = (data || []).map((req: any) => ({
        id: req.id,
        requestNumber: req.request_number,
        requestedBy: req.requested_by,
        manager: req.manager,
        stockVin: req.stock_vin,
        poNumber: req.po_number,
        vehicleDescription: req.vehicle_description,
        year: req.year,
        make: req.make,
        model: req.model,
        color: req.color,
        dateRequested: req.date_requested,
        dueDate: req.due_date,
        dueTime: req.due_time,
        startDate: req.start_date,
        startTime: req.start_time,
        completionDate: req.completion_date,
        completionTime: req.completion_time,
        mainServices: req.main_services || [],
        additionalServices: req.additional_services || [],
        notes: req.notes,
        status: req.status,
        price: req.price,
        service: req.main_services?.[0],
        vin: req.stock_vin,
        due: `${req.due_date} ${req.due_time}`,
      }));

      setRequests(formattedRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      // Fetch user from database
      const { data: userList, error: queryError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (queryError) {
        console.error("Database query error:", queryError);
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
      });
      setIsLoggedIn(true);

      // Fetch requests for this user
      if (userList.dealership_id) {
        fetchRequests(userList.dealership_id, userList.role, userList.email);
      }

      // Store session in localStorage
      localStorage.setItem("dealership-session", JSON.stringify({
        user: {
          email: userList.email,
          name: userList.name,
          role: userList.role,
          dealership_id: userList.dealership_id,
          id: userList.id,
        }
      }));
    } catch (error: any) {
      console.error("Login error:", error);
      console.error("Error details:", {
        message: error?.message,
        code: error?.code,
        status: error?.status,
        hint: error?.hint,
      });
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
          manager: requestData.manager,
          stock_vin: requestData.stockVin,
          po_number: requestData.poNumber,
          vehicle_description: requestData.vehicleDescription,
          year: requestData.year,
          make: requestData.make,
          model: requestData.model,
          color: requestData.color,
          date_requested: requestData.dateRequested,
          due_date: requestData.dueDate,
          due_time: requestData.dueTime,
          main_services: requestData.mainServices,
          additional_services: requestData.additionalServices,
          notes: requestData.notes,
          status: requestData.status,
          price: requestData.price,
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh requests list
      if (user.dealership_id) {
        fetchRequests(user.dealership_id, user.role);
      }

      // Notify admins
      setNewRequestCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error adding request:", error);
      throw error;
    }
  };

  const updateRequestStatus = async (id: number, status: ServiceRequest["status"]) => {
    try {
      const { error } = await supabase
        .from("service_requests")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setRequests(requests.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch (error) {
      console.error("Error updating request status:", error);
      throw error;
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
      console.error("Error updating request price:", error);
      throw error;
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
      console.error("Error updating request dates:", error);
      throw error;
    }
  };

  const resetNewRequestCount = () => {
    setNewRequestCount(0);
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
        newRequestCount,
        resetNewRequestCount,
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
