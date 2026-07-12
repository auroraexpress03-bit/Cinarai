import type {
  LearningContentPackage,
  LearningObjectContent,
} from '@/features/learning-engine/content/contentPackages';

export interface ComicModule {
  comicId: number;
  metadata: LearningContentPackage['metadata'];
  cover: string;
  contextualization: {
    pdfPath: string | null;
    asset?: unknown;
  };
  identification: LearningContentPackage['identification'];
  navigation: {
    learningObjects: LearningObjectContent[];
    model3D: LearningContentPackage['model3D'];
    qrCode: LearningContentPackage['qrCode'];
    aiPrompt: string;
  };
  argumentation: LearningContentPackage['argumentation'];
  resolution: LearningContentPackage['resolution'];
  application: LearningContentPackage['application'];
  introspection: LearningContentPackage['introspection'];
  report: LearningContentPackage['report'];
  ai: LearningContentPackage['aiPrompt'];
  qr: LearningContentPackage['qrCode'];
  assets: {
    thumbnail: string;
  };
  objects: LearningObjectContent[];
  progressConfig?: Record<string, unknown>;
  packageContent: LearningContentPackage;
}
