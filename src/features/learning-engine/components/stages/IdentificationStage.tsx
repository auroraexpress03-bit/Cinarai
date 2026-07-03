'use client';

import { useCallback, useEffect } from 'react';
import { useLearningEngine } from '../../hooks/useLearningEngine';
import { IdentificationLayout } from '../../stages/Identification';

export default function IdentificationStage() {
  const { comic, setCanAdvance } = useLearningEngine();

  useEffect(() => {
    setCanAdvance(false);
  }, [setCanAdvance]);

  const handleCompleteChange = useCallback(
    (isComplete: boolean) => setCanAdvance(isComplete),
    [setCanAdvance]
  );

  return (
    <IdentificationLayout
      comicId={comic.id}
      lokasi={comic.lokasi}
      subtitle={comic.subtitle}
      kelas={comic.kelas}
      cover={comic.cover}
      title={comic.title}
      learningTargets={comic.learningTargets}
      onCompleteChange={handleCompleteChange}
    />
  );
}
