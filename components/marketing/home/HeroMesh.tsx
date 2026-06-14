import { DataStackIcon, DocIcon } from "@/components/marketing/home/Icons";

// Wide viewBox (1280 × 600) covering the full hero; the SVG is sized to cover
// its container (preserveAspectRatio slice), so the mesh spans edge to edge.
const HUB = { x: 904, y: 298, r: 19 };

type MeshNode = { x: number; y: number; r: number; accent?: boolean };

// Seeded PRNG (mulberry32) so the scatter is identical on server and client.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Nodes on a jittered grid spanning the full width: even coverage, organic
// placement, roomy spacing (more nodes, not crowded). Hub cells are skipped.
const NODES: MeshNode[] = (() => {
  const rand = mulberry32(20260609);
  const COLS = 20;
  const ROWS = 10;
  const cellW = 1280 / COLS;
  const cellH = 600 / ROWS;
  const out: MeshNode[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = c * cellW + cellW * (0.15 + 0.7 * rand());
      const y = r * cellH + cellH * (0.15 + 0.7 * rand());
      if ((x - HUB.x) ** 2 + (y - HUB.y) ** 2 < 70 ** 2) continue; // clear the hub
      const accent = rand() < 0.26;
      const radius = accent ? 2.8 + rand() * 1.5 : 1.4 + rand() * 1.3;
      out.push({ x, y, r: radius, accent });
    }
  }
  return out;
})();

const dist2 = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

// Organic mesh: each node links to its two nearest neighbors (deduped).
const EDGES: [number, number][] = (() => {
  const set = new Set<string>();
  const key = (a: number, b: number) => (a < b ? `${a}|${b}` : `${b}|${a}`);
  NODES.forEach((n, i) => {
    NODES.map((m, j) => ({ j, d: dist2(n, m) }))
      .filter((o) => o.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2)
      .forEach((o) => set.add(key(i, o.j)));
  });
  return [...set].map((s) => s.split("|").map(Number) as [number, number]);
})();

// The hub draws spokes to its nearest nodes.
const HUB_NEAR = NODES.map((m, j) => ({ j, d: dist2(m, HUB) }))
  .sort((a, b) => a.d - b.d)
  .slice(0, 14)
  .map((o) => o.j);

// Data packets (db / doc icons) gliding from across the field into the hub.
type Token = { dx: number; dy: number; icon: typeof DataStackIcon; dur: number; delay: number };
const TOKENS: Token[] = [
  { dx: -660, dy: -150, icon: DataStackIcon, dur: 9.5, delay: 0 },
  { dx: -470, dy: 150, icon: DocIcon, dur: 10.5, delay: 1.6 },
  { dx: -300, dy: -210, icon: DocIcon, dur: 8.2, delay: 3.0 },
  { dx: -680, dy: 40, icon: DataStackIcon, dur: 11, delay: 4.4 },
  { dx: 300, dy: -190, icon: DataStackIcon, dur: 8.0, delay: 0.8 },
  { dx: 360, dy: 168, icon: DocIcon, dur: 8.8, delay: 2.3 },
  { dx: 210, dy: 232, icon: DataStackIcon, dur: 7.6, delay: 3.8 },
];

/**
 * Full-bleed hero background: a wide, living network mesh spanning the hero edge
 * to edge, behind the headline. A roomy constellation of connected data points
 * gently drifts and twinkles while database & document packets glide inward from
 * across the field and converge on a glowing hub on the right. Sized to cover
 * its container; dissolves into the page at every edge. Ambient motion only
 * (auto-stilled under prefers-reduced-motion).
 */
export function HeroMesh() {
  return (
    <svg
      viewBox="0 0 1280 600"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      role="img"
      aria-label="An abstract, living network of connected data points spanning the page, with database and document records flowing inward to converge on one central platform."
    >
      <defs>
        <radialGradient id="meshHubGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgb(var(--color-primary))" stopOpacity="0.28" />
          <stop offset="65%" stopColor="rgb(var(--color-secondary))" stopOpacity="0.09" />
          <stop offset="100%" stopColor="rgb(var(--color-secondary))" stopOpacity="0" />
        </radialGradient>
        {/* full-bleed fade: the mesh dissolves to nothing before every edge */}
        <radialGradient id="meshFadeGrad" cx="54%" cy="50%" r="62%">
          <stop offset="0%" stopColor="white" />
          <stop offset="46%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>
        <mask id="meshFade">
          <rect x="0" y="0" width="1280" height="600" fill="url(#meshFadeGrad)" />
        </mask>
      </defs>

      {/* ambient hub glow (behind the mesh, doesn't drift) */}
      <circle cx={HUB.x} cy={HUB.y} r={190} fill="url(#meshHubGlow)" className="mesh-glow" />

      {/* the drifting, edge-faded mesh (field calms via --mesh-energy on scroll) */}
      <g mask="url(#meshFade)" className="mesh-drift mesh-field">
        {EDGES.map(([a, b], i) => (
          <line
            key={`e${i}`}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke="rgb(var(--color-primary))"
            strokeOpacity={0.12}
            strokeWidth={1}
          />
        ))}

        {HUB_NEAR.map((j) => (
          <line
            key={`s${j}`}
            x1={HUB.x}
            y1={HUB.y}
            x2={NODES[j].x}
            y2={NODES[j].y}
            stroke="rgb(var(--color-primary))"
            strokeOpacity={0.16}
            strokeWidth={1}
          />
        ))}

        {NODES.map((n, i) => (
          <g key={`n${i}`} className="mesh-node" style={{ animationDelay: `${(i % 9) * 0.5}s` }}>
            {n.accent ? (
              <>
                <circle cx={n.x} cy={n.y} r={n.r + 3.5} fill="rgb(var(--color-primary))" fillOpacity={0.12} />
                <circle cx={n.x} cy={n.y} r={n.r} fill="rgb(var(--color-primary))" />
              </>
            ) : (
              <circle cx={n.x} cy={n.y} r={n.r} fill="rgb(var(--color-secondary))" fillOpacity={0.5} />
            )}
          </g>
        ))}
      </g>

      {/* convergence point, just another (slightly larger) node */}
      <g className="mesh-node">
        <circle cx={HUB.x} cy={HUB.y} r={9} fill="rgb(var(--color-primary))" fillOpacity={0.12} />
        <circle cx={HUB.x} cy={HUB.y} r={5} fill="rgb(var(--color-primary))" />
      </g>

      {/* flowing data packets converging on the node (bare icons, half opacity);
          the packet field also calms via --mesh-energy as the hero scrolls away */}
      <g className="mesh-field">
      {TOKENS.map((t, i) => {
        const Icon = t.icon;
        return (
          <g
            key={`t${i}`}
            className="mesh-travel"
            style={
              {
                "--dx": `${t.dx}px`,
                "--dy": `${t.dy}px`,
                "--dur": `${t.dur}s`,
                "--delay": `${t.delay}s`,
              } as React.CSSProperties
            }
          >
            <g opacity={0.6}>
              <Icon x={HUB.x - 9} y={HUB.y - 9} width={18} height={18} />
            </g>
          </g>
        );
      })}
      </g>
    </svg>
  );
}
