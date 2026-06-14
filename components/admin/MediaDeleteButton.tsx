"use client";

import { deleteMedia } from "@/app/admin/actions";

export function MediaDeleteButton({ id }: { id: string }) {
  return (
    <form
      action={deleteMedia.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Delete this media file? This removes the file and its record.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="text-[11px] font-semibold text-red-600 hover:underline"
      >
        Delete
      </button>
    </form>
  );
}
