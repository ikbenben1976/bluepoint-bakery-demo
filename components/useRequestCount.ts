"use client";

import { useEffect, useState } from "react";
import { REQUEST_CHANGE_EVENT, loadDraft } from "@/lib/storage";

export function useRequestCount(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const read = () => setCount(loadDraft().lines.length);
    read();
    window.addEventListener(REQUEST_CHANGE_EVENT, read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(REQUEST_CHANGE_EVENT, read);
      window.removeEventListener("storage", read);
    };
  }, []);

  return count;
}
