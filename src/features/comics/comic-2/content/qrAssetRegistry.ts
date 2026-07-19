import { packageContent } from '@/features/comics/comic-2/content/packageContent';

export function getComic2QrAssetForObject(objectId: string): string | undefined {
  if (!objectId) {
    return undefined;
  }

  const object = packageContent.learningObjects.find((item) => item.id === objectId);
  return object?.qrImage;
}
