import { cn } from "@/lib/utils";

// Deterministic — Math.random would differ between the build and any re-render.
function noise(i: number, salt: number) {
  const v = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return v - Math.floor(v);
}

const VIEW_W = 1440;
const VIEW_H = 900;
const HALF = VIEW_W / 2;
const SHELVES = 46;
// Blocks stop short of the middle. Running them to the centre pushed stripes
// behind the subhead and the outline button, where contrast fell apart.
const REACH = 0.88;

// One half of the field. Blocks start tall at the outer edge and step down and
// inward, so the two mirrored halves open a dark gap for the headline.
const BLOCKS = Array.from({ length: SHELVES }, (_, i) => {
  const t = i / (SHELVES - 1);
  const span = (1 - t) ** 1.25 * VIEW_H * 0.86;
  const h = Math.round(span * (0.42 + noise(i, 2) * 0.58));
  return {
    x: Math.round(t * HALF * REACH),
    y: Math.round(t * VIEW_H * 0.34 + noise(i, 3) * VIEW_H * 0.18 - h * 0.12),
    w: Math.round(18 + noise(i, 1) * 46),
    h,
    grad: i % 4,
    opacity: (0.42 + noise(i, 4) * 0.58).toFixed(2),
  };
});

/**
 * Hero backdrop: a striped data field radiating from both edges.
 *
 * The scanline texture is a stripe PATTERN masking ~46 blocks per side, not one
 * rect per bar — drawing the bars individually needed ~900 nodes for the same
 * picture.
 *
 * DESKTOP ONLY; the hero hides it below `sm`. The field is empty through the
 * middle so centred text lands on flat black, and at 375px the columns fall
 * exactly where the headline sits. A narrower viewBox, overhanging the frame,
 * and opening the gap vertically were all tried — each one puts stripes back
 * behind the headline. There is no room for both on a phone.
 *
 * Static — globals.css records what a permanent animation cost this page.
 * Decorative, so aria-hidden.
 */
export function Scanlines({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn("h-full w-full", className)}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="sl-stripes"
          width="6"
          height="1"
          patternUnits="userSpaceOnUse"
        >
          <rect x="0" y="0" width="3.4" height="1" fill="#fff" />
        </pattern>

        <mask id="sl-mask">
          <rect width={VIEW_W} height={VIEW_H} fill="url(#sl-stripes)" />
        </mask>

        <linearGradient id="sl-g0" x1="0" y1="1" x2="0.4" y2="0">
          <stop offset="0%" stopColor="#0007cd" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="sl-g1" x1="0" y1="1" x2="0.4" y2="0">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id="sl-g2" x1="0" y1="1" x2="0.4" y2="0">
          <stop offset="0%" stopColor="#0e7490" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
        <linearGradient id="sl-g3" x1="0" y1="1" x2="0.4" y2="0">
          <stop offset="0%" stopColor="#312e81" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>

        {/* Opaque through the middle — this is what clears the headline. */}
        <linearGradient id="sl-centre" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0f0f0f" stopOpacity="0" />
          <stop offset="16%" stopColor="#0f0f0f" stopOpacity="0.55" />
          <stop offset="28%" stopColor="#0f0f0f" stopOpacity="0.96" />
          <stop offset="38%" stopColor="#0f0f0f" stopOpacity="1" />
          <stop offset="62%" stopColor="#0f0f0f" stopOpacity="1" />
          <stop offset="72%" stopColor="#0f0f0f" stopOpacity="0.96" />
          <stop offset="84%" stopColor="#0f0f0f" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#0f0f0f" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="sl-bottom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f0f0f" stopOpacity="0" />
          <stop offset="100%" stopColor="#0f0f0f" stopOpacity="1" />
        </linearGradient>
      </defs>

      <rect width={VIEW_W} height={VIEW_H} fill="#0f0f0f" />

      <g mask="url(#sl-mask)">
        {[0, 1].map((side) => (
          <g
            key={side}
            transform={side ? `translate(${VIEW_W} 0) scale(-1 1)` : undefined}
          >
            {BLOCKS.map((b, i) => (
              <rect
                key={i}
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                fill={`url(#sl-g${b.grad})`}
                opacity={b.opacity}
              />
            ))}
          </g>
        ))}
      </g>

      <rect width={VIEW_W} height={VIEW_H} fill="url(#sl-centre)" />
      <rect
        y={VIEW_H * 0.55}
        width={VIEW_W}
        height={VIEW_H * 0.45}
        fill="url(#sl-bottom)"
      />
    </svg>
  );
}
