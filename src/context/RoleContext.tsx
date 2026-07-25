"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Role, Engineer } from "@/types/rdmp";

interface RoleContextType {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentEngineer: Engineer | null;
  setCurrentEngineerId: (id: string) => void;
  engineers: Engineer[];
  refreshData: () => void;
  dataTick: number;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<Role>("manager");
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [currentEngineerId, setCurrentEngineerId] = useState<string>("eng-001");
  const [dataTick, setDataTick] = useState<number>(0);

  const refreshData = () => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.users)) {
          setEngineers(data.users);
        }
      })
      .catch((err) => console.error("Error fetching users in RoleContext:", err))
      .finally(() => {
        setDataTick((prev) => prev + 1);
      });
  };

  useEffect(() => {
    refreshData();
  }, []);

  const currentEngineer = engineers.find((e) => e.id === currentEngineerId) || engineers[0] || null;

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentEngineer,
        setCurrentEngineerId,
        engineers,
        refreshData,
        dataTick,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
