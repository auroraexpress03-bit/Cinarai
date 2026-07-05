import { Suspense } from 'react';
import Universal3DViewer from '@/components/viewers/Universal3DViewer';

function ViewerFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6 py-10 text-center">
      <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-8 shadow-sm">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        <p className="mt-4 text-base font-semibold text-neutral-700">Menyiapkan viewer model 3D…</p>
      </div>
    </div>
  );
}

export default function ThreeDViewerPage() {
  return (
    <Suspense fallback={<ViewerFallback />}>
      <Universal3DViewer />
    </Suspense>
  );
}
