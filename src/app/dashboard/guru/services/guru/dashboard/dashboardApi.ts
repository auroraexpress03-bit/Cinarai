import { getUserToken } from '@/lib/firebase/auth';
import type { ActivityDocument, ComicDocument, ComicProgressDocument, ReflectionDocument, UserDocument } from '@/types/firestore';

export type GuruDashboardApiResponse = {
  students: UserDocument[];
  comics: ComicDocument[];
  progressDocuments: ComicProgressDocument[];
  activities: ActivityDocument[];
  reflections: ReflectionDocument[];
  generatedAt?: string;
};

export async function fetchGuruDashboardFromApi(): Promise<GuruDashboardApiResponse> {
  try {
    const token = await getUserToken();
    if (!token) {
      console.error('[GuruDashboard API Client] Error: Sesi guru tidak tersedia');
      throw new Error('Sesi guru tidak tersedia. Silakan masuk kembali.');
    }

    console.log('[GuruDashboard API Client] Fetching /api/dashboard/guru with token');

    const response = await fetch('/api/dashboard/guru', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    console.log('[GuruDashboard API Client] Response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorPayload: any = {};
      try {
        errorPayload = await response.json();
        console.error('[GuruDashboard API Client] API error response:', errorPayload);
      } catch (parseError) {
        console.error('[GuruDashboard API Client] Failed to parse error response:', parseError instanceof Error ? parseError.message : parseError);
      }

      const errorMessage = errorPayload.error ?? `HTTP ${response.status}: Gagal memuat dashboard guru`;
      console.error('[GuruDashboard API Client] API request failed:', errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json() as GuruDashboardApiResponse;
    console.log('[GuruDashboard API Client] API response received:', {
      studentsCount: data.students?.length ?? 0,
      comicsCount: data.comics?.length ?? 0,
      progressCount: data.progressDocuments?.length ?? 0,
      activitiesCount: data.activities?.length ?? 0,
      reflectionsCount: data.reflections?.length ?? 0,
      generatedAt: data.generatedAt,
    });

    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Gagal memuat dashboard guru';
    console.error('[GuruDashboard API Client] Fetch error:', {
      message: errorMessage,
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}
