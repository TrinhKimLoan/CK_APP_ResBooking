import { User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type AuthContextType = {
  user: User | null;
  role: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const normalizeRole = (value?: string | null) => {
  if (!value) return "user";
  const normalized = value.trim().toLowerCase();
  if (normalized === "admin" || normalized === "user") {
    return normalized;
  }
  return normalized || "user";
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = async (userId: string): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from("user_profile")
        .select("role")
        .eq("id", userId)
        .single();

      if (error) {
        console.log("Error fetching role:", error.message);
        return "user";
      }

      return normalizeRole(data?.role);
    } catch (error) {
      console.log("Error in fetchRole:", error);
      return "user";
    }
  };

  useEffect(() => {
    // Khởi tạo session và đồng bộ state
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log("Initial session:", session?.user?.email);
        
        if (session?.user) {
          setUser(session.user);
          const userRole = await fetchRole(session.user.id);
          setRole(normalizeRole(userRole));
          console.log("Initial role:", userRole);
        }
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Lắng nghe thay đổi trạng thái auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event, session?.user?.email);
        
        // Đặt loading true khi có sự kiện auth thay đổi
        setLoading(true);
        
        try {
          if (session?.user) {
            setUser(session.user);
            const userRole = await fetchRole(session.user.id);
            setRole(normalizeRole(userRole));
            console.log("Updated role:", userRole);
          } else {
            setUser(null);
            setRole(null);
            console.log("User signed out");
          }
        } catch (error) {
          console.error("Auth state change error:", error);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    role,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};