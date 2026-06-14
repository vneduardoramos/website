"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export function MarkdownEditor({ name, defaultValue }: { name: string; defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue ?? "");
  return (
    <div data-color-mode="light">
      <input type="hidden" name={name} value={value} />
      <MDEditor value={value} onChange={(v) => setValue(v ?? "")} height={420} preview="live" />
    </div>
  );
}
