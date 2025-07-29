import { useEffect, useRef, useState } from "react";

export function useResizer<T extends HTMLElement>() {
  const elRef = useRef<T | null>(null);
  const [visibleHeight, setVisibleHeight] = useState<number>(0);

  useEffect(() => {
    const updateVisibleHeight = () => {
      if (!elRef.current) return;

      const rect = elRef.current.getBoundingClientRect();
      const topOfElement = rect.top;
      const bottomOfViewport = window.innerHeight;

      const availableHeight = bottomOfViewport - topOfElement - 20;
      if (availableHeight > 0) {
        setVisibleHeight(availableHeight);
      }
    };

    updateVisibleHeight();

    window.addEventListener("resize", updateVisibleHeight);

    return () => {
      window.removeEventListener("resize", updateVisibleHeight);
    };
  }, []);

  return { elRef, visibleHeight };
}
