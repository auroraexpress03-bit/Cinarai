import { useCallback, useEffect, useRef, useState } from "react";

export function usePdfSize<T extends HTMLElement>() {
  const containerRef = useRef<T | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const updateContainerWidth = useCallback(() => {
    const element = containerRef.current;
    if (!element) return;

    // Use window.innerWidth as the source of truth so the measurement is
    // never inflated by the canvas that lives inside this same container.
    const style = window.getComputedStyle(element);
    const paddingLeft = parseFloat(style.paddingLeft) || 0;
    const paddingRight = parseFloat(style.paddingRight) || 0;
    const width = window.innerWidth - paddingLeft - paddingRight;
    setContainerWidth(Math.max(0, Math.floor(width)));
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(() => {
      updateContainerWidth();
    });

    resizeObserver.observe(element);
    updateContainerWidth();

    const handleResize = () => updateContainerWidth();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [updateContainerWidth]);

  return { containerRef, containerWidth };
}
