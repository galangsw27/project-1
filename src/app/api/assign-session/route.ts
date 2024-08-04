// app/api/assign-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/option';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: NextRequest) {
  const { userId, sessionName } = await req.json(); // Mengambil data dari body permintaan


  console.log(userId)
  console.log(sessionName)

  const resp = await getServerSession(authOptions);
  const token = resp?.user.authToken;

  try {
    const response = await fetch(`${baseURL}/assign-session`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' // Tambahkan header ini jika diperlukan
      },
      body: JSON.stringify({ userId, sessionName })
    });

    if (!response.ok) {
      throw new Error(`Failed to assign session: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ message: `Session ${sessionName} assigned to user ${userId} successfully.`, data });
  } catch (error) {
    console.error('Failed to assign session:', error);
    return NextResponse.json({ error: 'Failed to assign session' }, { status: 500 });
  }
}
