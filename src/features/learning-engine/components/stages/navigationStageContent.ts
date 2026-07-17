import { getComicModule } from '@/features/comics';
import { getComic1QrAssetForObject } from '@/features/comics/comic-1/content/qrAssetRegistry';
import { getComic2QrAssetForObject } from '@/features/comics/comic-2/content/qrAssetRegistry';

export function resolveNavigationStageContent(comicId: number) {
  // Guard khusus comic-2: gunakan paket konten dan asset yang disesuaikan dengan isi cerita Candi Penataran.
  // Comic-1 tetap memakai jalur resolver lama agar perilaku dan UI default tidak berubah.
  const comicModule = getComicModule(comicId);
  const objects = comicId === 2
    ? comicModule.navigation.learningObjects
    : comicModule.navigation.learningObjects.slice(0, 5);
  const heroModelEntry = comicId === 2
    ? comicModule.navigation.model3D[0] ?? comicModule.navigation.model3D.find((entry) => entry.title === comicModule.metadata.title)
    : comicModule.navigation.model3D.find((entry) => entry.title === 'Persegi' || entry.title === 'Candi Jawi' || entry.title === comicModule.metadata.title);
  const heroQrImage = comicId === 2
    ? getComic2QrAssetForObject(heroModelEntry?.title ?? 'Umpang')
    : getComic1QrAssetForObject(heroModelEntry?.title ?? 'Candi Jawi');

  return {
    comicModule,
    objects,
    heroModelEntry,
    heroQrImage,
  };
}

export function resolveObjectDetailContent(comicId: number, objectId: string) {
  const comicModule = getComicModule(comicId);
  const object = comicModule.navigation.learningObjects.find((item) => item.id === objectId);
  const qrImage = comicId === 2
    ? getComic2QrAssetForObject(object?.title ?? '')
    : getComic1QrAssetForObject(object?.title ?? '');

  return {
    comicModule,
    object,
    qrImage,
  };
}
