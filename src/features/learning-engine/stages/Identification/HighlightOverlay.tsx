'use client';

import { motion } from 'framer-motion';

interface Highlight {
  id: string;
  left: string; // percent or px
  top: string;
  width: string;
  height: string;
  label?: string;
}

interface Props {
  highlights: Highlight[];
}

export default function HighlightOverlay({ highlights }: Props) {
  return (
    <div className="absolute inset-0">
      {highlights.map((h) => (
        <motion.div
          key={h.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 0.4 }}
          className="absolute rounded-md border-2 border-blue-300 bg-blue-100/30"
          style={{ left: h.left, top: h.top, width: h.width, height: h.height }}
          aria-hidden
        />
      ))}
    </div>
  );
}
