"use client";

import React from "react";
import { motion } from "framer-motion";

interface ActivityRingsProps {
  salah: number;
  ilm: number;
  dhikr: number;
  size?: number;
}

export function ActivityRings({ salah, ilm, dhikr, size = 128 }: ActivityRingsProps) {
  const center = size / 2;
  const strokeWidth = 10;
  const r1 = center - 10;
  const r2 = center - 24;
  const r3 = center - 38;

  const ring = (radius: number, pct: number, color: string, delay: number) => {
    const circ = 2 * Math.PI * radius;
    const clamped = Math.max(0, Math.min(100, pct));
    const offset = circ - (clamped / 100) * circ;
    return (
      <>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeOpacity={0.16}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: "spring", stiffness: 380, damping: 32, delay }}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </>
    );
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      {ring(r1, salah, "#10B981", 0.05)}
      {ring(r2, ilm, "#00E5FF", 0.12)}
      {ring(r3, dhikr, "#F59E0B", 0.18)}
    </svg>
  );
}
