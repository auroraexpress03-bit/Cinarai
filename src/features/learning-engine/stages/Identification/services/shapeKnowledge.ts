export type ShapeKnowledgeStatus = 'FOUND' | 'NOT_FOUND' | 'DISTRACTOR';

export interface ShapeKnowledgeEntry {
  id: string;
  title: string;
  comicPage: number;
  location: string;
  found: boolean;
  status: ShapeKnowledgeStatus;
  description: string;
  formula: {
    surface: string;
    volume: string;
  };
  characteristics: string[];
  name: string;
  definition: string;
  faces: string;
  edges: string;
  vertices: string;
  surfaceFormula: string;
  volumeFormula: string;
  foundInTemple: boolean;
  templeLocation: string;
  comicReference: string;
  functionInBuilding: string;
  exampleObjects: string[];
  explanation: string;
  reflectionQuestion: string;
}

export const shapeKnowledge: ShapeKnowledgeEntry[] = [
  {
    id: 'kubus',
    title: 'Kubus',
    comicPage: 13,
    location: 'bagian kaki candi yang tampak kotak-kotak',
    found: true,
    status: 'FOUND',
    description: 'Bangun ruang dengan 6 sisi persegi yang sama besar. Tampak pada bagian kaki Candi Jawi.',
    formula: { surface: '6s²', volume: 's³' },
    name: 'Kubus',
    definition: 'Kubus adalah bangun ruang yang punya 6 sisi berbentuk persegi dan semua rusuk sama panjang.',
    characteristics: ['6 sisi persegi', '12 rusuk sama panjang', '8 titik sudut'],
    faces: '6',
    edges: '12',
    vertices: '8',
    surfaceFormula: '6s²',
    volumeFormula: 's³',
    foundInTemple: true,
    templeLocation: 'susunan batu pada bagian kaki candi yang tampak kotak-kotak',
    comicReference: 'Lihat halaman 13 pada komik saat tokoh mengamati bagian kaki candi yang kotak-kotak.',
    functionInBuilding: 'Kubus membantu menunjukkan bagian struktur yang sederhana, stabil, dan mudah disusun.',
    exampleObjects: ['dadu', 'kardus', 'kotak mainan'],
    explanation: 'Bentuk kubus terlihat pada bagian batu yang tampak seperti kotak. Pada panel komik, bagian ini membantu melihat bahwa bentuk candi tidak selalu bulat atau runcing.',
    reflectionQuestion: 'Mengapa menurutmu bagian ini paling mirip dengan kubus dibanding bangun ruang lain?',
  },
  {
    id: 'balok',
    title: 'Balok',
    comicPage: 16,
    location: 'tubuh utama candi yang tampak memanjang',
    found: true,
    status: 'FOUND',
    description: 'Bangun ruang dengan 6 sisi persegi panjang. Tampak pada tubuh utama Candi Jawi.',
    formula: { surface: '2(pl + pt + lt)', volume: 'p × l × t' },
    name: 'Balok',
    definition: 'Balok adalah bangun ruang yang punya 6 sisi berbentuk persegi panjang.',
    characteristics: ['6 sisi', '12 rusuk', '8 titik sudut'],
    faces: '6',
    edges: '12',
    vertices: '8',
    surfaceFormula: '2(pl + pt + lt)',
    volumeFormula: 'p × l × t',
    foundInTemple: true,
    templeLocation: 'bagian tubuh utama Candi Jawi yang tampak memanjang',
    comicReference: 'Lihat halaman 16 pada komik saat tokoh mengamati badan candi yang kokoh dan tersusun rapi.',
    functionInBuilding: 'Balok sering dipakai sebagai bagian tubuh bangunan yang kuat dan kokoh.',
    exampleObjects: ['batu bata', 'kotak penyimpanan', 'rak buku'],
    explanation: 'Bentuk balok terlihat pada susunan batu yang kuat dan rapi. Pada Candi Jawi, bagian ini membantu mengamati struktur bangunan yang kokoh.',
    reflectionQuestion: 'Mengapa bagian ini lebih cocok disebut balok daripada bangun ruang lain?',
  },
  {
    id: 'limas',
    title: 'Limas',
    comicPage: 17,
    location: 'atap candi yang meruncing ke atas',
    found: true,
    status: 'FOUND',
    description: 'Bangun ruang dengan alas persegi dan 4 sisi segitiga yang bertemu di satu titik puncak. Tampak pada atap candi.',
    formula: { surface: 'L alas + ½ × keliling alas × t sisi', volume: '⅓ × luas alas × tinggi' },
    name: 'Limas',
    definition: 'Limas adalah bangun ruang yang punya satu alas dan sisi-sisi tegak berbentuk segitiga.',
    characteristics: ['satu alas', 'sisi tegak segitiga', 'puncak runcing'],
    faces: 'n + 1',
    edges: '2n',
    vertices: 'n + 1',
    surfaceFormula: 'L alas + ½ × keliling alas × t sisi',
    volumeFormula: '⅓ × luas alas × tinggi',
    foundInTemple: true,
    templeLocation: 'bagian atap candi yang meruncing ke atas',
    comicReference: 'Lihat halaman 17 pada komik saat bagian puncak candi tampak runcing.',
    functionInBuilding: 'Limas membantu membentuk atap yang runcing dan terlihat tajam.',
    exampleObjects: ['atap rumah', 'menara', 'ornamen puncak'],
    explanation: 'Saat atap candi mengarah ke puncak, bentuknya mirip limas. Pada panel komik, bagian ini terlihat tajam dan stabil seperti bentuk limas.',
    reflectionQuestion: 'Mengapa menurutmu atap candi lebih cocok dibuat seperti limas?',
  },
  {
    id: 'prisma',
    title: 'Prisma',
    comicPage: 22,
    location: 'bagian dinding candi yang tersusun berlapis',
    found: true,
    status: 'FOUND',
    description: 'Bangun ruang dengan dua alas sejajar dan sisi-sisi tegak yang menghubungkan kedua alas. Tampak pada dinding candi.',
    formula: { surface: '2 × luas alas + keliling alas × tinggi', volume: 'luas alas × tinggi' },
    name: 'Prisma',
    definition: 'Prisma adalah bangun ruang yang punya dua alas yang sama dan sisi-sisi tegak yang menghubungkan kedua alas itu.',
    characteristics: ['dua alas sama', 'sisi tegak lurus', 'bisa terlihat seperti balok panjang'],
    faces: 'n + 2',
    edges: '3n',
    vertices: '2n',
    surfaceFormula: '2 × luas alas + keliling alas × tinggi',
    volumeFormula: 'luas alas × tinggi',
    foundInTemple: true,
    templeLocation: 'bagian struktur dinding candi yang tersusun berlapis',
    comicReference: 'Lihat halaman 22 pada komik saat tokoh melihat dinding dan susunan batu candi.',
    functionInBuilding: 'Prisma membantu membentuk bagian yang panjang dan berlapis seperti dinding penyangga.',
    exampleObjects: ['bungkus cokelat', 'kotak pensil panjang', 'tiang beraturan'],
    explanation: 'Bentuk prisma membantu melihat bahwa beberapa bagian candi tampak panjang dan berjajar. Pada panel komik, susunannya membuat tampilan candi terlihat lebih teratur.',
    reflectionQuestion: 'Menurutmu, apakah bagian ini lebih mirip prisma atau balok?',
  },
  {
    id: 'kerucut',
    title: 'Kerucut',
    comicPage: 28,
    location: 'bagian puncak candi yang meruncing',
    found: true,
    status: 'FOUND',
    description: 'Bangun ruang dengan alas lingkaran dan satu titik puncak. Muncul pada bagian puncak candi.',
    formula: { surface: 'πr(r + s)', volume: '⅓ πr²t' },
    name: 'Kerucut',
    definition: 'Kerucut adalah bangun ruang yang punya alas berbentuk lingkaran dan satu titik puncak.',
    characteristics: ['alas lingkaran', 'satu puncak', 'sisi tegak melengkung'],
    faces: '2',
    edges: '1',
    vertices: '1',
    surfaceFormula: 'πr(r + s)',
    volumeFormula: '⅓ πr²t',
    foundInTemple: true,
    templeLocation: 'bagian puncak candi yang meruncing',
    comicReference: 'Lihat halaman 28 pada komik saat bagian puncak candi dikaitkan dengan bentuk meruncing.',
    functionInBuilding: 'Kerucut membantu menunjukkan bagian yang meruncing dan tajam.',
    exampleObjects: ['es krim cone', 'topi ulang tahun', 'corong'],
    explanation: 'Bentuk kerucut cocok untuk bagian yang meruncing pada candi. Pada panel komik, bentuk ini terlihat sebagai bagian yang membantu membentuk puncak.',
    reflectionQuestion: 'Apa perbedaan paling mudah yang kamu lihat antara bentuk kerucut dan limas pada komik?',
  },
  {
    id: 'persegi',
    title: 'Persegi',
    comicPage: 13,
    location: 'alas Umpang pada Candi Penataran',
    found: true,
    status: 'FOUND',
    description: 'Bangun datar dengan empat sisi sama panjang dan empat garis simetri. Tampak pada alas Umpang pada relief candi.',
    formula: { surface: 's × s', volume: '-' },
    name: 'Persegi',
    definition: 'Persegi adalah bangun datar dengan empat sisi sama panjang dan empat sudut siku-siku.',
    characteristics: ['empat sisi sama panjang', 'empat sudut siku-siku', 'empat garis simetri'],
    faces: '1',
    edges: '4',
    vertices: '4',
    surfaceFormula: 's × s',
    volumeFormula: '-',
    foundInTemple: true,
    templeLocation: 'alas Umpang pada relief Candi Penataran',
    comicReference: 'Lihat halaman komik saat Umpang menunjukkan pola persegi yang seimbang.',
    functionInBuilding: 'Persegi membantu menunjukkan pola simetris pada ukiran dan relief candi.',
    exampleObjects: ['kertas gambar', 'ubin lantai', 'meja kecil'],
    explanation: 'Persegi muncul pada alas Umpang di komik dan ditandai oleh sisi yang sama panjang dan simetri kiri-kanan.',
    reflectionQuestion: 'Mengapa bentuk alas Umpang lebih mirip persegi daripada bentuk lainnya?',
  },
  {
    id: 'persegi-panjang',
    title: 'Persegi Panjang',
    comicPage: 15,
    location: 'alas Bale Agung pada Candi Penataran',
    found: true,
    status: 'FOUND',
    description: 'Bangun datar dengan dua pasang sisi yang sama panjang dan empat sudut siku-siku. Tampak pada alas Bale Agung.',
    formula: { surface: 'p × l', volume: '-' },
    name: 'Persegi Panjang',
    definition: 'Persegi panjang adalah bangun datar dengan dua pasang sisi yang sama panjang dan sudut siku-siku.',
    characteristics: ['dua pasang sisi sama panjang', 'empat sudut siku-siku', 'dua garis simetri'],
    faces: '1',
    edges: '4',
    vertices: '4',
    surfaceFormula: 'p × l',
    volumeFormula: '-',
    foundInTemple: true,
    templeLocation: 'alas Bale Agung pada relief Candi Penataran',
    comicReference: 'Lihat halaman komik saat Bale Agung menampilkan bidang yang memanjang.',
    functionInBuilding: 'Persegi panjang membantu menunjukkan bagian candi yang memanjang dan rapi.',
    exampleObjects: ['pintu', 'meja makan', 'kertas latih'],
    explanation: 'Persegi panjang tampak pada alas Bale Agung karena memiliki sisi panjang dan pendek yang berhadapan.',
    reflectionQuestion: 'Mengapa sisi bidang ini cocok disebut persegi panjang?',
  },
  {
    id: 'segitiga-sama-sisi',
    title: 'Segitiga Sama Sisi',
    comicPage: 17,
    location: 'atap Candi Angka pada Candi Penataran',
    found: true,
    status: 'FOUND',
    description: 'Bangun datar dengan tiga sisi sama panjang dan tiga garis simetri. Tampak pada atap Candi Angka.',
    formula: { surface: '½ × a × t', volume: '-' },
    name: 'Segitiga Sama Sisi',
    definition: 'Segitiga sama sisi adalah bangun datar dengan tiga sisi sama panjang dan tiga sudut sama besar.',
    characteristics: ['tiga sisi sama panjang', 'tiga sudut sama besar', 'tiga garis simetri'],
    faces: '1',
    edges: '3',
    vertices: '3',
    surfaceFormula: '½ × a × t',
    volumeFormula: '-',
    foundInTemple: true,
    templeLocation: 'atap Candi Angka pada Candi Penataran',
    comicReference: 'Lihat halaman komik saat Candi Angka menunjukkan bentuk segitiga yang simetris.',
    functionInBuilding: 'Segitiga sama sisi membantu menunjukkan pola atap yang seimbang dan tajam.',
    exampleObjects: ['potongan kue', 'tenda segitiga', 'ornamen bendera'],
    explanation: 'Segitiga sama sisi muncul pada atap Candi Angka karena semua sisinya sama panjang dan bentuknya seimbang.',
    reflectionQuestion: 'Apa yang membuat segitiga ini terlihat sangat seimbang?',
  },
  {
    id: 'segitiga-sama-kaki',
    title: 'Segitiga Sama Kaki',
    comicPage: 17,
    location: 'bagian Mensir pada Candi Penataran',
    found: true,
    status: 'FOUND',
    description: 'Bangun datar dengan dua sisi sama panjang dan satu garis simetri. Tampak pada Mensir yang mirip segitiga.',
    formula: { surface: '½ × a × t', volume: '-' },
    name: 'Segitiga Sama Kaki',
    definition: 'Segitiga sama kaki adalah bangun datar dengan dua sisi sama panjang dan sudut yang seimbang di kedua sisinya.',
    characteristics: ['dua sisi sama panjang', 'satu garis simetri', 'dua sudut sama besar'],
    faces: '1',
    edges: '3',
    vertices: '3',
    surfaceFormula: '½ × a × t',
    volumeFormula: '-',
    foundInTemple: true,
    templeLocation: 'bagian Mensir pada Candi Penataran',
    comicReference: 'Lihat halaman komik saat Mensir diperlihatkan sebagai bentuk segitiga yang seimbang.',
    functionInBuilding: 'Segitiga sama kaki membantu menunjukkan bagian candi yang simetris tetapi tidak sama sisi.',
    exampleObjects: ['atap tenda', 'bendera segitiga', 'meja segitiga'],
    explanation: 'Mensir pada komik tampak seperti segitiga sama kaki karena hanya dua sisinya yang sama panjang.',
    reflectionQuestion: 'Mengapa garis simetri hanya muncul satu pada segitiga ini?',
  },
  {
    id: 'lingkaran',
    title: 'Lingkaran',
    comicPage: 13,
    location: 'relief lingkaran pada Candi Penataran',
    found: true,
    status: 'FOUND',
    description: 'Bangun datar beraturan yang tampak bulat dan seimbang. Tampak pada relief lingkaran di Candi Penataran.',
    formula: { surface: 'πr²', volume: '-' },
    name: 'Lingkaran',
    definition: 'Lingkaran adalah bangun datar dengan semua titik pada tepinya berjarak sama dari pusat.',
    characteristics: ['tidak punya sudut', 'tidak punya rusuk', 'simetri putar penuh'],
    faces: '1',
    edges: '0',
    vertices: '0',
    surfaceFormula: 'πr²',
    volumeFormula: '-',
    foundInTemple: true,
    templeLocation: 'relief lingkaran pada Candi Penataran',
    comicReference: 'Lihat halaman komik saat relief lingkaran muncul pada detail ukiran candi.',
    functionInBuilding: 'Lingkaran membantu menunjukkan unsur bundar yang seimbang pada relief.',
    exampleObjects: ['roda', 'jam dinding', 'cincin'],
    explanation: 'Lingkaran tampak pada relief dan ukiran candi, menunjukkan kesimetrisan bentuk yang bundar.',
    reflectionQuestion: 'Bagaimana kamu tahu relief ini adalah lingkaran?',
  },
  {
    id: 'belah-ketupat',
    title: 'Belah Ketupat',
    comicPage: 18,
    location: 'bangunan runtuh pendopo pada Candi Penataran',
    found: true,
    status: 'FOUND',
    description: 'Bangun datar dengan empat sisi sama panjang dan dua garis simetri. Tampak pada bagian yang menyerupai berlian.',
    formula: { surface: '½ × d1 × d2', volume: '-' },
    name: 'Belah Ketupat',
    definition: 'Belah ketupat adalah bangun datar dengan empat sisi sama panjang dan dua sumbu simetri.',
    characteristics: ['empat sisi sama panjang', 'dua sumbu simetri', 'bentuk seperti berlian'],
    faces: '1',
    edges: '4',
    vertices: '4',
    surfaceFormula: '½ × d1 × d2',
    volumeFormula: '-',
    foundInTemple: true,
    templeLocation: 'bangunan runtuh pendopo pada Candi Penataran',
    comicReference: 'Lihat halaman komik saat bagian pendopo tampak seperti bentuk berlian.',
    functionInBuilding: 'Belah ketupat membantu menunjukkan pola bangun yang berulang di relief dan lantai candi.',
    exampleObjects: ['ornamen berlian', 'papan tanda', 'hiasan kaca'],
    explanation: 'Bentuk belah ketupat muncul oleh sisi-sisi yang sama panjang dan simetri diagonalnya.',
    reflectionQuestion: 'Mengapa bentuk ini lebih pas disebut belah ketupat?',
  },
  {
    id: 'bola',
    title: 'Bola',
    comicPage: 0,
    location: 'tidak dibahas',
    found: false,
    status: 'NOT_FOUND',
    description: 'Tidak dibahas sebagai bentuk utama pada komik 1.',
    formula: { surface: '4πr²', volume: '4/3 πr³' },
    name: 'Bola',
    definition: 'Bola adalah bangun ruang yang seluruh permukaannya melengkung.',
    characteristics: ['tidak punya rusuk', 'permukaannya bulat', 'tidak punya sudut'],
    faces: '1',
    edges: '0',
    vertices: '0',
    surfaceFormula: '4πr²',
    volumeFormula: '4/3 πr³',
    foundInTemple: false,
    templeLocation: 'tidak ada bagian utama Candi Jawi yang menyerupai bola',
    comicReference: 'Perhatikan panel komik 1 untuk melihat mengapa bentuk ini tidak termasuk bentuk utama Candi Jawi.',
    functionInBuilding: 'Bola tidak dipakai sebagai bagian utama bangunan candi dalam komik ini.',
    exampleObjects: ['bola', 'globus', 'kelereng'],
    explanation: 'Bentuk bola tidak muncul sebagai bagian utama candi pada komik 1.',
    reflectionQuestion: 'Mengapa bagian utama candi lebih cocok dipelajari sebagai kubus, balok, atau limas?',
  },
  {
    id: 'tabung',
    title: 'Tabung',
    comicPage: 0,
    location: 'tidak dibahas',
    found: false,
    status: 'NOT_FOUND',
    description: 'Tidak dibahas sebagai bentuk utama pada komik 1.',
    formula: { surface: '2πr(r + t)', volume: 'πr²t' },
    name: 'Tabung',
    definition: 'Tabung adalah bangun ruang yang punya alas dan tutup berbentuk lingkaran.',
    characteristics: ['alas lingkaran', 'tutup lingkaran', 'sisi tegak melengkung'],
    faces: '3',
    edges: '2',
    vertices: '0',
    surfaceFormula: '2πr(r + t)',
    volumeFormula: 'πr²t',
    foundInTemple: false,
    templeLocation: 'bukan bentuk dominan pada struktur utama Candi Jawi',
    comicReference: 'Perhatikan panel komik 1 untuk membandingkan bentuk ini dengan bagian candi yang lebih dominan.',
    functionInBuilding: 'Tabung tidak dipakai sebagai bagian utama bangunan candi dalam komik ini.',
    exampleObjects: ['kaleng', 'gelas', 'pipa'],
    explanation: 'Bentuk tabung tidak muncul sebagai bagian utama candi pada komik 1.',
    reflectionQuestion: 'Menurutmu, bagian mana pada komik lebih cocok disebut sebagai balok atau limas daripada tabung?',
  },
];

