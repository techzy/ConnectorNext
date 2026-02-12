// app/impression/[id]/page.tsx
import { db } from '@/lib/firebaseAdmin';
import { notFound } from 'next/navigation';
import ImpressionClient from './ImpressionClient';

// 1. Update the Props type to be a Promise
type Props = {
  params: Promise<{ id: string }>
}

export default async function ImpressionPage({ params }: Props) {
  // 2. Await the params object
  const { id } = await params;

  const docRef = db.collection('users').doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    notFound(); 
  }

  const data = doc.data();
  let youtubeLink = data?.link || '';

  if (youtubeLink.includes('watch?v=')) {
    const videoId = youtubeLink.split('watch?v=')[1].split('&')[0];
    youtubeLink = `https://www.youtube.com/embed/${videoId}`;
  }

  return <ImpressionClient youtubeLink={youtubeLink} userId={id} />;
}