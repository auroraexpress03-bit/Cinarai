'use client';

import { IdentificationProvider } from '../context/IdentificationContext';
import StepIdentifikasi from './StepIdentifikasi';

interface IdentificationLayoutProps {
  comicId: number;
  lokasi: string;
  subtitle: string;
  kelas: string;
  cover: string;
  title: string;
  learningTargets: readonly string[];
  onCompleteChange?: (isComplete: boolean) => void;
}

export default function IdentificationLayout(props: IdentificationLayoutProps) {
  return (
    <IdentificationProvider {...props}>
      <StepIdentifikasi />
    </IdentificationProvider>
  );
}
