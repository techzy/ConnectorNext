// app/api/send_email/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { phone, target_email, user_id } = await request.json();

    // 1. Fetch user from Firestore
    const doc = await db.collection('users').doc(user_id).get();

    if (!doc.exists) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userData = doc.data();
    const ownerEmail = userData?.email;

    // 2. Setup Nodemailer (Replaces smtplib)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // 3. Send Email
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: ownerEmail,
      subject: 'Meeting Request',
      text: `You have a new meeting request from ${target_email}, please contact them at ${phone}`,
    });

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email Error:', error);
    return NextResponse.json({ message: 'Error sending email' }, { status: 500 });
  }
}