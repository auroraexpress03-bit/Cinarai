export interface AiAnalyticsOverview {
  totalStudents: number;
  averageScore: number | null;
  sintaksDifficulty: Record<string, number>;
  recentActivitiesCount: number;
  aiTutorUses: number;
  recentReflectionsCount: number;
}

export interface ClassProgressSummary {
  classLabel: string;
  studentCount: number;
  averageScore: number | null;
}
