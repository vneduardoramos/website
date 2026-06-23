"use client";
import { createContext, useContext, useState } from "react";
import { useSession } from "next-auth/react";
import { ImageEditOverlay } from "@/components/marketing/ImageEditOverlay";
import type { ImageOverrideData } from "@/lib/image-overrides";

export type EditRequest = { key: string; baseSrc: string; alt: string; override: ImageOverrideData | null };
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
