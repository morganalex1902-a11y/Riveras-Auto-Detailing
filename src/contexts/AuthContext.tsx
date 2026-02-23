import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  email: string;
  name?: string;
  role: "sales_rep" | "admin";
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
  addRequest: (request: Omit<ServiceRequest, "id">) => void;
  updateRequestStatus: (id: number, status: ServiceRequest["status"]) => void;
  updateRequestPrice: (id: number, price: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>([
    {
      id: 1,
      requestNumber: "REQ-001",
      requestedBy: "robert@salesdealership.com",
      manager: "manager@dealership.com",
      stockVin: "1HGCM82633A004352",
      poNumber: "PO-2024-001",
      vehicleDescription: "Customer vehicle - Trade-in",
      year: 2023,
      make: "Honda",
      model: "Accord",
      color: "Silver",
      dateRequested: "2026-02-23",
      dueDate: "2026-02-25",
      dueTime: "14:00",
      mainServices: ["N/C Delivery", "Clean for Showroom"],
      additionalServices: [],
      notes: "Need ready before customer pickup",
      status: "Pending",
      price: 0,
      service: "N/C Delivery",
      vin: "1HGCM82633A004352",
      due: "2026-02-25 14:00",
    },
    {
      id: 2,
      requestNumber: "REQ-002",
      requestedBy: "sarah@service.com",
      manager: "manager@dealership.com",
      stockVin: "5FNYF4H75LB123456",
      poNumber: "PO-2024-002",
      vehicleDescription: "Lot vehicle",
      year: 2022,
      make: "Honda",
      model: "Pilot",
      color: "Black",
      dateRequested: "2026-02-23",
      dueDate: "2026-02-26",
      dueTime: "10:00",
      mainServices: ["U/C Detail"],
      additionalServices: ["Interior Protection"],
      notes: "Full interior detail requested",
      status: "In Progress",
      price: 250,
      service: "U/C Detail",
      vin: "5FNYF4H75LB123456",
      due: "2026-02-26 10:00",
    },
    {
      id: 3,
      requestNumber: "REQ-003",
      requestedBy: "john@sales.com",
      manager: "manager@dealership.com",
      stockVin: "4T1BF1AK5CU123456",
      poNumber: "",
      vehicleDescription: "Customer vehicle",
      year: 2021,
      make: "Toyota",
      model: "Camry",
      color: "White",
      dateRequested: "2026-02-23",
      dueDate: "2026-02-27",
      dueTime: "09:00",
      mainServices: [],
      additionalServices: ["Restore Headlights"],
      notes: "Cloudy headlights, needs full restoration",
      status: "Pending",
      price: 0,
      service: "Headlight Restoration",
      vin: "4T1BF1AK5CU123456",
      due: "2026-02-27 09:00",
    },
    {
      id: 4,
      requestNumber: "REQ-004",
      requestedBy: "maria@dealership.com",
      manager: "manager@dealership.com",
      stockVin: "2G1FB1E39D1234567",
      poNumber: "",
      vehicleDescription: "Fleet vehicle",
      year: 2013,
      make: "Chevrolet",
      model: "Malibu",
      color: "Gray",
      dateRequested: "2026-02-22",
      dueDate: "2026-02-24",
      dueTime: "11:00",
      mainServices: [],
      additionalServices: ["Tint Removal"],
      notes: "All windows, customer wants OEM look",
      status: "Completed",
      price: 150,
      service: "Tint Removal",
      vin: "2G1FB1E39D1234567",
      due: "2026-02-24 11:00",
    },
    {
      id: 5,
      requestNumber: "REQ-005",
      requestedBy: "robert@salesdealership.com",
      manager: "manager@dealership.com",
      stockVin: "1G1FB1C56F2123456",
      poNumber: "PO-2024-003",
      vehicleDescription: "Wholesale vehicle",
      year: 2015,
      make: "Chevrolet",
      model: "Cruze",
      color: "Blue",
      dateRequested: "2026-02-23",
      dueDate: "2026-02-28",
      dueTime: "15:00",
      mainServices: [],
      additionalServices: ["Ozone Odor Removal"],
      notes: "Odor issue, customer complaint",
      status: "Pending",
      price: 0,
      service: "Ozone Odor Removal",
      vin: "1G1FB1C56F2123456",
      due: "2026-02-28 15:00",
    },
  ]);

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem("dealership-session");
    if (savedSession) {
      const session = JSON.parse(savedSession);
      setIsLoggedIn(true);
      setUser(session.user);
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Mock login - simulate async operation
    return new Promise((resolve) => {
      setTimeout(() => {
        // Determine role based on email
        let role: "sales_rep" | "admin" = "sales_rep";
        if (email === "manager@dealership.com" || email === "admin@dealership.com") {
          role = "admin";
        }

        const newUser: User = {
          email,
          name: email.split("@")[0],
          role,
        };

        setIsLoggedIn(true);
        setUser(newUser);
        localStorage.setItem("dealership-session", JSON.stringify({ user: newUser }));
        resolve();
      }, 500);
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("dealership-session");
  };

  const addRequest = (request: Omit<ServiceRequest, "id">) => {
    const newRequest: ServiceRequest = {
      ...request,
      id: Math.max(...requests.map((r) => r.id), 0) + 1,
    };
    setRequests([...requests, newRequest]);
  };

  const updateRequestStatus = (id: number, status: ServiceRequest["status"]) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const updateRequestPrice = (id: number, price: number) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, price } : r)));
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
