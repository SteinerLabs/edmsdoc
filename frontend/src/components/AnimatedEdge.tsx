import { useEffect, useRef, useState } from 'react';
import { type EdgeProps, getSmoothStepPath } from 'reactflow';
import { eventBus, type EventPayload } from '../services/eventBus';
import { EventToken } from './EventToken';

interface ParticleState {
  id: string;
  duration: number;
  label: string;
  fill?: string;
  stroke?: string;
  rotate?: 'auto' | '0';
}

type EdgeData = {
  eventName?: string; // default if payload omits label
};

export function AnimatedEdge({
                               id,
                               sourceX,
                               sourceY,
                               targetX,
                               targetY,
                               sourcePosition,
                               targetPosition,
                               markerEnd,
                               data,
                             }: EdgeProps<EdgeData>) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const pathRef = useRef<SVGPathElement | null>(null);
  const [particles, setParticles] = useState<ParticleState[]>([]);

  useEffect(() => {
    const handler = (edgeId: string, payload?: EventPayload) => {
      if (edgeId !== id) return;

      const duration = payload?.duration ?? 1200;
      const label = payload?.label ?? data?.eventName ?? 'Event';

      setParticles((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).slice(2),
          duration,
          label,
          fill: payload?.fill,
          stroke: payload?.stroke,
          rotate: payload?.rotate,
        },
      ]);
    };

    eventBus.on(handler);
    return () => eventBus.off(handler);
  }, [id, data?.eventName]);

  return (
      <g className="react-flow__edge">
        <path
            ref={pathRef}
            id={id}
            d={edgePath}
            stroke="#222"
            strokeWidth={2}
            fill="none"
            markerEnd={markerEnd}
        />

        {particles.map((p) => (
            <EventToken
                key={p.id}
                pathRef={pathRef}
                label={p.label}
                duration={p.duration}
                rotate={p.rotate ?? 'auto'}
                fill={p.fill ?? '#fff'}
                stroke={p.stroke ?? '#222'}
                onDone={() =>
                    setParticles((prev) => prev.filter((x) => x.id !== p.id))
                }
            />
        ))}
      </g>
  );
}