import { getComic1IdentificationAssetForObject } from '@/features/comics/comic-1/content/identificationAssetRegistry';

const COMIC2_ICON_MAP: Record<string, string> = {
  persegi: '/images/identification/comic-2/persegi.svg',
  'persegi panjang': '/images/identification/comic-2/persegi-panjang.svg',
  'segitiga sama sisi': '/images/identification/comic-2/segitiga-sama-sisi.svg',
  'segitiga sama kaki': '/images/identification/comic-2/segitiga-sama-kaki.svg',
  lingkaran: '/images/identification/comic-2/lingkaran.svg',
  'belah ketupat': '/images/identification/comic-2/belah-ketupat.svg',
};

const COMIC3_ICON_MAP: Record<string, string> = {
  persegi: '/images/identification/comic-3/persegi.svg',
  segitiga: '/images/identification/comic-3/segitiga.svg',
  lingkaran: '/images/identification/comic-3/lingkaran.svg',
  'belah ketupat': '/images/identification/comic-3/belah-ketupat.svg',
};

const COMIC4_ICON_MAP: Record<string, string> = {
  persegi: '/images/identification/comic-4/persegi.svg',
  segitiga: '/images/identification/comic-4/segitiga.svg',
  lingkaran: '/images/identification/comic-4/lingkaran.svg',
};

const COMIC5_ICON_MAP: Record<string, string> = {
  lingkaran: '/images/identification/comic-5/lingkaran.svg',
  persegi: '/images/identification/comic-5/persegi.svg',
  segitiga: '/images/identification/comic-5/segitiga.svg',
};

export function resolveIdentificationOptionAsset(comicId: number, label: string, fallbackSrc: string): string {
  const normalizedLabel = label.trim().toLowerCase();

  if (comicId === 1) {
    const asset = getComic1IdentificationAssetForObject(label);
    if (asset) return asset;
  }

  if (comicId === 2) {
    return COMIC2_ICON_MAP[normalizedLabel] ?? fallbackSrc;
  }

  if (comicId === 3) {
    return COMIC3_ICON_MAP[normalizedLabel] ?? fallbackSrc;
  }

  if (comicId === 4) {
    return COMIC4_ICON_MAP[normalizedLabel] ?? fallbackSrc;
  }

  if (comicId === 5) {
    return COMIC5_ICON_MAP[normalizedLabel] ?? fallbackSrc;
  }

  return fallbackSrc;
}
