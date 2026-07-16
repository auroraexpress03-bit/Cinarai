import { AppLogo } from '@/components/ui/AppLogo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1F5FBF] via-[#4FC3F7] to-[#F8FAFC] px-4 py-6 sm:px-6"
      style={{
        paddingTop: 'max(1.5rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-[#4FC3F7]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-[#F28C28]/10 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-[420px] flex-col items-center justify-center animate-fade-in-up">
        <div className="relative mb-8 flex min-h-[280px] w-full items-center justify-center overflow-hidden px-4 py-8 sm:min-h-[300px] sm:px-6">
          <div className="flex w-full items-center justify-center pt-8">
            <AppLogo variant="login" priority className="select-none" />
          </div>
        </div>

        <div className="relative -mt-6 w-full rounded-[28px] bg-white px-6 py-8 shadow-[0_20px_60px_rgba(15,30,80,0.18)]">
          {children}
        </div>

        <p className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-100/90">
          Platform Pembelajaran Numerasi Berbasis Etnomatematika
        </p>
      </div>
    </div>
  );
}
