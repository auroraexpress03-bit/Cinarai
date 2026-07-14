import qrCandiJawi from '@/features/comics/comic-1/assets/qr/candi-jawi.png';
import qrKubus from '@/features/comics/comic-1/assets/qr/kubus.png';
import qrBalok from '@/features/comics/comic-1/assets/qr/balok.png';
import qrPrisma from '@/features/comics/comic-1/assets/qr/prisma-segi-empat.png';
import qrLimas from '@/features/comics/comic-1/assets/qr/limas-segi-empat.png';
import qrKerucut from '@/features/comics/comic-1/assets/qr/kerucut.png';

const qrAssetsByTitle: Record<string, string | undefined> = {
  'Candi Jawi': qrCandiJawi.src,
  Kubus: qrKubus.src,
  Balok: qrBalok.src,
  Prisma: qrPrisma.src,
  'Prisma Segi Empat': qrPrisma.src,
  Limas: qrLimas.src,
  'Limas Segi Empat': qrLimas.src,
  Kerucut: qrKerucut.src,
};

export function getComic1QrAssetForObject(objectTitle: string): string | undefined {
  const normalizedTitle = objectTitle.trim().toLowerCase();

  if (!normalizedTitle) {
    return undefined;
  }

  const exactMatch = Object.entries(qrAssetsByTitle).find(([title]) => title.toLowerCase() === normalizedTitle);
  if (exactMatch) {
    return exactMatch[1];
  }

  for (const [title, assetPath] of Object.entries(qrAssetsByTitle)) {
    if (title.toLowerCase() !== 'candi jawi' && normalizedTitle.includes(title.toLowerCase())) {
      return assetPath;
    }
  }

  return undefined;
}
