import AiTutorClient from './AiTutorClient';

interface AiTutorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AiTutorPage({ params }: AiTutorPageProps) {
  const { id } = await params;
  const comicId = Number(id);

  return <AiTutorClient comicId={comicId} />;
}
