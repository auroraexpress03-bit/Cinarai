'use client';

interface QrModalProps {
  isOpen: boolean;
  qrSrc: string;
  onClose: () => void;
}

export function QrModal({ isOpen, qrSrc, onClose }: QrModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 animate-fade-in backdrop-blur-sm">
      <div className="w-full max-w-[380px] rounded-[20px] bg-white p-5 shadow-2xl animate-scale-up sm:p-6 flex flex-col items-center">
        {/* Header */}
        <div className="w-full space-y-2 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary-600">Pindai dengan Assemblr</p>
          <h2 className="text-2xl font-black text-neutral-900">QR Code</h2>
        </div>

        {/* QR Image - Centered */}
        <div className="mt-6 flex items-center justify-center rounded-[16px] bg-neutral-50 p-6 w-full">
          {qrSrc ? (
            (qrSrc.startsWith('data:') || /\.(png|jpe?g|webp|svg)$/i.test(qrSrc)) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrSrc}
                alt="QR Code"
                className="h-auto w-auto max-w-[280px] object-contain"
              />
            ) : (
              <a
                href={qrSrc}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-primary-600 underline hover:text-primary-700"
              >
                Buka Link
              </a>
            )
          ) : (
            <p className="text-center text-sm text-neutral-500">QR Code tidak tersedia</p>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-[12px] bg-primary-600 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary-700 active:scale-95 min-h-[44px]"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
