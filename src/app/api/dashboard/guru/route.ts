import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminFirestore, verifyIdToken } from '@/lib/firebase/admin';
import type { ActivityDocument, ComicDocument, ComicProgressDocument, ReflectionDocument, UserDocument } from '@/types/firestore';
import type { DocumentSnapshot } from 'firebase-admin/firestore';

function serializeUser(document: DocumentSnapshot): UserDocument {
  const data = document.data() as Partial<UserDocument> | undefined;
  return {
    id: document.id,
    uid: data?.uid ?? document.id,
    email: data?.email ?? '',
    displayName: data?.displayName,
    photoURL: data?.photoURL,
    role: (data?.role as UserDocument['role']) ?? 'student',
    schoolName: data?.schoolName,
    gradeLevel: data?.gradeLevel,
    isActive: data?.isActive ?? true,
    lastLoginAt: data?.lastLoginAt as UserDocument['lastLoginAt'],
    createdAt: data?.createdAt as UserDocument['createdAt'],
    updatedAt: data?.updatedAt as UserDocument['updatedAt'],
  };
}

function serializeProgress(document: DocumentSnapshot): ComicProgressDocument {
  const data = document.data() as Partial<ComicProgressDocument> | undefined;
  return {
    id: document.id,
    userId: data?.userId ?? document.ref.parent.parent?.id ?? '',
    comicId: data?.comicId ?? Number(document.id.replace('comic-', '')),
    completedStage: data?.completedStage ?? '',
    completedPages: data?.completedPages ?? 0,
    percentage: data?.percentage ?? 0,
    status: data?.status ?? 'not_started',
    sintaksList: data?.sintaksList ?? [],
    introspection: data?.introspection,
    completedAt: data?.completedAt as ComicProgressDocument['completedAt'],
    updatedAt: data?.updatedAt as ComicProgressDocument['updatedAt'],
    createdAt: data?.createdAt as ComicProgressDocument['createdAt'],
  };
}

function serializeActivity(document: DocumentSnapshot): ActivityDocument {
  const data = document.data() as Partial<ActivityDocument> | undefined;
  return {
    id: document.id,
    userId: data?.userId ?? '',
    type: data?.type ?? 'login',
    title: data?.title ?? '',
    description: data?.description,
    metadata: data?.metadata,
    occurredAt: data?.occurredAt as ActivityDocument['occurredAt'],
  };
}

function serializeReflection(document: DocumentSnapshot): ReflectionDocument {
  const data = document.data() as Partial<ReflectionDocument> | undefined;
  return {
    id: document.id,
    userId: data?.userId,
    studentId: data?.studentId,
    moduleId: data?.moduleId,
    comicId: data?.comicId,
    prompt: data?.prompt,
    response: data?.response,
    selectedChecklist: data?.selectedChecklist,
    checklist: data?.checklist,
    rating: data?.rating,
    confidence: data?.confidence,
    reflectionText: data?.reflectionText,
    aiReflection: data?.aiReflection,
    jawaban: data?.jawaban,
    timestamp: data?.timestamp as ReflectionDocument['timestamp'],
    stage: data?.stage,
    status: data?.status,
    submittedAt: data?.submittedAt as ReflectionDocument['submittedAt'],
    createdAt: data?.createdAt as ReflectionDocument['createdAt'],
    updatedAt: data?.updatedAt as ReflectionDocument['updatedAt'],
  };
}

function serializeComic(document: DocumentSnapshot): ComicDocument {
  const data = document.data() as Partial<ComicDocument> | undefined;
  return {
    id: document.id,
    comicId: data?.comicId ?? Number(document.id),
    slug: data?.slug ?? document.id,
    title: data?.title ?? document.id,
    subtitle: data?.subtitle ?? '',
    kelas: data?.kelas ?? '',
    lokasi: data?.lokasi ?? '',
    synopsis: data?.synopsis ?? '',
    characters: data?.characters ?? [],
    learningTargets: data?.learningTargets ?? [],
    estimatedMinutes: data?.estimatedMinutes ?? 0,
    pdfUrl: data?.pdfUrl ?? null,
    coverUrl: data?.coverUrl ?? '',
    thumbnailUrl: data?.thumbnailUrl ?? '',
    order: data?.order ?? 0,
    availability: data?.availability ?? 'ACTIVE',
    createdAt: data?.createdAt as ComicDocument['createdAt'],
    updatedAt: data?.updatedAt as ComicDocument['updatedAt'],
  };
}

