import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/option';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: NextRequest) {
  try {
    // Mengambil session dari NextAuth
    const session2 = await getServerSession(authOptions);
    const token = session2?.user?.authToken;
    const formData = await req.formData();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 14400000); // 10 seconds timeout

    try {
    const response = await fetch(`${baseURL}/resend-all-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        
      },
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Network response was not ok ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (fetchError:any ) {
    if (fetchError.name === 'AbortError') {
      console.error('Request timed out');
      return NextResponse.json({ error: 'Request timed out' }, { status: 408 });
    }
    console.error('Fetch error:', fetchError);
    return NextResponse.json({ error: 'Failed to send blast message' }, { status: 500 });
  }
} catch (error) {
  console.error('Failed to process request:', error);
  return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
}
}
