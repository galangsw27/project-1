import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/option';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: NextRequest) {
  const formData = new FormData();

  try {
    // Mengambil session dari NextAuth
    const session2 = await getServerSession(authOptions);
    const token = session2?.user?.authToken;

    // Menerima data dari request
    const { session: selectedSession, editedMessage, image, minDelay, maxDelay } = await req.formData();
    
    formData.append('session', selectedSession);
    formData.append('editedMessage', editedMessage);
    formData.append('image', image);
    formData.append('minDelay', minDelay);
    formData.append('maxDelay', maxDelay);

    const response = await fetch(`${baseURL}/resend-all-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // 'Content-Type': 'multipart/form-data' // FormData sudah mengatur header ini secara otomatis
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to process request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
