import { getComicModule } from '@/features/comics';
import { getComic1QrAssetForObject } from '@/features/comics/comic-1/content/qrAssetRegistry';
import { getComic2QrAssetForObject } from '@/features/comics/comic-2/content/qrAssetRegistry';

export function resolveModelActionUrl(model?: {
  model3DUrl?: string;
  modelUrl?: string;
  embedUrl?: string;
}) {
  return model?.model3DUrl || model?.modelUrl || model?.embedUrl || '';
}

export function resolveNavigationStageContent(comicId: number) {
  // Guard khusus comic-2: gunakan paket konten dan asset yang disesuaikan dengan isi cerita Candi Penataran.
  // Comic-1 tetap memakai jalur resolver lama agar perilaku dan UI default tidak berubah.
  const comicModule = getComicModule(comicId);
  const learningObjects = Array.isArray(comicModule.navigation.learningObjects)
    ? comicModule.navigation.learningObjects
    : [];
  const modelEntries = Array.isArray(comicModule.navigation.model3D)
    ? comicModule.navigation.model3D
    : [];
  const objects = comicId === 2 ? learningObjects : learningObjects.slice(0, 5);

  const heroModelEntry = comicId === 2
    ? modelEntries[0]
      ?? modelEntries.find((entry) => entry.title === comicModule.metadata.title)
      ?? learningObjects[0]
    : modelEntries.find((entry) => entry.title === 'Persegi' || entry.title === 'Candi Jawi' || entry.title === comicModule.metadata.title)
      ?? modelEntries[0]
      ?? learningObjects[0];

  const fallbackTitle = comicId === 2 ? 'Umpang' : 'Candi Jawi';
  const heroQrImage = comicId === 2
    ? getComic2QrAssetForObject(heroModelEntry?.title ?? fallbackTitle)
    : getComic1QrAssetForObject(heroModelEntry?.title ?? fallbackTitle);

  const heroIllustration = comicId === 2
    ? learningObjects.find((object) => object.title === heroModelEntry?.title)?.navImage
      ?? learningObjects.find((object) => object.title === heroModelEntry?.title)?.objectImage
      ?? learningObjects[0]?.navImage
      ?? learningObjects[0]?.objectImage
      ?? ''
    : '';

  return {
    comicModule,
    objects,
    heroModelEntry,
    heroQrImage,
    heroIllustration,
  };
}

export function resolveObjectDetailContent(comicId: number, objectId: string) {
  const comicModule = getComicModule(comicId);
  const learningObjects = Array.isArray(comicModule.navigation.learningObjects)
    ? comicModule.navigation.learningObjects
    : [];
  const object = learningObjects.find((item) => item.id === objectId);
  const qrImage = comicId === 2
    ? getComic2QrAssetForObject(object?.title ?? '')
    : getComic1QrAssetForObject(object?.title ?? '');

  return {
    comicModule,
    object,
    qrImage,
  };
}
