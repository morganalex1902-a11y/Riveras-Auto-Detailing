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
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Fetch user profile from users table
          const { data: userProfile } = await supabase
            .from("users")
            .select("*")
            .eq("auth_id", session.user.id)
            .single();

          if (userProfile) {
            setUser({
              email: userProfile.email,
              name: userProfile.name,
              role: userProfile.role,
              dealership_id: userProfile.dealership_id,
              id: userProfile.id,
            });
            setIsLoggedIn(true);
            // Fetch requests for this user's dealership
            fetchRequests(userProfile.dealership_id, userProfile.role);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          const { data: userProfile, error } = await supabase
            .from("users")
            .select("*")
            .eq("auth_id", session.user.id)
            .single();

          if (error) {
            console.error("Error fetching user profile:", error);
            return;
          }

          if (userProfile) {
            setUser({
              email: userProfile.email,
              name: userProfile.name,
              role: userProfile.role,
              dealership_id: userProfile.dealership_id,
              id: userProfile.id,
            });
            setIsLoggedIn(true);
            // Fetch requests for this user's dealership
            if (userProfile.dealership_id) {
              fetchRequests(userProfile.dealership_id, userProfile.role);
            }
          }
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchRequests = async (dealershipId: string, role: string) => {
    try {
      let query = supabase
        .from("service_requests")
        .select("*")
        .eq("dealership_id", dealershipId);

      if (role === "sales_rep") {
        const { data: currentUser } = await supabase.auth.getUser();
        if (currentUser.user?.email) {
          query = query.eq("requested_by", currentUser.user.email);
        }
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Auth error:", error);
        throw new Error(error.message || "Authentication failed. Please check your credentials.");
      }

      if (!data.session) {
        throw new Error("No session created. Please try again.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error?.message || "Login failed. Please try again.");
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setUser(null);
      setRequests([]);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const addRequest = async (requestData: Omit<ServiceRequest, "id">) => {
    try {
      if (!user?.dealership_id) throw new Error("User dealership not found");

      const { data, error } = await supabase
        .from("service_requests")
        .insert({
          request_number: requestData.requestNumber,
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
