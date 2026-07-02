export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-primary-600">CINARAI</h2>
          <p className="text-sm text-neutral-600 mt-1">Critical Numeracy with AR & AI</p>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
