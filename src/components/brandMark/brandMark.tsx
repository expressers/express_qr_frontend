import { cn } from "@/lib/utils";
import { BRAND_NAME } from "./brand";

type BrandMarkProps = {
  /** `full` = glyph + wordmark, `mark` = glyph only, `wordmark` = text only */
  variant?: "full" | "mark" | "wordmark";
  className?: string;
  /** Glyph size in px (wordmark scales with the surrounding font size) */
  size?: number;
};

/**
 * Geometric QR glyph: three finder patterns and a two-module data cluster on a
 * 24-unit grid. Drawn with `currentColor` so it follows the theme (black / white).
 */
function BrandGlyph({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}>
      <path
        fillRule="evenodd"
        d="M1 1h9v9H1V1Zm2 2v5h5V3H3Zm11-2h9v9h-9V1Zm2 2v5h5V3h-5ZM1 14h9v9H1v-9Zm2 2v5h5v-5H3Z"
      />
      <rect x="4" y="4" width="3" height="3" />
      <rect x="17" y="4" width="3" height="3" />
      <rect x="4" y="17" width="3" height="3" />
      <rect x="14" y="14" width="4" height="4" />
      <rect x="19" y="19" width="4" height="4" />
    </svg>
  );
}

function BrandMark({ variant = "full", className, size = 24 }: BrandMarkProps) {
  const showGlyph = variant !== "wordmark";
  const showWord = variant !== "mark";

  return (
    <span
      role="img"
      aria-label={BRAND_NAME}
      className={cn(
        "inline-flex items-center gap-2 font-semibold tracking-tight text-foreground",
        className,
      )}>
      {showGlyph && <BrandGlyph size={size} />}
      {showWord && <span aria-hidden="true">{BRAND_NAME}</span>}
    </span>
  );
}

export { BrandMark, BrandGlyph };
