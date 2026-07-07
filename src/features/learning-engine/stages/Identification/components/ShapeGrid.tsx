'use client';
import ShapeCard from './ShapeCard';

interface Props {
  options: string[];
  selected: string[];
  onToggle: (name: string) => void;
}

export default function ShapeGrid({ options, selected, onToggle }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {options.map((opt) => (
        <ShapeCard key={opt} name={opt} selected={selected.includes(opt)} onToggle={onToggle} />
      ))}
    </div>
  );
}