export function normalizeShapeId(value: string | null | undefined): string {
  const normalized = (value ?? '').trim().toLowerCase();
  if (!normalized) return '';
  if (normalized.includes('limas')) return 'limas';
  if (normalized.includes('prisma')) return 'prisma';
  if (normalized.includes('persegi panjang')) return 'persegi-panjang';
  if (normalized.includes('persegi')) return 'persegi';
  if (normalized.includes('segitiga sama sisi')) return 'segitiga-sama-sisi';
  if (normalized.includes('segitiga sama kaki')) return 'segitiga-sama-kaki';
  if (normalized.includes('segitiga')) return 'segitiga';
  if (normalized.includes('belah ketupat')) return 'belah-ketupat';
  if (normalized.includes('lingkaran')) return 'lingkaran';
  if (normalized.includes('balok')) return 'balok';
  if (normalized.includes('kubus')) return 'kubus';
  if (normalized.includes('kerucut')) return 'kerucut';
  if (normalized.includes('tabung')) return 'tabung';
  if (normalized.includes('bola')) return 'bola';
  return normalized;
}

export function getShapeKnowledgeEntries(): ShapeKnowledgeEntry[] {
  return [...shapeKnowledge];
}

export function getShapeKnowledgeEntry(value: string | null | undefined): ShapeKnowledgeEntry | null {
  const id = normalizeShapeId(value);
  if (!id) return null;
  return shapeKnowledge.find((entry) => entry.id === id) ?? null;
}

export function getIdentificationOptionEntries(): ShapeKnowledgeEntry[] {
  return shapeKnowledge.filter((entry) => entry.found);
}

export function buildShapeKnowledgeContext(entry: ShapeKnowledgeEntry | null | undefined): string {
  if (!entry) {
    return 'Tidak ada pengetahuan objek yang tersedia.';
  }

  return [
    `Objek: ${entry.title}`,
    `Definisi: ${entry.definition}`,
    `Ciri: ${entry.characteristics.join(', ')}`,
    `Jumlah sisi: ${entry.faces}`,
    `Jumlah rusuk: ${entry.edges}`,
    `Jumlah titik sudut: ${entry.vertices}`,
    `Rumus luas permukaan: ${entry.formula.surface}`,
    `Rumus volume: ${entry.formula.volume}`,
    `Lokasi pada Candi Jawi: ${entry.templeLocation}`,
    `Fungsi pada bangunan: ${entry.functionInBuilding}`,
    `Hubungan dengan komik: ${entry.comicReference}`,
    `Contoh benda lain: ${entry.exampleObjects.join(', ')}`,
  ].join('\n');
}
