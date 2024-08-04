// app/api/get-all-users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/option';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET(req: NextRequest) {
  const resp = await getServerSession(authOptions);
  const token = resp?.user.authToken;

  try {
    const response = await fetch(`${baseURL}/get-all-users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' // Tambahkan header ini jika diperlukan
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get users: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ message: 'Users retrieved successfully.', data });
  } catch (error) {
    console.error('Failed to get users:', error);
    return NextResponse.json({ error: 'Failed to get users' }, { status: 500 });
  }
}
