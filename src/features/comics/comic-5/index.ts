import { getLearningContentPackage } from '@/features/learning-engine/content/contentPackages';
import type { ComicModule } from '../types';

const packageContent = getLearningContentPackage(5);

const Comic5Module: ComicModule = {
  comicId: 5,
  metadata: packageContent.metadata,
  cover: packageContent.metadata.cover,
  contextualization: {
    pdfPath: null,
  },
  identification: packageContent.identification,
  navigation: {
    learningObjects: packageContent.learningObjects,
    model3D: packageContent.model3D,
    qrCode: packageContent.qrCode,
    aiPrompt: packageContent.aiPrompt.navigation,
  },
  argumentation: packageContent.argumentation,
  resolution: packageContent.resolution,
  application: packageContent.application,
  introspection: packageContent.introspection,
  report: packageContent.report,
  ai: packageContent.aiPrompt,
  qr: packageContent.qrCode,
  assets: {
    thumbnail: packageContent.metadata.thumbnail,
  },
  objects: packageContent.learningObjects,
  progressConfig: {},
  packageContent,
};

export default Comic5Module;
