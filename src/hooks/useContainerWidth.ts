"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Measures the content width of a container element via ResizeObserver.
 * Updates automatically whenever the element or its parent resizes.
 *
 * @returns [ref, width] — attach ref to the element you want to measure.
 */
export function useContainerWidth(): [React.RefObject<HTMLDivElement>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fire immediately with current size
    setWidth(el.getBoundingClientRect().width);

    const ro = new ResizeObserver(([entry]) => {
      // contentRect.width excludes padding — exactly what we want for PDF sizing
      setWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, width];
}
