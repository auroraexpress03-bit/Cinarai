import type { ComicContentPackageLike } from '../../types';

export type Comic1ArgumentationQuestion = ComicContentPackageLike['argumentation']['questions'][number] & {
  argumentationPhoto: string;
  argumentationHighlight: string;
  argumentationPrompt: string;
  argumentationQuestion: string;
  argumentationTitle: string;
};

export interface Comic1PackageContent extends ComicContentPackageLike {
  argumentation: {
    questions: Comic1ArgumentationQuestion[];
  };
}
