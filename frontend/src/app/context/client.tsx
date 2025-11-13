import type { TypedPocketBase } from "../lib/pocketbase-types";
import React, { createContext, useState } from "react";
import PocketBase from "pocketbase";
import pburl from "../lib/pburl";

export interface ClientContextType {
  pb: TypedPocketBase;
}

export const ClientContext = createContext<ClientContextType>({} as ClientContextType);

interface ClientProviderProps {
  children: React.ReactNode;
}

export function ClientContextProvider({ children }: ClientProviderProps) {
  const [pb] = useState<TypedPocketBase>(new PocketBase(pburl) as TypedPocketBase);

  return <ClientContext.Provider value={{ pb }}>{children}</ClientContext.Provider>;
}