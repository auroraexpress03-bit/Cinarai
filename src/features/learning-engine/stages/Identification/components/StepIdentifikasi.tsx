'use client';

import IdentificationActivity from './IdentificationActivity';
import IdentificationHeader from './IdentificationHeader';

export default function StepIdentifikasi() {
  return (
    <div className="flex flex-col gap-4 animate-fade-in-up">
      <IdentificationHeader />
      <IdentificationActivity />
    </div>
  );
}
