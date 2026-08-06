import { cn } from "@/lib/utils";

/**
 * The wave scene at the foot of the hero: layered light ribbons cresting over
 * a horizon, with their own reflection below it.
 *
 * Drawn as SVG rather than shipped as an image so it costs no download, scales
 * to any viewport without a second asset, and re-colours from the palette by
 * editing four gradients instead of re-exporting a file.
 *
 * THIS IS A BAND, NOT A BACKDROP. It renders transparent above the crests and
 * must be given a box whose aspect stays near the 1440×900 viewBox — see
 * `Hero`, which anchors it to the bottom of the frame at a fixed aspect ratio.
 * Stretching it over a whole tall hero was the first attempt and it failed
 * badly: `slice` scaled the scene 2.7x to cover, so all that showed was the
 * middle third of one ribbon, magnified into a flat smear. The ambient glow
 * that fills the rest of the hero is a CSS layer in `Hero`, not part of this.
 *
 * STATIC ON PURPOSE. `globals.css` records what a permanent animation did to
 * this page once: a loop on two 6px dots forced a style recalc every frame and
 * took idle main-thread work from 97ms to 429ms. A full-bleed animated
 * backdrop would be far worse. It is drawn once and then it is just pixels.
 *
 * Purely decorative — `aria-hidden`, and it carries no information a screen
 * reader would miss.
 */
export function NeonWaves({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn("h-full w-full", className)}
      viewBox="0 0 1440 900"
      /*
       * `slice` + `xMidYMax` keeps the crests anchored to the bottom of the
       * frame at every aspect ratio. With the default `meet` the whole scene
       * would letterbox on a phone and the waves would shrink to a thin smear
       * across the middle instead of filling the floor of the hero.
       */
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        {/* Ribbons, back to front: deepest blue behind, brightest cyan in front. */}
        <linearGradient id="nw-back" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.55" />
          <stop offset="52%" stopColor="#1d4ed8" stopOpacity="0.62" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.38" />
        </linearGradient>

        <linearGradient id="nw-mid" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#0b63c9" stopOpacity="0.70" />
          <stop offset="58%" stopColor="#22d3ee" stopOpacity="0.66" />
          <stop offset="100%" stopColor="#67e8f9" stopOpacity="0.34" />
        </linearGradient>

        <linearGradient id="nw-front" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.82" />
          <stop offset="46%" stopColor="#67e8f9" stopOpacity="0.74" />
          <stop offset="100%" stopColor="#a5f3fc" stopOpacity="0.42" />
        </linearGradient>

        <linearGradient id="nw-band" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0b63c9" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#67e8f9" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.45" />
        </linearGradient>

        {/* The lit floor under the horizon. */}
        <linearGradient id="nw-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.34" />
          <stop offset="42%" stopColor="#0b63c9" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#070d13" stopOpacity="0" />
        </linearGradient>

        {/* Horizon rule: bright at centre, dissolving before it reaches the edges. */}
        <linearGradient id="nw-horizon" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
          <stop offset="30%" stopColor="#67e8f9" stopOpacity="0.55" />
          <stop offset="62%" stopColor="#a5f3fc" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>

        {/*
         * Generous filter regions. The default -10%/120% box clips a blur this
         * wide and leaves a visible straight cut across the ribbon.
         */}
        <filter id="nw-blur-lg" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="38" />
        </filter>
        <filter id="nw-blur-md" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="20" />
        </filter>
        <filter id="nw-blur-sm" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="9" />
        </filter>

        {/*
         * Everything above the horizon is clipped to it. Without this the blur
         * on each ribbon bleeds past y=690 and the horizon stops reading as an
         * edge — which is the one line that makes the scene a landscape rather
         * than a pile of gradients.
         */}
        <clipPath id="nw-above">
          <rect x="0" y="0" width="1440" height="690" />
        </clipPath>
        <clipPath id="nw-below">
          <rect x="0" y="690" width="1440" height="210" />
        </clipPath>

        {/*
         * Geometry only — no `fill`, no `filter`. Each curve is written once
         * and then instantiated by `<use>`: upright above the horizon, and
         * mirrored below it as the reflection. `use` builds a shadow tree, so
         * properties left unset here inherit from whichever `use` element
         * pulls the path in, which is what lets one `d` carry two treatments.
         */}
        <path
          id="nw-w1"
          d="M -60 690 C 160 670 340 600 540 545 C 760 484 940 330 1180 380 C 1320 409 1410 470 1500 500 L 1500 690 Z"
        />
        <path
          id="nw-w2"
          d="M -60 690 C 120 660 250 570 430 540 C 640 505 800 420 990 405 C 1180 390 1350 480 1500 530 L 1500 690 Z"
        />
        <path
          id="nw-w3"
          d="M -60 690 C 80 678 190 620 370 580 C 590 531 810 610 1030 645 C 1220 675 1380 672 1500 660 L 1500 690 Z"
        />
        <path
          id="nw-w4"
          d="M -60 690 C 220 684 440 660 700 655 C 980 650 1240 665 1500 675 L 1500 690 Z"
        />
      </defs>

      {/* No background rect — the area above the crests stays transparent so
          the hero's own ambient wash shows through unbroken. */}
      <g clipPath="url(#nw-above)">
        <use href="#nw-w1" fill="url(#nw-back)" filter="url(#nw-blur-lg)" />
        <use href="#nw-w2" fill="url(#nw-mid)" filter="url(#nw-blur-md)" />
        <use href="#nw-w3" fill="url(#nw-front)" filter="url(#nw-blur-sm)" />
        <use href="#nw-w4" fill="url(#nw-band)" />

        {/* Crests: a hard edge on top of soft mass. Without them it reads as fog. */}
        <path
          d="M -60 690 C 120 660 250 570 430 540 C 640 505 800 420 990 405 C 1180 390 1350 480 1500 530"
          fill="none"
          stroke="#a5f3fc"
          strokeOpacity="0.5"
          strokeWidth="1.5"
        />
        <path
          d="M -60 690 C 80 678 190 620 370 580 C 590 531 810 610 1030 645 C 1220 675 1380 672 1500 660"
          fill="none"
          stroke="#e6f1f8"
          strokeOpacity="0.6"
          strokeWidth="1.5"
        />
      </g>

      {/* Floor and its reflection, mirrored about y = 690. */}
      <g clipPath="url(#nw-below)">
        <rect x="0" y="690" width="1440" height="210" fill="url(#nw-floor)" />
        {/*
         * Mirrored about y = 690, dimmed and blurred once at the group level.
         * A real reflection loses contrast and detail, not just orientation —
         * a straight flipped copy at full strength reads as a rendering bug.
         */}
        <g
          transform="matrix(1 0 0 -1 0 1380)"
          opacity="0.32"
          filter="url(#nw-blur-md)"
        >
          <use href="#nw-w2" fill="url(#nw-mid)" />
          <use href="#nw-w3" fill="url(#nw-front)" />
          <use href="#nw-w4" fill="url(#nw-band)" />
        </g>
      </g>

      <rect x="0" y="689" width="1440" height="2" fill="url(#nw-horizon)" />
    </svg>
  );
}
