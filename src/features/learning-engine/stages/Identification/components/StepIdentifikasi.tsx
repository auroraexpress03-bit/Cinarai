'use client';

import { useIdentificationContext } from '../context/IdentificationContext';
import IdentificationHeader from './IdentificationHeader';
import IdentificationProgress from './IdentificationProgress';
import IdentificationTitle from './IdentificationTitle';
import IdentificationInstructions from './IdentificationInstructions';
import IdentificationActivity from './IdentificationActivity';

export default function StepIdentifikasi() {
  const { lokasi, subtitle, kelas, state, percentage } = useIdentificationContext();

  return (
    <div className="flex flex-col gap-4">
      <IdentificationHeader lokasi={lokasi} subtitle={subtitle} kelas={kelas} />
      <IdentificationProgress
        observedCount={state.observedCount}
        totalCount={state.items.length}
        percentage={percentage}
        isComplete={state.isComplete}
      />
      <IdentificationTitle lokasi={lokasi} />
      <IdentificationInstructions />
      <IdentificationActivity />
    </div>
  );
}
