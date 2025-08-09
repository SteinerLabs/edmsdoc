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
  eventName?: string; // default label if payload omits it
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
  data
}: EdgeProps<EdgeData>) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  // Keep the <path> stable and share it with all tokens.
  const pathRef = useRef<SVGPathElement | null>(null);

  // Store all currently animating tokens for this edge.
  const [particles, setParticles] = useState<ParticleState[]>([]);

  // Helper to remove a particle when it completes.
  const removeParticle = (particleId: string) => {
    setParticles((prev) => prev.filter((p) => p.id !== particleId));
  };

  useEffect(() => {
    const onEvent = (edgeId: string, payload?: EventPayload) => {
      if (edgeId !== id) return;

      const duration = Math.max(1, payload?.duration ?? 1200);
      const label = String(payload?.label ?? data?.eventName ?? 'Event');

      const p: ParticleState = {
        id:
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        duration,
        label,
        fill: payload?.fill,
        stroke: payload?.stroke,
        rotate: payload?.rotate ?? 'auto'
      };

      // Append new particle; do not replace existing ones.
      setParticles((prev) => [...prev, p]);
    };

    eventBus.on(onEvent);
    return () => eventBus.off(onEvent);
  }, [id, data?.eventName]);

  return (
    <>
      <path
        ref={pathRef}
        d={edgePath}
        fill="none"
        stroke="#222"
        strokeWidth={1.5}
        markerEnd={markerEnd}
      />

      {particles.map((p) => (
        <EventToken
          key={p.id}
          pathRef={pathRef}
          label={p.label}
          duration={p.duration}
          onDone={() => removeParticle(p.id)}
          fill={p.fill}
          stroke={p.stroke}
          rotate={p.rotate}
        />
      ))}
    </>
  );
}
