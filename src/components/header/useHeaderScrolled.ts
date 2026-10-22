import { useEffect, useRef, useState } from "react";

/**
 * True once the page has scrolled past its top edge. Uses an IntersectionObserver
 * on a 1px sentinel instead of a scroll listener: no work per scroll frame.
 * Attach `sentinelRef` to an absolutely positioned element at the top of the page.
 */
function useHeaderScrolled() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { sentinelRef, scrolled };
}

export { useHeaderScrolled };
