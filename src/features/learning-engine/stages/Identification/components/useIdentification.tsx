'use client';

import { useCallback, useState } from 'react';

type State = {
  selectedShapes: string[];
  correctShapes: string[];
  highlightShapes: string[];
  feedback: Record<string, string>;
  completed: boolean;
  loading: boolean;
};

export function useIdentification() {
  const [state, setState] = useState<State>({
    selectedShapes: [],
    correctShapes: ['Balok', 'Limas', 'Prisma'],
    highlightShapes: [],
    feedback: {},
    completed: false,
    loading: false,
  });

  const toggleShape = useCallback((shape: string) => {
    setState((s) => {
      const exists = s.selectedShapes.includes(shape);
      const selected = exists ? s.selectedShapes.filter((x) => x !== shape) : [...s.selectedShapes, shape];
      return { ...s, selectedShapes: selected };
    });
  }, []);

  const setSelectedShapes = useCallback((shapes: string[]) => {
    setState((s) => {
      const fb: Record<string, string> = {};
      const all = ['Kubus', 'Balok', 'Prisma', 'Limas', 'Kerucut'];
      const correctSet = new Set(s.correctShapes);

      all.forEach((shape) => {
        if (shapes.includes(shape)) {
          if (correctSet.has(shape)) fb[shape] = `Bagian ini menyerupai ${shape.toLowerCase()}.`;
          else fb[shape] = `Tidak ditemukan bentuk ${shape.toLowerCase()} pada gambar.`;
        } else {
          if (correctSet.has(shape)) fb[shape] = `Seharusnya kamu memilih ${shape}. Contoh: bagian dasar/struktur.`;
          else fb[shape] = `Tidak ditemukan bentuk ${shape.toLowerCase()}.`;
        }
      });

      const highlightShapes = shapes.filter((sh) => correctSet.has(sh));
      const completed = s.correctShapes.every((c) => shapes.includes(c));
      return { ...s, selectedShapes: shapes, feedback: fb, highlightShapes, completed };
    });
  }, []);

  const evaluate = useCallback(() => {
    setState((s) => {
      const fb: Record<string, string> = {};
      const all = ['Kubus', 'Balok', 'Prisma', 'Limas', 'Kerucut'];
      const correctSet = new Set(s.correctShapes);
      all.forEach((shape) => {
        if (s.selectedShapes.includes(shape)) {
          if (correctSet.has(shape)) fb[shape] = `Bagian ini menyerupai ${shape.toLowerCase()}.`;
          else fb[shape] = `Tidak ditemukan bentuk ${shape.toLowerCase()} pada gambar.`;
        } else {
          if (correctSet.has(shape)) fb[shape] = `Seharusnya kamu memilih ${shape}. Contoh: bagian dasar/struktur.`;
          else fb[shape] = `Tidak ditemukan bentuk ${shape.toLowerCase()}.`;
        }
      });

      const highlightShapes = s.selectedShapes.filter((sh) => correctSet.has(sh));
      const completed = s.correctShapes.every((c) => s.selectedShapes.includes(c));
      return { ...s, feedback: fb, highlightShapes, completed };
    });
  }, []);

  const reset = useCallback(() => {
    setState({ selectedShapes: [], correctShapes: ['Balok', 'Limas', 'Prisma'], highlightShapes: [], feedback: {}, completed: false, loading: false });
  }, []);

  return {
    state,
    toggleShape,
    setSelectedShapes,
    evaluate,
    reset,
  } as const;
}

export default useIdentification;
