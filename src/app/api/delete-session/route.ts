
// app/api/create-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/option';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function DELETE(req: NextRequest) {
  const { session } = await req.json(); // Mengambil data dari body permintaan

  const resp = await getServerSession(authOptions);
  const token = resp?.user.authToken
  try {
  
const response = await fetch(`${baseURL}/delete-session?session=${session}&key=mysupersecretkey`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' // Tambahkan header ini jika diperlukan
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to delete ${response.statusText}`);
  }
  if (response.ok){
    return NextResponse.json(`Session ${session} deleted successfully.`)

  }


} catch (error) {
  console.error('Failed to fetch QR code data:', error);
  return NextResponse.json({ error: 'Failed to fetch QR code data' }, { status: 500 });
}
}
