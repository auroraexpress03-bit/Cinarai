import { NextRequest, NextResponse } from 'next/server';
import { AiRouter } from '@/lib/ai/router';
import type { AiRequestPayload } from '@/lib/ai/provider';

export const runtime = 'nodejs';

type IntrospectionRequestBody = {
  identificationResult?: string;
  argumentationResult?: string;
  resolutionResult?: string;
  applicationResult?: string;
  confidence?: number;
  reflectionText?: string;
  comicTitle?: string;
  lokasi?: string;
  classLevel?: string;
};

type IntrospectionResponseBody = {
  appreciation: string;
  summary: string;
  strength: string;
  suggestion: string;
  provider?: string;
};

function buildIntrospectionPrompt(body: IntrospectionRequestBody): string {
  return [
    'Kamu adalah AI Refleksi CINARAI untuk siswa Sekolah Dasar Indonesia.',
    '',
    'TUGAS:',
    'Buat teks singkat yang menyapa siswa dan membantu mereka melihat hasil belajarnya.',
    'Baca konteks ini dan jawab dalam bahasa Indonesia yang sederhana, hangat, dan mudah dipahami anak SD.',
    '',
    'ATURAN WAJIB:',
    '1. Berikan apresiasi singkat untuk usaha siswa.',
    '2. Ringkas kemampuan utama yang terlihat dari hasil belajar.',
    '3. Sebutkan satu kekuatan siswa.',
    '4. Berikan satu saran belajar yang bisa mereka lakukan selanjutnya.',
    '5. Gunakan bahasa siswa SD.',
    '6. Maksimal 120 kata.',
    '7. Jawaban harus dalam format JSON ketat tanpa teks lain.',
    '',
    'FORMAT RESPONS (JSON):',
    '{',
    '  "appreciation": "...",',
    '  "summary": "...",',
    '  "strength": "...",',
    '  "suggestion": "..."',
    '}',
    '',
    'KONTEKS HASIL BELAJAR:',
    `- Komik: ${body.comicTitle ?? 'Tidak diketahui'}`,
    `- Lokasi: ${body.lokasi ?? 'Tidak diketahui'}`,
    `- Kelas: ${body.classLevel ?? 'Tidak diketahui'}`,
    `- Hasil Identification: ${body.identificationResult ?? 'Tidak tersedia'}`,
    `- Hasil Argumentation: ${body.argumentationResult ?? 'Tidak tersedia'}`,
    `- Hasil Resolution: ${body.resolutionResult ?? 'Tidak tersedia'}`,
    `- Hasil Application: ${body.applicationResult ?? 'Tidak tersedia'}`,
    `- Confidence siswa: ${body.confidence ?? 'Tidak tersedia'}`,
    `- Refleksi siswa: ${body.reflectionText ?? 'Tidak tersedia'}`,
  ].join('\n');
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as IntrospectionRequestBody;
    if (!body.reflectionText || !body.reflectionText.trim()) {
      return NextResponse.json({ error: 'reflectionText is required' }, { status: 400 });
    }

    const router = AiRouter.createDefault();
    const payload: AiRequestPayload = {
      prompt: buildIntrospectionPrompt(body),
      systemPrompt: 'Kamu adalah AI Refleksi CINARAI. Balas hanya dalam format JSON yang diminta.',
      temperature: 0.4,
      maxTokens: 250,
    };

    const response = await router.generate(payload);
    const raw = typeof response?.content === 'string' ? response.content.trim() : '';
    const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

    let parsed: Partial<IntrospectionResponseBody> = {};
    try {
      parsed = JSON.parse(jsonStr) as Partial<IntrospectionResponseBody>;
    } catch {
      parsed = {
        appreciation:
          'Kamu sudah berani belajar sampai tahap refleksi. Terima kasih sudah berusaha!',
        summary:
          'Kamu telah menyelesaikan beberapa tahap belajar dan menunjukkan sikap rajin.',
        strength:
          'Kekuatanmu adalah semangat belajar dan keberanian menulis refleksi.',
        suggestion:
          'Coba baca kembali catatanmu atau tanya guru jika ada yang belum jelas.',
      };
    }

    return NextResponse.json({
      appreciation: parsed.appreciation ?? 'Kamu sudah melakukan refleksi yang baik.',
      summary: parsed.summary ?? 'Kamu sudah menunjukkan kemajuan dari belajar tadi.',
      strength: parsed.strength ?? 'Kamu punya kekuatan untuk terus berusaha.',
      suggestion: parsed.suggestion ?? 'Tetap latihan dan ajukan pertanyaan jika perlu.',
      provider: response.provider,
    } as IntrospectionResponseBody);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown AI error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
