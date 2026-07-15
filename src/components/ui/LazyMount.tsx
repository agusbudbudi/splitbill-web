"use client";

import React, { useEffect, useRef, useState } from "react";

interface LazyMountProps {
  children: React.ReactNode;
  /** Reserved height while not yet mounted, prevents layout shift */
  minHeight?: number;
  /** How far before entering viewport to start mounting (px) */
  rootMargin?: string;
  className?: string;
}

export function LazyMount({
  children,
  minHeight = 400,
  rootMargin = "800px",
  className,
}: LazyMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldRender, rootMargin]);

  // minHeight stays as a floor even after mounting, so a shorter skeleton/loading
  // state inside `children` can never shrink the container and yank scroll position.
  return (
    <div ref={ref} className={className} style={{ minHeight }}>
      {shouldRender ? children : null}
    </div>
  );
}
