export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-6">
      <div className="mx-auto max-w-lg">
        <div className="animate-pulse space-y-6">
          <div className="h-40 rounded-3xl bg-gradient-to-br from-primary-200 to-primary-400 shadow-sm" />

          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <div className="h-6 w-3/4 rounded bg-neutral-100" />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="h-20 rounded-lg bg-neutral-100" />
              <div className="h-20 rounded-lg bg-neutral-100" />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <div className="h-4 w-1/2 rounded bg-neutral-100" />
            <div className="mt-3 space-y-2">
              <div className="h-12 rounded-lg bg-neutral-100" />
              <div className="h-12 rounded-lg bg-neutral-100" />
              <div className="h-12 rounded-lg bg-neutral-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
