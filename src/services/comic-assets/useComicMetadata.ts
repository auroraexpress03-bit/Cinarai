import { useMemo } from 'react';
import { generateComicMetadata } from './metadataGenerator';
import { COMIC_QR_DATA } from '@/data/comicQrData';
import type { ComicMetadata } from './types';

export function useComicMetadata(comicId: number): ComicMetadata {
  return useMemo(() => {
    const data = COMIC_QR_DATA[comicId] ?? { pageCount: 0, qrList: [] };
    return generateComicMetadata(comicId, data.pageCount, data.qrList);
  }, [comicId]);
}
