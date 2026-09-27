"use client";

import { useEffect, useState } from "react";

/**
 * Shows `count` of the given pre-rendered cards, picked at random on the
 * client after mount, then leaves them alone.
 *
 * The cards themselves are server-rendered (each carries real translations
 * and a real image via next/image) and passed in as ready React nodes; this
 * component only ever chooses which ones are visible. It has to be a client
 * component to do that, because the page itself is revalidated on a timer:
 * picking the three server-side would give every visitor in that window the
 * same three, and reload would show nothing different.
 *
 * The initial, pre-hydration state is deterministic (the pool's first
 * `count` items), so server and client agree on the first paint and React
 * never warns about a mismatch. The random pick happens in an effect, which
 * only ever runs on the client, after mount, so it reads as a swap rather
 * than a flash.
 */
export function RandomThree({
  cards,
  count = 3,
}: {
  cards: { key: string; node: React.ReactNode }[];
  count?: number;
}) {
  const [visible, setVisible] = useState<string[]>(() => cards.slice(0, count).map((c) => c.key));

  useEffect(() => {
    if (cards.length <= count) return; // nothing to pick from
    const shuffled = [...cards].sort(() => Math.random() - 0.5).slice(0, count);
    setVisible(shuffled.map((c) => c.key));
    // Runs once per mount: the pool is fixed for the life of the page, so
    // there's nothing to react to on a later render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid gap-6 md:auto-rows-fr md:grid-cols-3">
      {cards
        .filter((c) => visible.includes(c.key))
        .map((c) => (
          <div key={c.key} className="h-full">
            {c.node}
          </div>
        ))}
    </div>
  );
}
