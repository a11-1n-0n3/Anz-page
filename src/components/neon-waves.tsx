import { cn } from "@/lib/utils";

// Band at fixed aspect — stretch over a tall hero and slice crops to one crest.
export function NeonWaves({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn("h-full w-full", className)}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
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

        <linearGradient id="nw-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.34" />
          <stop offset="42%" stopColor="#0b63c9" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#070d13" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="nw-horizon" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
          <stop offset="30%" stopColor="#67e8f9" stopOpacity="0.55" />
          <stop offset="62%" stopColor="#a5f3fc" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>

        {/* Wide filter regions — default box clips this blur */}
        <filter id="nw-blur-lg" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="38" />
        </filter>
        <filter id="nw-blur-md" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="20" />
        </filter>
        <filter id="nw-blur-sm" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="9" />
        </filter>

        <clipPath id="nw-above">
          <rect x="0" y="0" width="1440" height="690" />
        </clipPath>
        <clipPath id="nw-below">
          <rect x="0" y="690" width="1440" height="210" />
        </clipPath>

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

      <g clipPath="url(#nw-above)">
        <use href="#nw-w1" fill="url(#nw-back)" filter="url(#nw-blur-lg)" />
        <use href="#nw-w2" fill="url(#nw-mid)" filter="url(#nw-blur-md)" />
        <use href="#nw-w3" fill="url(#nw-front)" filter="url(#nw-blur-sm)" />
        <use href="#nw-w4" fill="url(#nw-band)" />

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

      <g clipPath="url(#nw-below)">
        <rect x="0" y="690" width="1440" height="210" fill="url(#nw-floor)" />
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
