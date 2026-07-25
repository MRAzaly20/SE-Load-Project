"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { UserSession, Role } from "@/types/rdmp";

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  loginWithGoogle: (email: string) => void;
  loginWithGithub: (email: string, username?: string) => void;
  loginWithOAuth: (provider: "google" | "github", email: string, name?: string) => void;
  logout: () => void;
  updateRoleInSession: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: nextAuthSession, status } = useSession();
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    if (status === "authenticated" && nextAuthSession?.user) {
      const nextUser = nextAuthSession.user as any;
      const mappedUser: UserSession = {
        id: nextUser.id || `eng-${Date.now()}`,
        employee_code: nextUser.employee_code || nextUser.employeeCode || "SE-ENG-101",
        name: nextUser.name || "Schneider Engineer",
        email: nextUser.email || "user@se.com",
        role: (nextUser.role as Role) || "engineer",
        department: nextUser.department || "Schneider Electric Field Engineering",
        avatar: nextUser.avatar || nextUser.image || "/images/user/user.png",
        authProvider: (nextUser.authProvider as any) || "google",
      };
      setUser(mappedUser);
    } else if (status === "unauthenticated") {
      setUser(null);
    }
  }, [nextAuthSession, status]);

  const loginWithGoogle = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const loginWithGithub = () => {
    signIn("github", { callbackUrl: "/" });
  };

  const loginWithOAuth = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl: "/" });
  };

  const logout = () => {
    setUser(null);
    if (typeof document !== "undefined") {
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      document.cookie = "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      document.cookie = "__Secure-next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    }
    signOut({ callbackUrl: "/signin" });
  };

  const updateRoleInSession = (newRole: Role) => {
    if (!user) return;
    setUser((prev) => (prev ? { ...prev, role: newRole } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginWithGoogle,
        loginWithGithub,
        loginWithOAuth,
        logout,
        updateRoleInSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
