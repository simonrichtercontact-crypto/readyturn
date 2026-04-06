/**
 * ReadyTurn — Logo System
 *
 * Concept: A bold rotation arc (= "turn" / make-ready cycle) with a
 * minimal property peak integrated inside — property management at its core.
 *
 * Visual language: premium SaaS (Linear / Vercel / Stripe style)
 * – Deep navy-to-indigo gradient background
 * – White geometric shapes, stroke-based
 * – Works at 16 px (favicon) → 80 px (hero)
 * – One mark, every surface
 */

interface LogoMarkProps {
  size?: number;
  className?: string;
}

export function LogoMark({ size = 32, className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ReadyTurn"
      role="img"
    >
      <defs>
        {/* Premium navy → indigo gradient */}
        <linearGradient id="rt-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#0f2058" />
          <stop offset="100%" stopColor="#2d3ab1" />
        </linearGradient>
      </defs>

      {/* ── Background ─────────────────────────────── */}
      <rect width="40" height="40" rx="10" fill="url(#rt-bg)" />

      {/* ── Rotation arc — thick, 270° sweep ─────────
           Starts at top (270°) sweeps clockwise to right (0°)
           → open gap at bottom-right = momentum / turnover cycle  */}
      <path
        d="M20 7
           A13 13 0 1 1 33 20"
        stroke="white"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.95"
      />

      {/* ── Arrow head at arc end (bottom-right of arc) */}
      <path
        d="M29.5 14.5 L33 20 L27 20.5"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.95"
      />

      {/* ── Property peak — centred inside the arc ───
           Just the roofline: clean inverted-V, minimal  */}
      <path
        d="M13 22 L20 15 L27 22"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.7"
      />

      {/* ── Door — anchors the house, adds depth ─────  */}
      <rect
        x="17.5" y="22" width="5" height="6"
        rx="1"
        fill="white"
        opacity="0.35"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────── */

const sizeMap = {
  xs:  { icon: 20, text: "text-sm font-extrabold",   gap: "gap-1.5" },
  sm:  { icon: 26, text: "text-[15px] font-extrabold", gap: "gap-2"  },
  md:  { icon: 32, text: "text-lg font-extrabold",   gap: "gap-2.5" },
  lg:  { icon: 40, text: "text-xl font-extrabold",   gap: "gap-3"   },
  xl:  { icon: 52, text: "text-2xl font-extrabold",  gap: "gap-3.5" },
} as const;

interface LogoProps {
  size?: keyof typeof sizeMap;
  /** light = dark text on white bg  |  dark = white text on dark bg */
  variant?: "light" | "dark";
  className?: string;
}

export function Logo({ size = "md", variant = "light", className }: LogoProps) {
  const { icon, text, gap } = sizeMap[size];
  const word   = variant === "dark" ? "text-white"    : "text-slate-900";
  const accent = variant === "dark" ? "text-[#7b9ef5]" : "text-[#1d4ed8]";

  return (
    <div className={`flex items-center ${gap} ${className ?? ""}`}>
      <LogoMark size={icon} />
      <span className={`${text} tracking-tight leading-none ${word}`}>
        Ready<span className={accent}>Turn</span>
      </span>
    </div>
  );
}

/** Text-only mark — use where icon already appears nearby */
export function LogoWordmark({
  variant = "light",
  size = "md",
  className,
}: {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const t      = { sm: "text-sm", md: "text-base", lg: "text-lg" }[size];
  const word   = variant === "dark" ? "text-white"     : "text-slate-900";
  const accent = variant === "dark" ? "text-[#7b9ef5]" : "text-[#1d4ed8]";
  return (
    <span className={`${t} font-extrabold tracking-tight ${word} ${className ?? ""}`}>
      Ready<span className={accent}>Turn</span>
    </span>
  );
}
