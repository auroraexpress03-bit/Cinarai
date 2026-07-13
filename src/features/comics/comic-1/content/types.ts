import type { ComicContentPackageLike } from '../../types';
import type { ArgumentationQuestion } from '@/features/learning-engine/stages/Argumentation/data/argumentationQuestions';

export interface Comic1ArgumentationQuestion extends ArgumentationQuestion {
  argumentationPhoto: string;
  argumentationHighlight: string;
  argumentationPrompt: string;
  argumentationQuestion: string;
  argumentationTitle: string;
}

export interface Comic1PackageContent extends ComicContentPackageLike {
  argumentation: {
    questions: Comic1ArgumentationQuestion[];
  };
}
