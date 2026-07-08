import type {
  AnswerOption,
  IdentificationItem,
  IdentificationState,
} from '../types';

function buildOptions(itemId: string, texts: string[]): AnswerOption[] {
  return texts.map((text, index) => ({
    id: `${itemId}-opt-${index}`,
    text,
  }));
}

type RawQuestion = {
  question: string;
  imageAlt: string;
  image: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

/**
 * Soal Komik 1 — Candi Jawi, Pasuruan
 * Setiap soal memiliki gambar berbeda yang relevan dengan objek yang diamati.
 * Foto dari Wikimedia Commons (lisensi bebas / CC).
 */
const KOMIK_1_QUESTIONS: RawQuestion[] = [
  {
    question: 'Perhatikan bagian tubuh utama Candi Jawi ini. Bangun ruang apa yang paling tepat menggambarkan bentuknya?',
    imageAlt: 'Tubuh utama Candi Jawi tampak dari depan',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Candi_Jawi.jpg/800px-Candi_Jawi.jpg',
    options: ['Balok', 'Kerucut', 'Bola', 'Tabung'],
    correctIndex: 0,
    explanation: 'Tubuh utama candi berbentuk balok karena memiliki panjang, lebar, dan tinggi yang berbeda, dengan enam sisi berbentuk persegi panjang.',
  },
  {
    question: 'Amati susunan batu pada bagian kaki Candi Jawi ini. Bangun ruang apa yang paling mirip dengan setiap batu penyusunnya?',
    imageAlt: 'Susunan batu kaki Candi Jawi',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Candi_Jawi_base.jpg/800px-Candi_Jawi_base.jpg',
    options: ['Kubus', 'Limas', 'Kerucut', 'Prisma'],
    correctIndex: 0,
    explanation: 'Batu penyusun kaki candi berbentuk kubus karena semua sisinya sama panjang dan membentuk sudut siku-siku di setiap sudutnya.',
  },
  {
    question: 'Lihat bagian puncak Candi Jawi yang meruncing ini. Bangun ruang apa yang paling sesuai dengan bentuk puncaknya?',
    imageAlt: 'Puncak Candi Jawi yang meruncing',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Candi_Jawi.jpg/400px-Candi_Jawi.jpg',
    options: ['Kerucut', 'Kubus', 'Balok', 'Prisma segi empat'],
    correctIndex: 0,
    explanation: 'Puncak candi yang meruncing ke satu titik di atas dengan alas berbentuk lingkaran adalah ciri khas bangun ruang kerucut.',
  },
  {
    question: 'Perhatikan bagian atap bertingkat Candi Jawi ini. Bangun ruang apa yang paling tepat menggambarkan setiap tingkatan atapnya?',
    imageAlt: 'Atap bertingkat Candi Jawi',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Candi_Jawi.jpg/600px-Candi_Jawi.jpg',
    options: ['Limas segi empat', 'Tabung', 'Bola', 'Kubus'],
    correctIndex: 0,
    explanation: 'Setiap tingkatan atap candi berbentuk limas segi empat karena memiliki alas berbentuk persegi dan empat sisi segitiga yang bertemu di satu titik puncak.',
  },
  {
    question: 'Amati bagian dinding sisi Candi Jawi ini. Bangun ruang apa yang paling tepat menggambarkan bentuk keseluruhan dinding tersebut?',
    imageAlt: 'Dinding sisi Candi Jawi tampak samping',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Candi_Jawi.jpg/500px-Candi_Jawi.jpg',
    options: ['Prisma segi empat', 'Limas', 'Kerucut', 'Tabung'],
    correctIndex: 0,
    explanation: 'Dinding sisi candi yang memiliki dua alas sejajar berbentuk persegi panjang dan sisi-sisi tegak berbentuk persegi panjang adalah ciri khas prisma segi empat.',
  },
];

function getQuestionsForComic(
  comicId: number,
  lokasi: string,
  cover: string,
): RawQuestion[] {
  if (comicId === 1) return KOMIK_1_QUESTIONS;

  // Fallback untuk komik lain — gunakan cover sebagai placeholder
  return [
    {
      question: `Bangun ruang apa yang paling banyak kamu temukan saat mengamati ${lokasi}?`,
      imageAlt: `Gambar ${lokasi}`,
      image: cover,
      options: ['Balok', 'Kerucut', 'Limas', 'Prisma'],
      correctIndex: 0,
      explanation: 'Balok adalah bangun ruang yang paling umum ditemukan pada bangunan bersejarah.',
    },
    {
      question: `Bagian mana dari ${lokasi} yang paling mirip dengan bentuk kubus?`,
      imageAlt: `Gambar ${lokasi}`,
      image: cover,
      options: ['Susunan batu kaki bangunan', 'Atap yang meruncing', 'Puncak menara', 'Tangga masuk'],
      correctIndex: 0,
      explanation: 'Susunan batu pada kaki bangunan umumnya berbentuk kotak-kotak yang menyerupai kubus.',
    },
    {
      question: `Bangun ruang apa yang paling tepat menggambarkan puncak ${lokasi}?`,
      imageAlt: `Gambar ${lokasi}`,
      image: cover,
      options: ['Limas segi empat', 'Kubus', 'Balok', 'Tabung'],
      correctIndex: 0,
      explanation: 'Puncak bangunan yang meruncing ke satu titik dengan alas berbentuk persegi adalah ciri khas limas segi empat.',
    },
    {
      question: `Bagian dinding ${lokasi} paling mirip dengan bangun ruang apa?`,
      imageAlt: `Gambar ${lokasi}`,
      image: cover,
      options: ['Prisma segi empat', 'Kerucut', 'Bola', 'Limas'],
      correctIndex: 0,
      explanation: 'Dinding bangunan yang memiliki dua alas sejajar dan sisi-sisi tegak adalah ciri khas prisma segi empat.',
    },
    {
      question: `Bangun ruang apa yang paling tepat menggambarkan atap ${lokasi}?`,
      imageAlt: `Gambar ${lokasi}`,
      image: cover,
      options: ['Kerucut', 'Kubus', 'Balok', 'Prisma'],
      correctIndex: 0,
      explanation: 'Atap yang meruncing ke satu titik di atas dengan alas berbentuk lingkaran adalah ciri khas kerucut.',
    },
  ];
}

/**
 * Buat IdentificationState awal dari data komik.
 * Setiap soal memiliki gambar yang berbeda dan relevan dengan objek yang diamati.
 */
export function createIdentificationState(
  comicId: number,
  lokasi: string,
  _learningTargets: readonly string[],
  cover: string,
  title: string,
): IdentificationState {
  const questions = getQuestionsForComic(comicId, lokasi, cover);
  const items: IdentificationItem[] = questions.map((question, index) => {
    const id = `${comicId}-identification-${index}`;
    const options = buildOptions(id, question.options);
    return {
      id,
      targetIndex: index,
      targetText: question.question,
      question: question.question,
      image: question.image,
      imageAlt: question.imageAlt,
      options,
      correctOptionId: options[question.correctIndex]?.id ?? options[0].id,
      explanation: question.explanation,
      status: 'PENDING',
      selectedOptionId: null,
      note: '',
      answerStatus: 'UNANSWERED',
      reason: '',
      reasonStatus: 'EMPTY',
    };
  });

  return {
    comicId,
    lokasi,
    cover,
    title,
    observe: { note: '', isDone: false },
    items,
    observedCount: 0,
    isComplete: false,
  };
}

/**
 * Tandai satu item sebagai OBSERVED.
 * Idempoten — memanggil ulang pada item yang sudah OBSERVED tidak mengubah apapun.
 */
export function markItemObserved(
  state: IdentificationState,
  itemId: string
): IdentificationState {
  const alreadyObserved = state.items.find(
    (item) => item.id === itemId && item.status === 'OBSERVED'
  );
  if (alreadyObserved) return state;

  const updatedItems: IdentificationItem[] = state.items.map((item) =>
    item.id === itemId ? { ...item, status: 'OBSERVED' } : item
  );

  const observedCount = updatedItems.filter((item) => item.status === 'OBSERVED').length;

  return {
    ...state,
    items: updatedItems,
    observedCount,
    isComplete: observedCount === updatedItems.length,
  };
}

/** Update catatan observasi Step Amati. */
export function setObserveNote(
  state: IdentificationState,
  note: string,
): IdentificationState {
  return { ...state, observe: { ...state.observe, note } };
}

/** Selesaikan Step Amati — tandai isDone = true. */
export function completeObserve(
  state: IdentificationState,
): IdentificationState {
  return { ...state, observe: { ...state.observe, isDone: true } };
}

/** Pilih satu opsi jawaban untuk item tertentu — tandai selesai setelah memilih jawaban. */
export function selectAnswer(
  state: IdentificationState,
  itemId: string,
  optionId: string
): IdentificationState {
  const updatedItems: IdentificationItem[] = state.items.map((item) =>
    item.id === itemId
      ? {
          ...item,
          selectedOptionId: optionId,
          answerStatus: 'SAVED',
          status: 'OBSERVED',
        }
      : item
  );

  const observedCount = updatedItems.filter((item) => item.status === 'OBSERVED').length;

  return {
    ...state,
    items: updatedItems,
    observedCount,
    isComplete: updatedItems.every((item) => item.selectedOptionId !== null),
  };
}

/** Update teks catatan untuk item tertentu. */
export function updateNote(
  state: IdentificationState,
  itemId: string,
  note: string
): IdentificationState {
  return {
    ...state,
    items: state.items.map((item) =>
      item.id === itemId ? { ...item, note } : item
    ),
  };
}

/**
 * Simpan jawaban item — tandai sebagai SAVED.
 * Progress lanjut saat soal terjawab, bukan saat alasan diisi.
 */
export function saveAnswer(
  state: IdentificationState,
  itemId: string
): IdentificationState {
  const updatedItems: IdentificationItem[] = state.items.map((item) =>
    item.id === itemId
      ? { ...item, answerStatus: 'SAVED' }
      : item
  );

  return {
    ...state,
    items: updatedItems,
  };
}

/** Update teks alasan untuk item tertentu. */
export function updateReason(
  state: IdentificationState,
  itemId: string,
  reason: string,
): IdentificationState {
  return {
    ...state,
    items: state.items.map((item) =>
      item.id === itemId
        ? { ...item, reason, reasonStatus: reason.trim().length > 0 ? 'DRAFT' : 'EMPTY' }
        : item
    ),
  };
}

/** Simpan alasan item — opsional, tidak mengunci progres. */
export function saveReason(
  state: IdentificationState,
  itemId: string,
): IdentificationState {
  const updatedItems: IdentificationItem[] = state.items.map((item) =>
    item.id === itemId
      ? {
          ...item,
          status: item.selectedOptionId ? 'OBSERVED' : item.status,
          reasonStatus: item.reason.trim().length > 0 ? 'SAVED' : 'EMPTY',
        }
      : item
  );

  const observedCount = updatedItems.filter((item) => item.status === 'OBSERVED').length;
  const isComplete = updatedItems.every((item) => item.selectedOptionId !== null);

  return {
    ...state,
    items: updatedItems,
    observedCount,
    isComplete,
  };
}

/**
 * Reset semua item ke PENDING.
 */
export function resetIdentificationState(
  state: IdentificationState
): IdentificationState {
  return {
    ...state,
    observe: { note: '', isDone: false },
    items: state.items.map((item) => ({
      ...item,
      status: 'PENDING',
      selectedOptionId: null,
      note: '',
      answerStatus: 'UNANSWERED',
      reason: '',
      reasonStatus: 'EMPTY',
    })),
    observedCount: 0,
    isComplete: false,
  };
}
