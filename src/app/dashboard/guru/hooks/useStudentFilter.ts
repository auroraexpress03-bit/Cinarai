'use client';

import { useMemo, useState } from 'react';
import type { StudentRow } from '../types';

export function useStudentFilter(rows: StudentRow[]) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<'name' | 'progress' | 'completed'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = q
      ? rows.filter(
          (r) =>
            r.displayName.toLowerCase().includes(q) ||
            r.email.toLowerCase().includes(q) ||
            r.schoolName.toLowerCase().includes(q)
        )
      : rows;

    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') cmp = a.displayName.localeCompare(b.displayName, 'id');
      if (sortKey === 'progress') cmp = a.averageProgress - b.averageProgress;
      if (sortKey === 'completed') cmp = a.completedComics - b.completedComics;
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [rows, search, sortKey, sortDir]);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  return { filtered, search, setSearch, sortKey, sortDir, toggleSort };
}
