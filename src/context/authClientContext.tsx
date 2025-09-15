"use client";
import { createContext, useContext, useState } from "react";
import { User } from "../schemas";


type Ctx = { user: User | null; setUser: (u: User | null) => void };
const AuthClientContext = createContext<Ctx | null>(null);

export function AuthClientProvider({
  initialUser,
  children,
}: {
  initialUser: User | null;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState(initialUser);
  return (
    <AuthClientContext.Provider value={{ user, setUser }}>
      {children}
    </AuthClientContext.Provider>
  );
}

export const useAuthClient = () => {
  const ctx = useContext(AuthClientContext);
  if (!ctx) throw new Error("useAuthClient fuera de AuthClientProvider");
  return ctx;
};
