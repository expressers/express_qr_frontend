import { useEffect, useState } from "react";

type NetworkInformationLike = { saveData?: boolean; effectiveType?: string };
type NavigatorLike = Navigator & {
  connection?: NetworkInformationLike;
  deviceMemory?: number;
};

const SLOW_CONNECTIONS = ["slow-2g", "2g", "3g"];

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") as WebGL2RenderingContext | null;
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * Static gates: evaluated once, after idle. Any failure keeps the CSS backdrop only
 * and the WebGL chunk is never requested.
 */
export function passesStaticGates(): boolean {
  if (typeof window === "undefined") return false;

  // Dev-only escape hatch so the shader can be checked on a low-core dev machine:
  // localStorage.setItem("eqr:bg", "force")
  if (import.meta.env.DEV) {
    try {
      if (localStorage.getItem("eqr:bg") === "force") return hasWebGL();
    } catch {
      /* storage unavailable */
    }
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  const nav = navigator as NavigatorLike;
  const connection = nav.connection;
  if (connection?.saveData) return false;
  if (connection?.effectiveType && SLOW_CONNECTIONS.includes(connection.effectiveType)) {
    return false;
  }
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) return false;
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 4) return false;

  return hasWebGL();
}

function whenIdle(cb: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(cb, { timeout: 2000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(cb, 1200);
  return () => window.clearTimeout(id);
}

/**
 * True only when the animated WebGL background may be mounted:
 * static gates pass (reduced motion, saveData, slow network, low-end device, WebGL),
 * evaluated after idle, and the tab is visible. A hidden tab unmounts the canvas.
 */
export function useBackgroundGate(): boolean {
  const [eligible, setEligible] = useState(false);
  const [visible, setVisible] = useState(
    () => typeof document !== "undefined" && document.visibilityState === "visible",
  );

  useEffect(() => {
    return whenIdle(() => setEligible(passesStaticGates()));
  }, []);

  useEffect(() => {
    const onVisibility = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      if (mq.matches) setEligible(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return eligible && visible;
}
