import { collectionGroup, onSnapshot, query } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/client';
import { subscribeToFirestoreCollection } from '@/services/firestore';
import type {
  ActivityDocument,
  ComicDocument,
  ComicProgressDocument,
  ReflectionDocument,
  UserDocument,
} from '@/types/firestore';

export async function loadAllUsers(): Promise<UserDocument[]> {
  throw new Error('This method is not supported for realtime dashboard data.');
}

export function subscribeToUsers(
  callback: (users: UserDocument[]) => void,
  onError?: (error: Error) => void
) {
  console.log('Reading collection:');
  console.log('users');
  return subscribeToFirestoreCollection(
    'users',
    callback,
    {
      filters: [{ field: 'role', operator: '==', value: 'student' }],
      orderByField: 'displayName',
      orderDirection: 'asc',
    },
    (error) => {
      const code = (error as any)?.code ?? (error as any)?.name ?? 'unknown';
      const message = error instanceof Error ? error.message : String(error);
      console.error('Collection: users');
      console.error('Path: users');
      console.error('Error:', code);
      console.error('Message:', message);
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  );
}

export function subscribeToAllUsers(
  callback: (users: UserDocument[]) => void,
  onError?: (error: Error) => void
) {
  return subscribeToFirestoreCollection(
    'users',
    callback,
    {
      orderByField: 'displayName',
      orderDirection: 'asc',
    },
    onError
  );
}

export async function loadAllComics(): Promise<ComicDocument[]> {
  throw new Error('This method is not supported for realtime dashboard data.');
}

export function subscribeToComics(
  callback: (comics: ComicDocument[]) => void,
  onError?: (error: Error) => void
) {
  console.log('Reading collection:');
  console.log('comics');
  return subscribeToFirestoreCollection(
    'comics',
    callback,
    {
      orderByField: 'order',
      orderDirection: 'asc',
    },
    (error) => {
      const code = (error as any)?.code ?? (error as any)?.name ?? 'unknown';
      const message = error instanceof Error ? error.message : String(error);
      console.error('Collection: comics');
      console.error('Path: comics');
      console.error('Error:', code);
      console.error('Message:', message);
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  );
}

export async function loadRecentActivities(): Promise<ActivityDocument[]> {
  throw new Error('This method is not supported for realtime dashboard data.');
}

export function subscribeToRecentActivities(
  callback: (activities: ActivityDocument[]) => void,
  onError?: (error: Error) => void
) {
  console.log('Reading collection:');
  console.log('activity');
  return subscribeToFirestoreCollection(
    'activity',
    callback,
    {
      orderByField: 'occurredAt',
      orderDirection: 'desc',
      limitCount: 20,
    },
    (error) => {
      const code = (error as any)?.code ?? (error as any)?.name ?? 'unknown';
      const message = error instanceof Error ? error.message : String(error);
      console.error('Collection: activity');
      console.error('Path: activity');
      console.error('Error:', code);
      console.error('Message:', message);
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  );
}

export async function loadAllReflections(): Promise<ReflectionDocument[]> {
  throw new Error('This method is not supported for realtime dashboard data.');
}

export function subscribeToReflections(
  callback: (reflections: ReflectionDocument[]) => void,
  onError?: (error: Error) => void
) {
  console.log('Reading collection:');
  console.log('reflection');
  return subscribeToFirestoreCollection(
    'reflection',
    callback,
    {
      orderByField: 'createdAt',
      orderDirection: 'desc',
      limitCount: 200,
    },
    (error) => {
      const code = (error as any)?.code ?? (error as any)?.name ?? 'unknown';
      const message = error instanceof Error ? error.message : String(error);
      console.error('Collection: reflection');
      console.error('Path: reflection');
      console.error('Error:', code);
      console.error('Message:', message);
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  );
}

export async function loadAllProgressDocuments(): Promise<ComicProgressDocument[]> {
  throw new Error('This method is not supported for realtime dashboard data.');
}

export function subscribeToAllProgressDocuments(
  callback: (progressDocuments: ComicProgressDocument[]) => void,
  onError?: (error: Error) => void
) {
  const progressQuery = query(collectionGroup(firestore, 'progress'));
  return onSnapshot(
    progressQuery,
    (snapshot) => {
      callback(snapshot.docs.map((documentSnapshot) => documentSnapshot.data() as ComicProgressDocument));
    },
    (error) => {
      const code = (error as any)?.code ?? (error as any)?.name ?? 'unknown';
      const message = error instanceof Error ? error.message : String(error);
      console.error('Collection: progress');
      console.error('Path: collectionGroup(progress)');
      console.error('Error:', code);
      console.error('Message:', message);
      onError?.(error instanceof Error ? error : new Error('Failed to load progress'));
    }
  );
}
