import type { ClientContextType } from "../context/client.tsx";
import { useContext } from "react";
import { ClientContext } from "../context/client.tsx";

export const useClient = (): ClientContextType => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClient must be used within a ClientContextProvider.");
  }
  return context;
};