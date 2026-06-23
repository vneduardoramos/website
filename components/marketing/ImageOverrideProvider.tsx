"use client";
import { createContext, useContext } from "react";
import type { OverrideMap, ImageOverrideData } from "@/lib/image-overrides";

const Ctx = createContext<OverrideMap>({});

export function ImageOverrideProvider({ value, children }: { value: OverrideMap; children: React.ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useImageOverride(key: string): ImageOverrideData | null {
  return useContext(Ctx)[key] ?? null;
}
