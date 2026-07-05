import PdfViewer from '@/components/pdf/PdfViewer';

export default function DebugPdfPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-4">
      <div className="mx-auto h-[85vh] max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <PdfViewer pdfPath="/comics/komik-1/comic.pdf" comicTitle="Debug PDF" />
      </div>
    </main>
  );
}
