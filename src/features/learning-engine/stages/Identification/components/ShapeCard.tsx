'use client';

import { motion } from 'framer-motion';

interface Props {
  name: string;
  selected: boolean;
  onToggle: (name: string) => void;
}

export default function ShapeCard({ name, selected, onToggle }: Props) {
  return (
    <motion.button
      type="button"
      onClick={() => onToggle(name)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-200 ease-in-out focus-visible:outline-offset-2 focus-visible:outline-2 focus-visible:outline-blue-400 ${
        selected ? 'border-blue-400 bg-blue-50 shadow-sm' : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'
      }`}
      aria-pressed={selected}
      aria-label={`Pilih ${name}`}
    >
      <div className={`w-10 h-10 rounded flex items-center justify-center ${selected ? 'text-blue-600' : 'text-neutral-500'}`}>
        <span className="font-bold text-base">{name[0]}</span>
      </div>
      <div className="text-sm font-medium text-neutral-700">{name}</div>
    </motion.button>
  );
}
