export default function StudyLoading() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10 sm:px-6">
      <div className="animate-pulse space-y-6" aria-label="Cargando estudio bíblico" aria-busy="true">
        <div className="h-5 w-40 rounded bg-muted" />
        <div className="h-14 w-3/4 rounded bg-muted" />
        <div className="h-28 rounded-2xl bg-muted" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="h-20 rounded-xl bg-muted" />
          <div className="h-20 rounded-xl bg-muted" />
          <div className="h-20 rounded-xl bg-muted" />
          <div className="h-20 rounded-xl bg-muted" />
        </div>
      </div>
    </main>
  );
}
