import { UserContext, type UserContextType } from "@/context";
import { useContext } from "react";

export const useUserAccount = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  return context;
};
