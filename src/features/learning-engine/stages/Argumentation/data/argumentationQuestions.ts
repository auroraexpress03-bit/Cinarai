export interface ArgumentationQuestion {
  id: string;
  /** Bagian candi yang dimaksud, e.g. "atap", "tubuh", "kaki" */
  templePart: string;
  question: string;
  photoSrc: string;
  photoAlt: string;
  overlaySrc?: string;
  shapeName: string;
  /** 'balok' | 'kubus' | 'kerucut' | 'tabung' | 'limas' | 'prisma' */
  shapeKey: string;
  shapeSrc: string;
  highlightColor: string;
}

const ARGUMENTATION_QUESTIONS: Record<number, ArgumentationQuestion[]> = {
  2: [
    {
      id: 'komik2-arg-1',
      templePart: 'relief persegi',
      question: 'Mengapa pola persegi pada relief Candi Penataran dapat dikatakan memiliki simetri yang kuat?',
      photoSrc: '/assets/qr/komik-2/13-objek-1.jpeg',
      photoAlt: 'Relief Candi Penataran tampak berulang dalam pola persegi',
      shapeName: 'Persegi',
      shapeKey: 'persegi',
      shapeSrc: '/images/navigation/default.svg',
      highlightColor: 'border-primary-500',
    },
    {
      id: 'komik2-arg-2',
      templePart: 'bidang panjang',
      question: 'Mengapa bidang panjang pada arsitektur Candi Penataran cocok disebut persegi panjang?',
      photoSrc: '/assets/qr/komik-2/15-objek-2.jpeg',
      photoAlt: 'Bidang panjang pada Candi Penataran',
      shapeName: 'Persegi Panjang',
      shapeKey: 'persegi-panjang',
      shapeSrc: '/images/navigation/default.svg',
      highlightColor: 'border-secondary-500',
    },
    {
      id: 'komik2-arg-3',
      templePart: 'ornamen tajam',
      question: 'Mengapa bentuk ornamen tajam pada candi dapat dipahami sebagai segitiga?',
      photoSrc: '/assets/qr/komik-2/17-objek-3.jpeg',
      photoAlt: 'Ornamen tajam pada Candi Penataran',
      shapeName: 'Segitiga',
      shapeKey: 'segitiga',
      shapeSrc: '/images/navigation/default.svg',
      highlightColor: 'border-accent-500',
    },
    {
      id: 'komik2-arg-4',
      templePart: 'pola relief',
      question: 'Mengapa pola relief yang memiliki sepasang sisi sejajar dapat disebut trapesium?',
      photoSrc: '/assets/qr/komik-2/18-objek-4.jpeg',
      photoAlt: 'Pola relief Candi Penataran dengan sepasang sisi sejajar',
      shapeName: 'Trapesium',
      shapeKey: 'trapesium',
      shapeSrc: '/images/navigation/default.svg',
      highlightColor: 'border-warning-500',
    },
  ],
};

function buildFallbackQuestions(lokasi: string, cover: string): ArgumentationQuestion[] {
  return [
    {
      id: 'fallback-arg-1',
      templePart: 'bagian utama',
      question: `Mengapa bagian utama ${lokasi} dapat dimodelkan sebagai balok?`,
      photoSrc: cover,
      photoAlt: `Foto ${lokasi}`,
      shapeName: 'Balok',
      shapeKey: 'balok',
      shapeSrc: '/images/navigation/balok.svg',
      highlightColor: 'border-primary-500',
    },
    {
      id: 'fallback-arg-2',
      templePart: 'bagian puncak',
      question: `Mengapa bagian puncak ${lokasi} dapat dimodelkan sebagai kerucut?`,
      photoSrc: cover,
      photoAlt: `Foto ${lokasi}`,
      shapeName: 'Kerucut',
      shapeKey: 'kerucut',
      shapeSrc: '/images/navigation/kerucut.svg',
      highlightColor: 'border-accent-500',
    },
  ];
}

export function getArgumentationQuestions(
  comicId: number,
  lokasi: string,
  cover: string,
): ArgumentationQuestion[] {
  return ARGUMENTATION_QUESTIONS[comicId] ?? buildFallbackQuestions(lokasi, cover);
}