export async function GET(request: NextRequest) {
  const headerValue = request.headers.get('authorization');
  const token = headerValue?.startsWith('Bearer ') ? headerValue.slice(7) : null;

  if (!token) {
    console.warn('[GuruDashboard API] Unauthorized: token not provided');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const decodedToken = await verifyIdToken(token);
  if (!decodedToken || !decodedToken.uid) {
    console.warn('[GuruDashboard API] Unauthorized: invalid token');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const uid = decodedToken.uid;
  console.log('[GuruDashboard API] GET /api/dashboard/guru - uid:', uid);

  if (!adminAuth) {
    console.error('[GuruDashboard API] Admin auth unavailable');
    return NextResponse.json({ error: 'Admin auth unavailable' }, { status: 500 });
  }

  if (!adminFirestore) {
    console.error('[GuruDashboard API] Admin firestore unavailable');
    return NextResponse.json({ error: 'Admin firestore unavailable' }, { status: 500 });
  }

  // Fetch user profile to check role
  let role: string | undefined;
  try {
    const profileSnapshot = await adminFirestore.collection('users').doc(uid).get();
    console.log('[GuruDashboard API] User profile query - exists:', profileSnapshot.exists);
    role = profileSnapshot.exists ? (profileSnapshot.data()?.role as string | undefined) : undefined;
    console.log('[GuruDashboard API] User role:', role, '- email:', profileSnapshot.data()?.email);
  } catch (error) {
    console.error('[GuruDashboard API] Error fetching user profile:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }

  if (role !== 'teacher' && role !== 'admin') {
    console.warn('[GuruDashboard API] Forbidden: user role is not teacher or admin. Role:', role);
    return NextResponse.json({ error: 'Akun ini bukan akun guru.' }, { status: 403 });
  }

  // Use Promise.allSettled for resilience
  const results = await Promise.allSettled([
    (async () => {
      try {
        console.log('[GuruDashboard API] Querying users where role == student...');
        const snap = await adminFirestore.collection('users').where('role', '==', 'student').get();
        console.log('[GuruDashboard API] Students query - found:', snap.docs.length, 'documents');
        return snap;
      } catch (error) {
        console.error('[GuruDashboard API] Error querying students:', error instanceof Error ? error.message : error);
        throw error;
      }
    })(),
    (async () => {
      try {
        console.log('[GuruDashboard API] Querying comics collection...');
        const snap = await adminFirestore.collection('comics').get();
        console.log('[GuruDashboard API] Comics query - found:', snap.docs.length, 'documents');
        return snap;
      } catch (error) {
        console.error('[GuruDashboard API] Error querying comics:', error instanceof Error ? error.message : error);
        throw error;
      }
    })(),
    (async () => {
      try {
        console.log('[GuruDashboard API] Querying collectionGroup progress...');
        const snap = await adminFirestore.collectionGroup('progress').get();
        console.log('[GuruDashboard API] Progress query - found:', snap.docs.length, 'documents');
        return snap;
      } catch (error) {
        console.error('[GuruDashboard API] Error querying progress:', error instanceof Error ? error.message : error);
        throw error;
      }
    })(),
    (async () => {
      try {
        console.log('[GuruDashboard API] Querying activity collection (limit 20)...');
        const snap = await adminFirestore.collection('activity').orderBy('occurredAt', 'desc').limit(20).get();
        console.log('[GuruDashboard API] Activity query - found:', snap.docs.length, 'documents');
        return snap;
      } catch (error) {
        console.error('[GuruDashboard API] Error querying activity:', error instanceof Error ? error.message : error);
        throw error;
      }
    })(),
    (async () => {
      try {
        console.log('[GuruDashboard API] Querying reflection collection (limit 200)...');
        const snap = await adminFirestore.collection('reflection').orderBy('createdAt', 'desc').limit(200).get();
        console.log('[GuruDashboard API] Reflection query - found:', snap.docs.length, 'documents');
        return snap;
      } catch (error) {
        console.error('[GuruDashboard API] Error querying reflection:', error instanceof Error ? error.message : error);
        throw error;
      }
    })(),
  ]);

  // Process results
  const studentsSnapshot = results[0]?.status === 'fulfilled' ? results[0].value : null;
  const comicsSnapshot = results[1]?.status === 'fulfilled' ? results[1].value : null;
  const progressSnapshot = results[2]?.status === 'fulfilled' ? results[2].value : null;
  const activitySnapshot = results[3]?.status === 'fulfilled' ? results[3].value : null;
  const reflectionsSnapshot = results[4]?.status === 'fulfilled' ? results[4].value : null;

  const students = studentsSnapshot ? studentsSnapshot.docs.map(serializeUser) : [];
  const comics = comicsSnapshot ? comicsSnapshot.docs.map(serializeComic) : [];
  const progressDocuments = progressSnapshot ? progressSnapshot.docs.map(serializeProgress) : [];
  const activities = activitySnapshot ? activitySnapshot.docs.map(serializeActivity) : [];
  const reflections = reflectionsSnapshot ? reflectionsSnapshot.docs.map(serializeReflection) : [];

  console.log('[GuruDashboard API] API response prepared:', {
    studentsCount: students.length,
    comicsCount: comics.length,
    progressCount: progressDocuments.length,
    activitiesCount: activities.length,
    reflectionsCount: reflections.length,
  });

  return NextResponse.json({
    students,
    comics,
    progressDocuments,
    activities,
    reflections,
    generatedAt: new Date().toISOString(),
  });
}
