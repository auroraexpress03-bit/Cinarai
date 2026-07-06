import ObservasiClient from './ObservasiClient';

interface ObservasiPageProps {
  params: Promise<{ id: string }>;
}

export default async function ObservasiPage({ params }: ObservasiPageProps) {
  const { id } = await params;
  const comicId = Number(id);
  return <ObservasiClient comicId={comicId} />;
}
