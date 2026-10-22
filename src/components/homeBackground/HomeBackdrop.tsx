import { lazy, Suspense } from "react";
import { StaticBackdrop } from "./StaticBackdrop";
import { useBackgroundGate } from "./useBackgroundGate";

// Dynamic import: the 3D stack is only requested after idle and once every gate passes.
const HomeBackground = lazy(() => import("./HomeBackground"));

/**
 * Home backdrop. Paints the static CSS layer immediately (fast LCP), then fades the
 * WebGL layer in on top when allowed. A scrim keeps the generator legible.
 */
export function HomeBackdrop() {
  const canMountWebGL = useBackgroundGate();

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <StaticBackdrop />
      {canMountWebGL && (
        <Suspense fallback={null}>
          <HomeBackground />
        </Suspense>
      )}
      <div className="backdrop-scrim" />
    </div>
  );
}
