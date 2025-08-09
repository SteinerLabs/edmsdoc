import { type RefObject, useEffect, useRef, useState } from 'react';

type Props = {
    pathRef: RefObject<SVGPathElement | null>;
    label: string;
    duration: number;
    onDone: () => void;
    fill?: string;
    stroke?: string;
    fontSize?: number;
    paddingX?: number;
    paddingY?: number;
    borderRadius?: number;
    rotate?: 'auto' | '0'; // 'auto' = follow tangent, '0' = stay upright
};

export function EventToken({
                               pathRef,
                               label,
                               duration,
                               onDone,
                               fill = '#fff',
                               stroke = '#222',
                               fontSize = 12,
                               paddingX = 8,
                               paddingY = 4,
                               borderRadius = 6,
                               rotate = 'auto',
                           }: Props) {
    const gRef = useRef<SVGGElement | null>(null);
    const textRef = useRef<SVGTextElement | null>(null);
    const [size, setSize] = useState<{ w: number; h: number }>({ w: 60, h: 24 });

    // Measure text and compute token size
    useEffect(() => {
        if (!textRef.current) return;
        const bbox = textRef.current.getBBox();
        const w = Math.max(20, bbox.width + paddingX * 2);
        const h = Math.max(16, bbox.height + paddingY * 2);
        setSize({ w, h });
    }, [label, fontSize, paddingX, paddingY]);

    // Drive animation; robust to pathRef.current being temporarily null
    useEffect(() => {
        let raf = 0;
        let start: number | null = null;
        let totalLen: number | null = null;

        const frame = (ts: number) => {
            const path = pathRef.current;
            const el = gRef.current;

            // Wait until both path and element are mounted
            if (!path || !el) {
                raf = requestAnimationFrame(frame);
                return;
            }

            if (start === null) start = ts;

            if (totalLen === null) {
                totalLen = path.getTotalLength();
                if (!isFinite(totalLen) || totalLen <= 0) {
                    onDone();
                    return;
                }
            }

            const elapsed = ts - start;
            const t = Math.min(1, elapsed / duration);
            const dist = (totalLen as number) * t;

            const p = path.getPointAtLength(dist);
            let angle = 0;

            if (rotate === 'auto') {
                // Use a step relative to path length for stable tangents on long edges
                const eps = Math.max(0.5, (totalLen as number) * 0.002);
                const p2 = path.getPointAtLength(
                    Math.min(totalLen as number, dist + eps)
                );
                angle = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;
            }

            // Rotate first (around local origin), then translate to the path point.
            // This prevents the rotation from orbiting around the page origin.
            el.setAttribute(
                'transform',
                rotate === 'auto'
                    ? `rotate(${angle}) translate(${p.x}, ${p.y})`
                    : `translate(${p.x}, ${p.y})`
            );

            if (t < 1) {
                raf = requestAnimationFrame(frame);
            } else {
                onDone();
            }
        };

        raf = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(raf);
    }, [pathRef, duration, rotate]);

    return (
        <g ref={gRef} pointerEvents="none" style={{ userSelect: 'none' }}>
            <rect
                x={-size.w / 2}
                y={-size.h / 2}
                width={size.w}
                height={size.h}
                rx={borderRadius}
                ry={borderRadius}
                fill={fill}
                stroke={stroke}
            />
            <text
                ref={textRef}
                x={0}
                y={0}
                fontSize={fontSize}
                fill={stroke}
                textAnchor="middle"
                dominantBaseline="middle"
            >
                {label}
            </text>
        </g>
    );
}