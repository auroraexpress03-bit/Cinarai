import type { StudentRow } from '../types';
import type { ComicDocument, ComicProgressDocument } from '@/types/firestore';
import type { AiInsight } from '../types';

function formatDate() {
  return new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function progressStatus(p: ComicProgressDocument | null): string {
  if (!p) return 'Belum mulai';
  if (p.status === 'completed') return 'Selesai';
  return `${p.percentage ?? 0}%`;
}

export function buildStudentReportHtml(
  student: StudentRow,
  comics: ComicDocument[],
  insight: AiInsight | null
): string {
  const comicRows = comics
    .map((c) => {
      const p = student.progressList.find((pr) => pr.comicId === c.comicId) ?? null;
      return `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">${c.title}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${progressStatus(p)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${p?.completedStage ?? '—'}</td>
        </tr>`;
    })
    .join('');

  const insightHtml = insight
    ? `
    <h2 style="color:#1875cc;margin-top:24px;">Analisis AI</h2>
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      <tr><td style="padding:6px 0;font-weight:600;width:160px;">Kemampuan</td><td>${insight.capabilitySummary}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600;">Tahap Terbaik</td><td>${insight.bestStage}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600;">Tahap Terlemah</td><td>${insight.weakestStage}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600;">Pola Kesalahan</td><td>${insight.errorPattern}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600;">Rekomendasi</td><td>${insight.teacherRecommendation}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600;">Remedial</td><td>${insight.remedial}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600;">Pengayaan</td><td>${insight.enrichment}</td></tr>
    </table>`
    : '';

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8"/>
<title>Laporan Siswa – ${student.displayName}</title>
<style>
  body { font-family: system-ui, sans-serif; color: #171717; padding: 32px; max-width: 800px; margin: 0 auto; }
  h1 { color: #1875cc; margin-bottom: 4px; }
  .meta { color: #737373; font-size: 13px; margin-bottom: 24px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { background: #f0f7ff; color: #135699; padding: 8px 12px; text-align: left; }
  .footer { margin-top: 32px; font-size: 12px; color: #a3a3a3; border-top: 1px solid #e5e5e5; padding-top: 12px; }
</style>
</head>
<body>
  <h1>Laporan Siswa CINARAI</h1>
  <p class="meta">Dicetak: ${formatDate()}</p>

  <h2 style="color:#1875cc;">Identitas Siswa</h2>
  <table>
    <tr><td style="padding:6px 0;font-weight:600;width:160px;">Nama</td><td>${student.displayName}</td></tr>
    <tr><td style="padding:6px 0;font-weight:600;">Email</td><td>${student.email}</td></tr>
    <tr><td style="padding:6px 0;font-weight:600;">Sekolah</td><td>${student.schoolName}</td></tr>
    <tr><td style="padding:6px 0;font-weight:600;">Kelas</td><td>${student.gradeLevel ? `Kelas ${student.gradeLevel}` : '—'}</td></tr>
    <tr><td style="padding:6px 0;font-weight:600;">Status</td><td>${student.isActive ? 'Aktif' : 'Tidak Aktif'}</td></tr>
    <tr><td style="padding:6px 0;font-weight:600;">Rata-rata Progress</td><td>${student.averageProgress}%</td></tr>
    <tr><td style="padding:6px 0;font-weight:600;">Komik Selesai</td><td>${student.completedComics}</td></tr>
  </table>

  <h2 style="color:#1875cc;margin-top:24px;">Progress Komik</h2>
  <table>
    <thead><tr><th>Komik</th><th style="text-align:center;">Status</th><th style="text-align:center;">Tahap Terakhir</th></tr></thead>
    <tbody>${comicRows}</tbody>
  </table>

  ${insightHtml}

  <div class="footer">CINARAI – Critical Numeracy with AR &amp; AI · ${formatDate()}</div>
</body>
</html>`;
}

export function printStudentReport(
  student: StudentRow,
  comics: ComicDocument[],
  insight: AiInsight | null
) {
  const html = buildStudentReportHtml(student, comics, insight);
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 400);
}
