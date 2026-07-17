"use client";
import { createContext, useContext, useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import type { ImageOverrideData } from "@/lib/image-overrides";

// Code-split the 363-line editor (plus its Pexels UI) out of the shared
// bundle: anonymous visitors never render it, only admins who open it.
const ImageEditOverlay = dynamic(
  () => import("@/components/marketing/ImageEditOverlay").then((m) => m.ImageEditOverlay),
  { ssr: false }
);

export type EditRequest = {
  key: string;
  baseSrc: string;
  alt: string;
  override: ImageOverrideData | null;
  /** Rendered size of the real image slot (px), so the editor preview matches its shape. */
  slotWidth: number;
  slotHeight: number;
};
type Ctx = { isAdmin: boolean; editMode: boolean; openEditor: (r: EditRequest) => void };

const EditModeCtx = createContext<Ctx>({ isAdmin: false, editMode: false, openEditor: () => {} });
export const useEditMode = () => useContext(EditModeCtx);

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const isAdmin = status === "authenticated";
  const [editMode, setEditMode] = useState(false);
  const [active, setActive] = useState<EditRequest | null>(null);

  return (
    <EditModeCtx.Provider value={{ isAdmin, editMode, openEditor: setActive }}>
      {children}
      {isAdmin && (
        <button
          type="button"
          onClick={() => setEditMode((v) => !v)}
          className="fixed bottom-5 left-5 z-[90] rounded-full bg-royal px-4 py-2 text-sm font-semibold text-white shadow-soft-lg"
        >
          {editMode ? "Done editing" : "Edit images"}
        </button>
      )}
      {active && <ImageEditOverlay request={active} onClose={() => setActive(null)} />}
    </EditModeCtx.Provider>
  );
}
