'use client';

import { motion } from 'framer-motion';

interface Props {
  feedback: Record<string, string>;
}

export default function FeedbackPanel({ feedback }: Props) {
  const entries = Object.entries(feedback);
  if (!entries.length) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-2">
      {entries.map(([k, v]) => {
        const negative = v.startsWith('Tidak');
        return (
          <div
            key={k}
            className={`flex items-start gap-3 p-3 rounded-md border ${
              negative ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'
            }`}
          >
            <div className={`${negative ? 'text-red-600' : 'text-emerald-600'} text-lg`}>{negative ? '✗' : '✓'}</div>
            <div className="text-sm text-neutral-700">{v}</div>
          </div>
        );
      })}
    </motion.div>
  );
}
