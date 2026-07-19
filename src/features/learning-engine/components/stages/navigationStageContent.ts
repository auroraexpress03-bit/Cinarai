import { getComicModule } from '@/features/comics';
import { getComic1QrAssetForObject } from '@/features/comics/comic-1/content/qrAssetRegistry';
import { packageContent as comic2PackageContent } from '@/features/comics/comic-2/content/packageContent';

export function resolveModelActionUrl(model?: {
  model3DUrl?: string;
  modelUrl?: string;
  embedUrl?: string;
}) {
  return model?.model3DUrl || model?.modelUrl || model?.embedUrl || '';
}

function resolveComic2AssetBundle(objectId: string) {
  const selectedObject = comic2PackageContent.learningObjects.find((item) => item.id === objectId);
  const qrEntry = comic2PackageContent.qrCode.find((item) => item.id === objectId);
  const modelEntry = comic2PackageContent.model3D.find((item) => item.id === objectId);

  if (process.env.NODE_ENV !== 'production') {
    if (!selectedObject || !qrEntry || !modelEntry) {
      console.error('[Comic2Navigation] asset bundle mismatch', { objectId, selectedObject: selectedObject?.id ?? null, qrEntry: qrEntry?.id ?? null, modelEntry: modelEntry?.id ?? null });
    }

    if (selectedObject?.id !== qrEntry?.id || qrEntry?.id !== modelEntry?.id) {
      console.error('[Comic2Navigation] selectedObject.id !== qr.id !== model.id', {
        objectId,
        selectedObjectId: selectedObject?.id ?? null,
        qrId: qrEntry?.id ?? null,
        modelId: modelEntry?.id ?? null,
      });
    }
  }

  return {
    selectedObject,
    qrEntry,
    modelEntry,
  };
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

  if (comicId === 2) {
    const heroObject = learningObjects[0];

    return {
      comicModule,
      objects,
      heroModelEntry: heroObject,
      heroQrImage: heroObject?.qrImage ?? '',
      heroIllustration: heroObject?.navImage ?? heroObject?.objectImage ?? '',
    };
  }

  const heroModelEntry = modelEntries.find((entry) => entry.title === 'Persegi' || entry.title === 'Candi Jawi' || entry.title === comicModule.metadata.title)
    ?? modelEntries[0]
    ?? learningObjects[0];

  const fallbackTitle = 'Candi Jawi';
  const heroQrImage = getComic1QrAssetForObject(heroModelEntry?.title ?? fallbackTitle) ?? '';
  const heroIllustration = '';

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

  let qrImage = '';

  if (comicId === 2) {
    const { selectedObject, qrEntry, modelEntry } = resolveComic2AssetBundle(objectId);
    qrImage = selectedObject?.qrImage ?? qrEntry?.imageSrc ?? '';

    if (process.env.NODE_ENV !== 'production' && selectedObject?.id !== qrEntry?.id) {
      console.error('[Comic2Navigation] QR asset does not match selected object', {
        selectedObjectId: selectedObject?.id ?? null,
        qrId: qrEntry?.id ?? null,
        modelId: modelEntry?.id ?? null,
      });
    }
  } else {
    qrImage = getComic1QrAssetForObject(object?.title ?? '') ?? '';
  }

  return {
    comicModule,
    object,
    qrImage,
  };
}
