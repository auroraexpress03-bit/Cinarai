import { NextRequest, NextResponse } from 'next/server';
import { AiRouter } from '@/lib/ai/router';
import type { AiRequestPayload } from '@/lib/ai/provider';

export const runtime = 'nodejs';

type ReqBody = {
  soal?: string;
  gambar?: string[];
  jawabanSiswa?: string[];
  jawabanBenar?: string[];
  attempt?: number;
};

type RespBody = {
  status: 'correct' | 'partial' | 'incorrect';
  message: string;
  provider?: string;
};

function buildPrompt(body: ReqBody): string {
  const soal = body.soal ?? '';
  const gambar = (body.gambar ?? []).map((g) => `- ${g}`).join('\n') || 'Tidak ada gambar';
  const siswa = (body.jawabanSiswa ?? []).join(', ') || 'Tidak memilih jawaban';
  const benar = (body.jawabanBenar ?? []).join(', ') || 'Tidak tersedia';

  return [
    'Kamu adalah AI Coach CINARAI untuk siswa Sekolah Dasar Indonesia.',
    '',
    'TUGAS:',
    'Berikan umpan balik singkat dan ramah kepada siswa setelah mereka menekan tombol CEK.',
    'Gunakan bahasa Indonesia yang sangat sederhana, cocok untuk anak SD.',
    '',
    'INPUT:',
    `Soal: ${soal}`,
    'Gambar:',
    gambar,
    `Jawaban siswa: ${siswa}`,
    `Jawaban benar: ${benar}`,
    '',
    'ATURAN WAJIB:',
    '1) Jika semua jawaban siswa sama persis dengan jawaban benar -> beri apresiasi singkat dan jelaskan alasannya.',
    '2) Jika beberapa jawaban benar dan beberapa salah/terlewat -> jelaskan mana yang benar dan mana yang terlewat, dorong untuk mencoba lagi.',
    '3) Jika tidak ada jawaban yang benar -> berikan petunjuk yang membantu tanpa memberi jawaban akhir.',
    '4) Gunakan kalimat sederhana, singkat, dan ramah.',
    '5) Balas hanya dengan JSON ketat dengan format: {"status":"correct|partial|incorrect","message":"..."} tanpa teks tambahan.',
    '',
    'PANJANG PESAN: Maksimal 140 kata.',
  ].join('\n');
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ReqBody;
    if (!body.jawabanSiswa) {
      return NextResponse.json({ error: 'jawabanSiswa is required' }, { status: 400 });
    }

    const router = AiRouter.createDefault();
    const payload: AiRequestPayload = {
      prompt: buildPrompt(body),
      systemPrompt: 'Kamu adalah AI Coach CINARAI. Balas hanya dalam format JSON yang diminta.',
      temperature: 0.4,
      maxTokens: 220,
    };

    const response = await router.generate(payload);
    const raw = typeof response?.content === 'string' ? response.content.trim() : '';
    const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

    try {
      const parsed = JSON.parse(jsonStr) as RespBody;
      return NextResponse.json({ status: parsed.status, message: parsed.message, provider: response.provider });
    } catch (err) {
      // Fallback: build a simple response based on deterministic comparison
      const siswa = new Set((body.jawabanSiswa ?? []).map((s) => s.toLowerCase().trim()));
      const benar = new Set((body.jawabanBenar ?? []).map((s) => s.toLowerCase().trim()));
      const intersection = [...siswa].filter((s) => benar.has(s));

      let status: RespBody['status'] = 'incorrect';
      let message = 'Maaf, saya tidak bisa memberikan umpan balik sekarang.';

      if (intersection.length === benar.size && benar.size > 0 && siswa.size === benar.size) {
        status = 'correct';
        message = 'Hebat! Jawabanmu lengkap dan benar. Bagian-bagian itu memang sesuai dengan bangun ruang yang disebutkan.';
      } else if (intersection.length > 0) {
        status = 'partial';
        const benarDitemukan = intersection.join(', ');
        const terlewat = [...benar].filter((b) => !siswa.has(b)).join(', ');
        message = `Bagus, kamu menemukan: ${benarDitemukan}. Coba perhatikan lagi untuk menemukan: ${terlewat || 'tidak ada yang terlewat'}.`;
      } else {
        status = 'incorrect';
        message = 'Sepertinya belum tepat. Coba perhatikan bentuk pada gambar: apakah ada sisi datar, melengkung, atau runcing? Gunakan itu sebagai petunjuk.';
      }

      return NextResponse.json({ status, message, provider: response.provider });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown AI error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
