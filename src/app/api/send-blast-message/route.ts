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


    const selectedSession: any = formData.get('session');
    const message: any = formData.get('message');
    const image: any = formData.get('image');
    const minDelay: any = formData.get('minDelay');
    const maxDelay: any = formData.get('maxDelay');
    const numbers: any = formData.getAll('to[]');
    
    console.log(selectedSession, message, image, minDelay, maxDelay, numbers);


    const response = await fetch(`${baseURL}/send-blast-message`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
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
