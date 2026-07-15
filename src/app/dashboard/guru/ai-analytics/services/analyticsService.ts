import {
  queryFirestoreCollection,
  getFirestoreCollection,
} from '@/services/firestore';
import type {
  ProgressDocument,
  ReflectionDocument,
  ActivityDocument,
  IdentificationAnswerDocument,
  UserDocument,
} from '@/types/firestore';

export const getStudentProgress = async (userId: string): Promise<ProgressDocument[]> => {
  return queryFirestoreCollection('progress', { filters: [{ field: 'userId', operator: '==', value: userId }] }) as Promise<ProgressDocument[]>;
};

export const getUsers = async (): Promise<UserDocument[]> => {
  return getFirestoreCollection('users') as Promise<UserDocument[]>;
};

export const getReflectionsForStudent = async (studentId: string): Promise<ReflectionDocument[]> => {
  const byUser = await queryFirestoreCollection('reflection', { filters: [{ field: 'userId', operator: '==', value: studentId }] }) as ReflectionDocument[];
  const byStudent = await queryFirestoreCollection('reflection', { filters: [{ field: 'studentId', operator: '==', value: studentId }] }) as ReflectionDocument[];
  const map = new Map<string, ReflectionDocument>();
  [...byUser, ...byStudent].forEach((r) => { if (r && r.id) map.set(r.id, r); });
  return Array.from(map.values());
};

export const getRecentActivities = async (limitCount = 200): Promise<ActivityDocument[]> => {
  return queryFirestoreCollection('activity', { orderByField: 'occurredAt', orderDirection: 'desc', limitCount }) as Promise<ActivityDocument[]>;
};

export const getAiTutorUsage = async (): Promise<IdentificationAnswerDocument[]> => {
  return queryFirestoreCollection('identification_answers', { filters: [{ field: 'aiTutorUsed', operator: '==', value: true }] }) as Promise<IdentificationAnswerDocument[]>;
};
