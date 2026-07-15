'use client';

import { serverTimestamp } from 'firebase/firestore';
import { mergeFirestoreDocument } from '@/services/firestore';

export interface ReflectionSaveInput {
  userId: string;
  comicId: number;
  checklist: string[];
  confidence: number | null;
  reflectionText: string;
  stage: string;
  rating?: number | null;
  aiReflection?: { appreciation: string; needsImprovement: string; suggestion: string } | string | null;
  response?: string;
  status?: string;
}

export interface ReflectionDocumentPayload {
  userId: string;
  studentId: string;
  moduleId: string;
  comicId: string;
  checklist: string[];
  selectedChecklist: string[];
  confidence: number | null;
  rating: number | null;
  reflectionText: string;
  stage: string;
  status: string;
  timestamp: ReturnType<typeof serverTimestamp>;
  createdAt: ReturnType<typeof serverTimestamp>;
  submittedAt: ReturnType<typeof serverTimestamp>;
  aiReflection?: { appreciation: string; needsImprovement: string; suggestion: string } | string;
  response?: string;
}

export function buildReflectionDocumentPayload(input: ReflectionSaveInput): ReflectionDocumentPayload {
  const payload: ReflectionDocumentPayload = {
    userId: input.userId,
    studentId: input.userId,
    moduleId: String(input.comicId),
    comicId: String(input.comicId),
    checklist: input.checklist,
    selectedChecklist: input.checklist,
    confidence: input.confidence,
    rating: input.rating ?? input.confidence ?? null,
    reflectionText: input.reflectionText.trim(),
    stage: input.stage,
    status: input.status ?? 'completed',
    timestamp: serverTimestamp(),
    createdAt: serverTimestamp(),
    submittedAt: serverTimestamp(),
  };

  if (input.aiReflection !== undefined && input.aiReflection !== null) {
    payload.aiReflection = input.aiReflection;
  }

  if (input.response) {
    payload.response = input.response;
  }

  return payload;
}

export async function saveReflectionDocument(input: ReflectionSaveInput): Promise<void> {
  const docId = `${input.userId}_${input.comicId}_introspection`;
  const payload = buildReflectionDocumentPayload(input);
  await mergeFirestoreDocument('reflection', docId, payload);
}
