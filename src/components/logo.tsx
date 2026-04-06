/**
 * TurnTiva — Logo System
 *
 * Concept: A house silhouette with a rotation arc on top-right
 * = "Turning homes ready" — property management at its core.
 *
 * Visual language: premium SaaS (Linear / Vercel / Stripe style)
 * – Deep navy-to-teal gradient background
 * – White geometric shapes, stroke-based
 * – Works at 16 px (favicon) → 80 px (hero)
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
      aria-label="TurnTiva"
      role="img"
    >
      <defs>
        {/* Deep navy → teal gradient — premium & distinctive */}
        <linearGradient id="tt-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%"  stopColor="#1e3a5f" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
      </defs>

      {/* ── Background ─────────────────────────────── */}
      <rect width="40" height="40" rx="10" fill="url(#tt-bg)" />

      {/* ── House roofline ─────────────────────────── */}
      <path
        d="M11 22 L20 11 L29 22"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.95"
      />

      {/* ── House walls ────────────────────────────── */}
      <path
        d="M14 22 L14 31 L26 31 L26 22"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.90"
      />

      {/* ── Door ───────────────────────────────────── */}
      <rect
        x="17.5" y="24.5" width="5" height="6.5"
        rx="1"
        fill="white"
        opacity="0.40"
      />

      {/* ── Rotation arc — top-right, "Turn" concept ─
           Small circular arrow = turnover / make-ready cycle */}
      <path
        d="M28 8 A5 5 0 1 1 33 13"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      {/* Arrow tip */}
      <path
        d="M30.5 10.5 L33 13 L30 14.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.85"
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
  const word   = variant === "dark" ? "text-white"     : "text-slate-900";
  const accent = variant === "dark" ? "text-[#38bdf8]" : "text-[#0891b2]";

  return (
    <div className={`flex items-center ${gap} ${className ?? ""}`}>
      <LogoMark size={icon} />
      <span className={`${text} tracking-tight leading-none ${word}`}>
        Turn<span className={accent}>Tiva</span>
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
  const accent = variant === "dark" ? "text-[#38bdf8]" : "text-[#0891b2]";
  return (
    <span className={`${t} font-extrabold tracking-tight ${word} ${className ?? ""}`}>
      Turn<span className={accent}>Tiva</span>
    </span>
  );
}
