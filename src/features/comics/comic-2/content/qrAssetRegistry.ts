const qrAssets: Record<string, string> = {
  Umpang: '/assets/qr/komik-2/15-objek-2.jpeg',
  'Bale Agung': '/assets/qr/komik-2/13-objek-1.jpeg',
  'Candi Angka': '/assets/qr/komik-2/17-objek-3.jpeg',
  Mensir: '/assets/qr/komik-2/13-objek-1.jpeg',
  'Relief Lingkaran': '/assets/qr/komik-2/18-objek-4.jpeg',
  'Ornamen Belah Ketupat': '/assets/qr/komik-2/17-objek-3.jpeg',
  Persegi: '/assets/qr/komik-2/13-objek-1.jpeg',
  'Persegi Panjang': '/assets/qr/komik-2/15-objek-2.jpeg',
  Segitiga: '/assets/qr/komik-2/17-objek-3.jpeg',
  'Belah Ketupat': '/assets/qr/komik-2/18-objek-4.jpeg',
};

function normalizeObjectTitle(value: string): string {
  return value.trim().toLowerCase();
}

export function getComic2QrAssetForObject(objectTitle: string): string | undefined {
  const normalizedTitle = normalizeObjectTitle(objectTitle);
  if (!normalizedTitle) {
    return undefined;
  }

  const exactMatch = qrAssets[objectTitle];
  if (exactMatch) {
    return exactMatch;
  }

  const fallbackMatch = Object.entries(qrAssets).find(([title]) => normalizeObjectTitle(title) === normalizedTitle);
  return fallbackMatch?.[1];
}
