"use client";

import Image from "next/image";
import { useState } from "react";
import { BookingEmbed } from "@/components/marketing/BookingEmbed";

export type BookablePerson = {
  slug: string;
  name: string;
  title: string;
  photo?: string | null;
  url: string;
};

/**
 * Lets the visitor choose whose calendar to open when more than one person has a
 * booking link of their own.
 *
 * Only rendered when there are at least two bookable people; with one, BookACall
 * mounts the embed directly and this never enters the client bundle's critical
 * path. Selecting a person swaps the Calendly URL, and BookingEmbed re-mounts the
 * widget for the new URL.
 */
export function BookingPicker({
  people,
  label,
  fallbackLabel,
  ariaLabel,
  embedTitle,
}: {
  people: BookablePerson[];
  label: string;
  fallbackLabel: string;
  ariaLabel: string;
  embedTitle: string;
}) {
  const [selected, setSelected] = useState(people[0]?.slug ?? "");
  const active = people.find((p) => p.slug === selected) ?? people[0];
  if (!active) return null;

  return (
    <div>
      <p
        id="booking-picker-label"
        className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted"
      >
        {label}
      </p>
      <div
        role="radiogroup"
        aria-labelledby="booking-picker-label"
        className="mt-4 flex flex-wrap gap-2"
      >
        {people.map((p) => {
          const on = p.slug === active.slug;
          return (
            <button
              key={p.slug}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setSelected(p.slug)}
              className={[
                "flex items-center gap-2.5 rounded-full border py-1.5 pl-1.5 pr-4 text-left transition",
                on
                  ? "border-primaryDeep bg-primary/10 shadow-soft"
                  : "border-border bg-surface hover:border-primary/40",
              ].join(" ")}
            >
              {p.photo ? (
                <Image
                  src={p.photo}
                  alt=""
                  width={32}
                  height={32}
                  sizes="32px"
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : null}
              <span className="leading-tight">
                <span
                  className={[
                    "block text-sm font-semibold",
                    on ? "text-primaryDeep" : "text-foreground",
                  ].join(" ")}
                >
                  {p.name}
                </span>
                <span className="block text-xs text-muted">{p.title}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {/* Deliberately no `key`: BookingEmbed re-mounts the widget itself when
            the URL changes. Remounting the component would reset its `ready`
            state, and next/script does not re-fire onLoad for a script it has
            already loaded, so the calendar would never appear. */}
        <BookingEmbed
          url={active.url}
          fallbackLabel={fallbackLabel}
          ariaLabel={ariaLabel}
          embedTitle={embedTitle}
        />
      </div>
    </div>
  );
}
