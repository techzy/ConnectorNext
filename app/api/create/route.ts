// app/api/create/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, link } = body;

    // Create a new document with auto-generated ID
    const docRef = await db.collection('users').add({
      email,
      link,
    });

    console.log(email)

    return NextResponse.json({ redirect_url: `/impression/${docRef.id}` });
  } catch (error) {
    console.error('Firebase Error:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}