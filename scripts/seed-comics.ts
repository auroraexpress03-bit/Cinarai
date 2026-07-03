/**
 * Seed script — jalankan SATU KALI untuk mengisi collection `comics` di Firestore.
 *
 * LANGKAH SEBELUM MENJALANKAN:
 * 1. Buka Firebase Console → Firestore → Rules
 * 2. Ubah rule `comics` menjadi: allow write: if true;
 * 3. Klik Publish
 * 4. Jalankan: npm run seed
 * 5. Setelah selesai, kembalikan rule: allow write: if false;
 * 6. Klik Publish lagi
 *
 * Atau jika punya Firebase Admin SDK key:
 *   Tambahkan FIREBASE_ADMIN_SDK_KEY ke .env.local lalu jalankan npm run seed
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// ─── Load .env.local ──────────────────────────────────────────────────────────

function loadEnv(): void {
  const envPath = resolve(process.cwd(), '.env.local');
  try {
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    console.error('❌  .env.local tidak ditemukan.');
    process.exit(1);
  }
}

loadEnv();

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY!;

if (!PROJECT_ID || !API_KEY) {
  console.error('❌  NEXT_PUBLIC_FIREBASE_PROJECT_ID atau NEXT_PUBLIC_FIREBASE_API_KEY tidak ditemukan di .env.local');
  process.exit(1);
}

// ─── Comic data ───────────────────────────────────────────────────────────────

const BASE_COVER = '/comics';
const BASE_AVATAR = '/assets/avatars';

const COMICS = [
  {
    docId: 'comic-1',
    comicId: 1,
    slug: 'komik-1',
    title: 'Petualangan Bangun Ruang Candi Jawi',
    subtitle: 'Mengenal Bangun Ruang',
    kelas: 'VI',
    lokasi: 'Candi Jawi',
    synopsis: 'Arka dan teman-temannya mengunjungi Candi Jawi di Pasuruan. Di sana mereka menemukan misteri bentuk-bentuk bangunan candi yang ternyata menyimpan rahasia bangun ruang. Bersama Pak Guru, mereka menjelajahi kubus, balok, prisma, dan limas yang tersembunyi di setiap sudut candi.',
    characters: [
      { name: 'Arka', role: 'Tokoh Utama', description: 'Siswa kelas VI yang penasaran dan suka matematika.', avatar: `${BASE_AVATAR}/arka.png` },
      { name: 'Sari', role: 'Sahabat', description: 'Sahabat Arka yang teliti dan suka mencatat.', avatar: `${BASE_AVATAR}/sari.png` },
      { name: 'Pak Guru', role: 'Pembimbing', description: 'Guru yang bijak dan selalu memberi petunjuk.', avatar: `${BASE_AVATAR}/pak-guru.png` },
    ],
    learningTargets: [
      'Mengenal jenis-jenis bangun ruang (kubus, balok, prisma, limas)',
      'Mengidentifikasi sisi, rusuk, dan titik sudut bangun ruang',
      'Menghubungkan bentuk bangun ruang dengan benda nyata di sekitar',
    ],
    estimatedMinutes: 30,
    pdfUrl: `${BASE_COVER}/komik-1/comic.pdf`,
    coverUrl: `${BASE_COVER}/komik-1/cover.png`,
    thumbnailUrl: `${BASE_COVER}/komik-1/thumbnail.png`,
    order: 1,
    availability: 'ACTIVE',
  },
  {
    docId: 'comic-2',
    comicId: 2,
    slug: 'komik-2',
    title: 'Petualangan Simetri Candi Penataran',
    subtitle: 'Mengenal Simetri',
    kelas: 'V',
    lokasi: 'Candi Penataran',
    synopsis: 'Di Candi Penataran, Blitar, Arka dan Sari terpesona oleh ukiran-ukiran indah yang ternyata memiliki pola simetri. Mereka belajar bahwa seni dan matematika berjalan beriringan melalui konsep simetri lipat dan simetri putar.',
    characters: [
      { name: 'Arka', role: 'Tokoh Utama', description: 'Siswa kelas V yang suka mengamati pola.', avatar: `${BASE_AVATAR}/arka.png` },
      { name: 'Sari', role: 'Sahabat', description: 'Sahabat Arka yang kreatif dan suka menggambar.', avatar: `${BASE_AVATAR}/sari.png` },
    ],
    learningTargets: [
      'Memahami konsep simetri lipat pada bangun datar',
      'Menentukan sumbu simetri suatu bangun',
      'Mengenal simetri putar dan orde putarnya',
    ],
    estimatedMinutes: 30,
    pdfUrl: `${BASE_COVER}/komik-2/comic.pdf`,
    coverUrl: `${BASE_COVER}/komik-2/cover.png`,
    thumbnailUrl: `${BASE_COVER}/komik-2/thumbnail.png`,
    order: 2,
    availability: 'ACTIVE',
  },
  {
    docId: 'comic-3',
    comicId: 3,
    slug: 'komik-3',
    title: 'Petualangan di Rumah Gajah Mungkur',
    subtitle: 'Mengenal Bilangan',
    kelas: 'II',
    lokasi: 'Gajah Mungkur',
    synopsis: 'Arka kecil mengunjungi Waduk Gajah Mungkur bersama keluarganya. Di sana ia bertemu dengan nelayan yang mengajarinya cara menghitung ikan menggunakan bilangan. Petualangan seru mengenal bilangan 1 sampai 100 dimulai!',
    characters: [
      { name: 'Arka', role: 'Tokoh Utama', description: 'Siswa kelas II yang ceria dan suka berhitung.', avatar: `${BASE_AVATAR}/arka.png` },
      { name: 'Pak Nelayan', role: 'Pembimbing', description: 'Nelayan ramah yang suka berbagi ilmu.', avatar: `${BASE_AVATAR}/pak-nelayan.png` },
    ],
    learningTargets: [
      'Membilang dan menulis bilangan 1 sampai 100',
      'Membandingkan dua bilangan (lebih besar, lebih kecil, sama dengan)',
      'Mengurutkan bilangan dari terkecil ke terbesar',
    ],
    estimatedMinutes: 25,
    pdfUrl: `${BASE_COVER}/komik-3/comic.pdf`,
    coverUrl: `${BASE_COVER}/komik-3/cover.png`,
    thumbnailUrl: `${BASE_COVER}/komik-3/thumbnail.png`,
    order: 3,
    availability: 'ACTIVE',
  },
  {
    docId: 'comic-4',
    comicId: 4,
    slug: 'komik-4',
    title: 'Petualangan di Jembatan Merah',
    subtitle: 'Mengenal Pengukuran',
    kelas: 'IV',
    lokasi: 'Jembatan Merah',
    synopsis: 'Di kawasan bersejarah Jembatan Merah Surabaya, Arka dan teman-teman mendapat tantangan mengukur panjang jembatan tanpa penggaris. Mereka belajar satuan panjang baku dan tidak baku sambil menjelajahi sejarah kota.',
    characters: [
      { name: 'Arka', role: 'Tokoh Utama', description: 'Siswa kelas IV yang suka tantangan.', avatar: `${BASE_AVATAR}/arka.png` },
      { name: 'Sari', role: 'Sahabat', description: 'Sahabat Arka yang selalu membawa alat tulis.', avatar: `${BASE_AVATAR}/sari.png` },
    ],
    learningTargets: [
      'Memahami satuan panjang baku (cm, m, km) dan tidak baku',
      'Mengkonversi satuan panjang',
      'Mengukur panjang benda menggunakan alat ukur yang tepat',
    ],
    estimatedMinutes: 30,
    pdfUrl: null,
    coverUrl: `${BASE_COVER}/komik-4/cover.png`,
    thumbnailUrl: `${BASE_COVER}/komik-4/thumbnail.png`,
    order: 4,
    availability: 'COMING_SOON',
  },
  {
    docId: 'comic-5',
    comicId: 5,
    slug: 'komik-5',
    title: 'Serunya Belajar Bangun Datar di Keraton Sumenep',
    subtitle: 'Mengenal Bangun Datar',
    kelas: 'II',
    lokasi: 'Keraton Sumenep',
    synopsis: 'Arka mengunjungi Keraton Sumenep di Madura dan terkagum-kagum dengan arsitekturnya. Gerbang, jendela, dan lantai keraton ternyata penuh dengan bentuk-bentuk bangun datar. Bersama pemandu keraton, Arka belajar mengenal segitiga, persegi, dan lingkaran.',
    characters: [
      { name: 'Arka', role: 'Tokoh Utama', description: 'Siswa kelas II yang suka bertanya.', avatar: `${BASE_AVATAR}/arka.png` },
      { name: 'Kak Pemandu', role: 'Pembimbing', description: 'Pemandu keraton yang ramah dan berpengetahuan luas.', avatar: `${BASE_AVATAR}/kak-pemandu.png` },
    ],
    learningTargets: [
      'Mengenal bangun datar: segitiga, persegi, persegi panjang, lingkaran',
      'Membedakan bangun datar berdasarkan ciri-cirinya',
      'Menemukan bangun datar pada benda-benda di sekitar',
    ],
    estimatedMinutes: 25,
    pdfUrl: null,
    coverUrl: `${BASE_COVER}/komik-5/cover.png`,
    thumbnailUrl: `${BASE_COVER}/komik-5/thumbnail.png`,
    order: 5,
    availability: 'COMING_SOON',
  },
] as const;

// ─── Firestore REST helpers ───────────────────────────────────────────────────

type FirestoreValue =
  | { stringValue: string }
  | { integerValue: string }
  | { booleanValue: boolean }
  | { nullValue: null }
  | { arrayValue: { values: FirestoreValue[] } }
  | { mapValue: { fields: Record<string, FirestoreValue> } };

function toFirestoreValue(value: unknown): FirestoreValue {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') return { integerValue: String(value) };
  if (typeof value === 'string') return { stringValue: value };
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }
  if (typeof value === 'object') {
    const fields: Record<string, FirestoreValue> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

function toFirestoreFields(obj: Record<string, unknown>): Record<string, FirestoreValue> {
  const fields: Record<string, FirestoreValue> = {};
  for (const [k, v] of Object.entries(obj)) {
    fields[k] = toFirestoreValue(v);
  }
  return fields;
}

async function writeDocument(docId: string, data: Record<string, unknown>): Promise<void> {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/comics/${docId}?key=${API_KEY}`;

  const body = JSON.stringify({ fields: toFirestoreFields(data) });

  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HTTP ${res.status}: ${err}`);
  }
}

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function seed(): Promise<void> {
  console.log(`\n🌱  Seeding Firestore project: ${PROJECT_ID}\n`);

  for (const comic of COMICS) {
    const { docId, ...data } = comic;
    await writeDocument(docId, data as unknown as Record<string, unknown>);
    console.log(`  ✅  ${docId}  —  ${data.title}`);
  }

  console.log('\n🎉  Seed selesai. Collection `comics` berisi 5 dokumen.');
  console.log('⚠️   Jangan lupa kembalikan Firestore rules: allow write: if false;\n');
  process.exit(0);
}

seed().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes('403') || msg.includes('PERMISSION_DENIED')) {
    console.error('\n❌  PERMISSION_DENIED');
    console.error('   Pastikan Firestore rules sudah diubah: allow write: if true;');
    console.error('   Buka: https://console.firebase.google.com/project/' + PROJECT_ID + '/firestore/rules\n');
  } else {
    console.error('❌  Seed gagal:', msg);
  }
  process.exit(1);
});
