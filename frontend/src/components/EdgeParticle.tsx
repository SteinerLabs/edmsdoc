import { useEffect, useRef, type RefObject } from 'react';

interface EdgeParticleProps {
  pathRef: RefObject<SVGPathElement | null>;
  duration: number;
  onDone: () => void;
}

export function EdgeParticle({ pathRef, duration, onDone }: EdgeParticleProps) {
  const circleRef = useRef<SVGCircleElement | null>(null);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();

    function frame() {
      const elapsed = performance.now() - start;
      const t = Math.min(1, elapsed / duration);

      if (pathRef.current && circleRef.current) {
        const pathLength = pathRef.current.getTotalLength();
        const point = pathRef.current.getPointAtLength(pathLength * t);
        circleRef.current.setAttribute('cx', String(point.x));
          circleRef.current.setAttribute('cy', String(point.y));
      }

      if (t < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        onDone();
      }
    }

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [pathRef, duration]);

  return <circle ref={circleRef} r={4} fill="#ff5722" pointerEvents="none" />;
}
