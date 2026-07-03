export type Comic = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  kelas: string;
  lokasi: string;
  pdfPath: string;
  cover: string;
  thumbnail: string;
  locked: boolean;
  progress: number;
};

const BASE = "/comics";

export const comics: Comic[] = [
  {
    id: 1,
    slug: "komik-1",
    title: "Petualangan Bangun Ruang Candi Jawi",
    subtitle: "Mengenal Bangun Ruang",
    kelas: "VI",
    lokasi: "Candi Jawi",
    pdfPath: `${BASE}/komik-1/comic.pdf`,
    cover: `${BASE}/komik-1/cover.png`,
    thumbnail: `${BASE}/komik-1/thumbnail.png`,
    locked: false,
    progress: 0,
  },
  {
    id: 2,
    slug: "komik-2",
    title: "Petualangan Simetri Candi Penataran",
    subtitle: "Mengenal Simetri",
    kelas: "V",
    lokasi: "Candi Penataran",
    pdfPath: `${BASE}/komik-2/comic.pdf`,
    cover: `${BASE}/komik-2/cover.png`,
    thumbnail: `${BASE}/komik-2/thumbnail.png`,
    locked: true,
    progress: 0,
  },
  {
    id: 3,
    slug: "komik-3",
    title: "Petualangan di Rumah Gajah Mungkur",
    subtitle: "Mengenal Bilangan",
    kelas: "II",
    lokasi: "Gajah Mungkur",
    pdfPath: `${BASE}/komik-3/comic.pdf`,
    cover: `${BASE}/komik-3/cover.png`,
    thumbnail: `${BASE}/komik-3/thumbnail.png`,
    locked: true,
    progress: 0,
  },
  {
    id: 4,
    slug: "komik-4",
    title: "Petualangan di Jembatan Merah",
    subtitle: "Mengenal Pengukuran",
    kelas: "IV",
    lokasi: "Jembatan Merah",
    pdfPath: `${BASE}/komik-4/comic.pdf`,
    cover: `${BASE}/komik-4/cover.png`,
    thumbnail: `${BASE}/komik-4/thumbnail.png`,
    locked: true,
    progress: 0,
  },
  {
    id: 5,
    slug: "komik-5",
    title: "Serunya Belajar Bangun Datar di Keraton Sumenep",
    subtitle: "Mengenal Bangun Datar",
    kelas: "II",
    lokasi: "Keraton Sumenep",
    pdfPath: `${BASE}/komik-5/comic.pdf`,
    cover: `${BASE}/komik-5/cover.png`,
    thumbnail: `${BASE}/komik-5/thumbnail.png`,
    locked: true,
    progress: 0,
  },
];
