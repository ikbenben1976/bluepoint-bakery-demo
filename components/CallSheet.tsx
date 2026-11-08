"use client";

import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

type CallSheetValue = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const CallSheetContext = createContext<CallSheetValue | null>(null);

export function CallSheetProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <CallSheetContext.Provider value={{ open, setOpen }}>{children}</CallSheetContext.Provider>;
}

export function useCallSheet(): CallSheetValue {
  const value = useContext(CallSheetContext);
  if (!value) throw new Error("useCallSheet requires CallSheetProvider");
  return value;
}
