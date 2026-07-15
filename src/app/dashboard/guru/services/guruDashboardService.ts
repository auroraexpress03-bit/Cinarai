import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/client';
import { getAllComics } from '@/lib/comicRepository';
import type { ActivityDocument, ComicProgressDocument, ReflectionDocument, UserDocument } from '@/types/firestore';
import {
  buildClassroomSummary,
  buildComicProgressSummary,
  buildCompletionStatusSummary,
  buildRecentActivities,
  buildStageProgressSummary,
  buildValueDistribution,
  type ClassroomSummary,
  type ComicProgressSummary,
  type CompletionStatusSummary,
  type RecentActivitySummary,
  type StageProgressSummary,
  type ValueBucketSummary,
} from '../helpers/guruDashboardData';

export interface GuruDashboardData {
  summary: ClassroomSummary | null;
  comicProgress: ComicProgressSummary[];
  stageProgress: StageProgressSummary[];
  valueDistribution: ValueBucketSummary[];
  completionStatuses: CompletionStatusSummary[];
  recentActivities: RecentActivitySummary[];
}

export async function fetchGuruDashboardData(): Promise<GuruDashboardData> {
  const [usersSnapshot, reflectionsSnapshot, activitySnapshot] = await Promise.all([
    getDocs(collection(firestore, 'users')),
    getDocs(collection(firestore, 'reflection')),
    getDocs(collection(firestore, 'activity')),
  ]);

  const users = usersSnapshot.docs.map((documentSnapshot) => ({
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  } as UserDocument));

  const studentUsers = users.filter((entry) => entry.role === 'student').sort((left, right) => {
    const leftName = left.displayName?.trim() || left.email || '';
    const rightName = right.displayName?.trim() || right.email || '';
    return leftName.localeCompare(rightName);
  });

  const progressByStudent = new Map<string, ComicProgressDocument[]>();
  const reflectionsByStudent = new Map<string, ReflectionDocument[]>();
  const usersById = new Map(users.map((entry) => [entry.uid, entry]));

  for (const student of studentUsers) {
    const studentProgressSnapshot = await getDocs(collection(firestore, 'users', student.uid, 'progress'));
    progressByStudent.set(
      student.uid,
      studentProgressSnapshot.docs.map((documentSnapshot) => ({
        id: documentSnapshot.id,
        ...documentSnapshot.data(),
      } as ComicProgressDocument))
    );
  }

  const reflections = reflectionsSnapshot.docs.map((documentSnapshot) => ({
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  } as ReflectionDocument));

  for (const reflection of reflections) {
    const studentId = reflection.userId ?? reflection.studentId;
    if (!studentId) continue;
    const existing = reflectionsByStudent.get(studentId) ?? [];
    existing.push(reflection);
    reflectionsByStudent.set(studentId, existing);
  }

  const activityDocuments = activitySnapshot.docs.map((documentSnapshot) => ({
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  } as ActivityDocument));

  const comics = getAllComics();
  const comicIds = comics.map((comic) => comic.id);

  return {
    summary: buildClassroomSummary(users, progressByStudent, comicIds.length),
    comicProgress: buildComicProgressSummary(progressByStudent, comicIds),
    stageProgress: buildStageProgressSummary(progressByStudent),
    valueDistribution: buildValueDistribution(users, progressByStudent, reflectionsByStudent),
    completionStatuses: buildCompletionStatusSummary(progressByStudent),
    recentActivities: buildRecentActivities(activityDocuments, usersById),
  };
}
