import { getDocs, onSnapshot } from 'firebase/firestore';

export async function safeGetDocs(collectionLabel: string, pathDescription: string, queryBuilder: () => any): Promise<any> {
  console.log('Reading collection:');
  console.log(collectionLabel);
  try {
    return await getDocs(queryBuilder());
  } catch (err: any) {
    const code = err?.code ?? err?.name ?? 'unknown';
    const message = err?.message ?? String(err);
    console.error(`Collection: ${collectionLabel}`);
    console.error(`Path: ${pathDescription}`);
    console.error(`Error: ${code}`);
    console.error(`Message: ${message}`);
    return { docs: [] } as any;
  }
}

export function safeOnSnapshot(queryObj: any, callback: (snap: any) => void, onError: ((e: any) => void) | undefined, collectionLabel: string, pathDescription: string) {
  console.log('Reading collection:');
  console.log(collectionLabel);
  return onSnapshot(
    queryObj,
    callback,
    (err: any) => {
      const code = err?.code ?? err?.name ?? 'unknown';
      const message = err?.message ?? String(err);
      console.error(`Collection: ${collectionLabel}`);
      console.error(`Path: ${pathDescription}`);
      console.error(`Error: ${code}`);
      console.error(`Message: ${message}`);
      if (onError) onError(err);
    }
  );
}
