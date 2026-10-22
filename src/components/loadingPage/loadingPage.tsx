import { useEffect } from "react";
import { useLoadingPage } from "@/hooks";
import { BRAND_NAME } from "../brandMark/brand";

const SEEN_KEY = "eqr:intro";

// BRAND_NAME is "ExpressQR": the outline-fill effect sweeps "Express" in the
// foreground colour, then "QR" in the muted foreground. Split on the capital pair
// so the effect survives a future rename that keeps the same shape.
const split = BRAND_NAME.search(/[A-Z]{2}$/);
const FIRST = split > 0 ? BRAND_NAME.slice(0, split) : BRAND_NAME;
const SECOND = split > 0 ? BRAND_NAME.slice(split) : "";

function hasSeenIntro() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Brand entry animation. Once per session, ~1.8s, rendered as a fixed overlay on
 * top of an already-mounted page (never blocks content or the LCP). The CSS
 * animation owns the timing; the overlay unmounts on its own animationend, which
 * is what fixes the old "unmounted before the fade ran" bug.
 */
function LoadingPage() {
  const { visibleLoadingPage, setVisibleLoadingPage, isVisible } = useLoadingPage();

  useEffect(() => {
    if (!isVisible || hasSeenIntro()) return;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage blocked: the intro may replay, harmless */
    }
    setVisibleLoadingPage(true);
  }, [isVisible, setVisibleLoadingPage]);

  if (!visibleLoadingPage) return null;

  return (
    <div
      role="status"
      aria-label={`A carregar ${BRAND_NAME}`}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) setVisibleLoadingPage(false);
      }}
      className="intro-layer pointer-events-none fixed inset-0 z-(--z-intro) flex items-center justify-center bg-background">
      <span
        aria-hidden="true"
        className="select-none text-4xl font-semibold tracking-[0.01em] sm:text-6xl">
        <span data-text={FIRST} className="intro-word intro-express">
          {FIRST}
        </span>
        {SECOND && (
          <span data-text={SECOND} className="intro-word intro-qr">
            {SECOND}
          </span>
        )}
      </span>
    </div>
  );
}

export { LoadingPage };
