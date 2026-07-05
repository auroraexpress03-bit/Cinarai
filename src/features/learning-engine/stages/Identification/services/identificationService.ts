import type {
  AnswerOption,
  IdentificationItem,
  IdentificationState,
} from '../types';

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function buildOptions(itemId: string, texts: string[]): AnswerOption[] {
  return texts.map((text, index) => ({
    id: `${itemId}-opt-${index}`,
    text,
  }));
}

function buildStoryQuestions(
  comicId: number,
  lokasi: string,
  learningTargets: readonly string[],
  title: string
): Array<{ question: string; options: string[] }> {
  const conceptHints = learningTargets.slice(0, 4).join(' • ');

  const baseQuestions = [
    {
      question: `Di bagian mana tokoh menemukan bentuk yang paling dekat dengan kubus saat mengamati ${title} di ${lokasi}?`,
      options: [
        'Pada susunan batu bagian kaki bangunan',
        'Pada atap yang melengkung',
        'Pada pepohonan di sekitar area',
        'Pada tangga yang menuju pintu masuk',
      ],
    },
    {
      question: `Tokoh menyebut bangun ruang apa ketika mengamati bagian penyangga utama dari ${title}?`,
      options: [
        'Balok',
        'Kerucut',
        'Lingkaran',
        'Trapesium',
      ],
    },
    {
      question: `Bagian mana dari cerita yang membantu tokoh memahami bentuk prisma saat mengamati ${lokasi}?`,
      options: [
        'Bagian dinding yang tersusun berjejer',
        'Bagian langit-langit yang membentuk puncak',
        'Bagian pohon di halaman',
        'Bagian jalan yang melingkar',
      ],
    },
    {
      question: `Mengapa bagian yang diamati bisa disebut limas menurut tokoh dalam ${title}?`,
      options: [
        'Karena bentuknya bertumpu pada satu titik puncak',
        'Karena bentuknya selalu membulat',
        'Karena tidak memiliki sisi',
        'Karena terbuat dari kaca',
      ],
    },
    {
      question: `Objek apa yang tokoh amati saat menemukan bentuk kerucut pada ${lokasi}?`,
      options: [
        'Bagian atap yang meruncing',
        'Bagian lantai yang rata',
        'Bagian pagar yang panjang',
        'Bagian pohon yang menjulang',
      ],
    },
    {
      question: `Apa alasan tokoh menyebut bagian tersebut sebagai bangun ruang yang berbeda dari kubus?`,
      options: [
        'Karena sisi-sisinya tidak sama panjang dan bentuknya lebih panjang',
        'Karena warnanya lebih gelap',
        'Karena memiliki lebih banyak daun',
        'Karena hanya terlihat dari jauh',
      ],
    },
    {
      question: `Bangun ruang apa yang paling banyak membantu tokoh memahami bentuk arsitektur di ${title}?`,
      options: [
        'Balok',
        'Kerucut',
        'Lingkaran',
        'Segitiga',
      ],
    },
    {
      question: `Saat membaca ulang cerita, informasi apa yang paling penting untuk menjawab soal tentang ${conceptHints}?`,
      options: [
        'Ciri bentuk dan bagian objek yang diamati',
        'Nama tokoh yang paling sering muncul',
        'Warna pakaian tokoh',
        'Jumlah langkah menuju pintu masuk',
      ],
    },
  ];

  if (comicId === 2) {
    baseQuestions[0].question = `Di bagian mana tokoh menemukan pola simetri saat mengamati ${title} di ${lokasi}?`;
    baseQuestions[0].options = [
      'Pada relief yang terbagi dua secara seimbang',
      'Pada jalan keluar yang tidak rata',
      'Pada pohon yang tumbuh acak',
      'Pada air yang mengalir',
    ];
  }

  if (comicId === 3) {
    baseQuestions[0].question = `Di bagian mana tokoh menemukan bentuk datar yang paling mudah diamati di ${title}?`;
    baseQuestions[0].options = [
      'Pada sisi dinding dan pola lantai',
      'Pada awan di langit',
      'Pada gerakan tumbuhan',
      'Pada suara tokoh',
    ];
    baseQuestions[1].question = `Bangun apa yang paling membantu tokoh mengidentifikasi bentuk pada rumah bersejarah di ${lokasi}?`;
    baseQuestions[1].options = [
      'Persegi dan persegi panjang',
      'Bola dan lingkaran',
      'Segitiga dan elips',
      'Garis dan titik',
    ];
  }

  return shuffle(baseQuestions).slice(0, 8);
}

/**
 * Buat IdentificationState awal dari data komik.
 * Soal dibuat dari isi cerita agar siswa perlu membaca ulang komik.
 */
export function createIdentificationState(
  comicId: number,
  lokasi: string,
  learningTargets: readonly string[],
  cover: string,
  title: string,
): IdentificationState {
  const questions = buildStoryQuestions(comicId, lokasi, learningTargets, title);
  const items: IdentificationItem[] = questions.map((question, index) => {
    const id = `${comicId}-identification-${index}`;
    return {
      id,
      targetIndex: index,
      targetText: question.question,
      question: question.question,
      options: buildOptions(id, question.options),
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
