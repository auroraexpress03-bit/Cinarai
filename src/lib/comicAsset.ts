export interface ComicQrMetadata {
  id: string;
  target: string;
  label?: string;
  description?: string;
}

export interface ComicStageMetadata {
  stage: string;
  title?: string;
  description?: string;
}

export interface ComicPageAsset {
  id: string;
  pageNumber: number;
  imageSrc: string;
  alt?: string;
}

export interface ComicAsset {
  id: number;
  slug?: string;
  title?: string;
  sourcePdfPath: string | null;
  pages: ComicPageAsset[];
  pageCount: number;
  thumbnail: string | null;
  qrMetadata?: ComicQrMetadata[];
  stageMetadata?: ComicStageMetadata[];
}

export interface CreateComicAssetInput {
  id: number;
  slug?: string;
  title?: string;
  sourcePdfPath: string | null;
  thumbnail?: string | null;
  qrMetadata?: ComicQrMetadata[];
  stageMetadata?: ComicStageMetadata[];
  pages?: ComicPageAsset[];
}

export function createComicAssetSkeleton(input: CreateComicAssetInput): ComicAsset {
  return {
    id: input.id,
    slug: input.slug,
    title: input.title,
    sourcePdfPath: input.sourcePdfPath,
    pages: input.pages ?? [],
    pageCount: input.pages?.length ?? 0,
    thumbnail: input.thumbnail ?? null,
    qrMetadata: input.qrMetadata ?? [],
    stageMetadata: input.stageMetadata ?? [],
  };
}

export function buildComicAssetFromComic(comic: {
  id: number;
  slug?: string;
  title?: string;
  pdfPath: string | null;
  thumbnail?: string | null;
}): ComicAsset {
  return createComicAssetSkeleton({
    id: comic.id,
    slug: comic.slug,
    title: comic.title,
    sourcePdfPath: comic.pdfPath,
    thumbnail: comic.thumbnail ?? null,
  });
}

export function hydrateComicAssetPages(asset: ComicAsset, pages: ComicPageAsset[]): ComicAsset {
  return {
    ...asset,
    pages,
    pageCount: pages.length,
  };
}
