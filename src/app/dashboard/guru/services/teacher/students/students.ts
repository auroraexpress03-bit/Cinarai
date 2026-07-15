import type { ComicProgressDocument, UserDocument } from '@/types/firestore';

export type StudentStatus = 'Aktif' | 'Sedang Belajar' | 'Belum Memulai' | 'Selesai';

export type StudentDirectoryRow = {
  id: string;
  avatar: string;
  name: string;
  grade: string;
  email: string;
  progress: number;
  lastModule: string;
  lastScore: number;
  lastActivity: string;
  status: StudentStatus;
  isActive: boolean;
  isCompleted: boolean;
  completedModules: number;
  totalModules: number;
};

function formatLastActivity(value?: string): string {
  if (!value) return 'Belum ada aktivitas';
  return value;
}

function getStudentStatus(progress: number, isActive: boolean): StudentStatus {
  if (!isActive) return 'Belum Memulai';
  if (progress >= 100) return 'Selesai';
  if (progress > 0) return 'Sedang Belajar';
  return 'Aktif';
}

export function buildStudentDirectoryRows(
  users: UserDocument[],
  progressDocuments: ComicProgressDocument[]
): StudentDirectoryRow[] {
  const progressByUser = new Map<string, ComicProgressDocument[]>();

  for (const document of progressDocuments) {
    const entry = progressByUser.get(document.id ?? 'unknown') ?? [];
    entry.push(document);
    progressByUser.set(document.id ?? 'unknown', entry);
  }

  return users
    .filter((user) => user.role === 'student')
    .map((user) => {
      const studentProgress = progressDocuments.filter((document) => document.id?.startsWith(user.uid));
      const progress = studentProgress.length
        ? Math.round(
            studentProgress.reduce((sum, document) => sum + (document.percentage ?? 0), 0) /
              studentProgress.length
          )
        : 0;
      const completedModules = studentProgress.filter((document) => document.status === 'completed').length;
      const totalModules = Math.max(1, studentProgress.length || 1);
      const lastModule = studentProgress.at(-1)?.completedStage ?? 'Belum ada modul';
      const lastScore = studentProgress.at(-1)?.percentage ?? 0;

      return {
        id: user.uid,
        avatar: user.displayName?.charAt(0) ?? user.email.charAt(0).toUpperCase(),
        name: user.displayName?.trim() || user.email.split('@')[0],
        grade: user.gradeLevel ? `Kelas ${user.gradeLevel}` : 'Belum ada kelas',
        email: user.email,
        progress,
        lastModule,
        lastScore,
        lastActivity: formatLastActivity(user.lastLoginAt?.toDate?.().toLocaleDateString('id-ID') ?? undefined),
        status: getStudentStatus(progress, user.isActive),
        isActive: user.isActive,
        isCompleted: progress >= 100,
        completedModules,
        totalModules,
      };
    });
}
