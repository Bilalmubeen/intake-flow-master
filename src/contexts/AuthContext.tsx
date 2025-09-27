import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@dvp.com",
    role: "intake_user"
  },
  {
    id: "2", 
    name: "Michael Chen",
    email: "michael.chen@dvp.com",
    role: "reviewer_manager"
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@dvp.com", 
    role: "administrator"
  }
];

const ROLE_HIERARCHY: Record<UserRole, number> = {
  intake_user: 1,
  reviewer_manager: 2,
  administrator: 3
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem("dvp_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    if (foundUser && password === "password123") {
      setUser(foundUser);
      localStorage.setItem("dvp_user", JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("dvp_user");
  };

  const hasPermission = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const userRoleLevel = ROLE_HIERARCHY[user.role];
    
    return requiredRoles.some(role => userRoleLevel >= ROLE_HIERARCHY[role]);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}