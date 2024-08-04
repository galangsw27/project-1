// app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/option';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const token = session?.user.authToken;

  const { email, password, role } = await req.json();

  try {
    const response = await fetch(`${baseURL}/register`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password,
        role: role
      })
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok ${response.statusText}`);
    }

    return NextResponse.json({ message: 'Registration successful' }, { status: 200 });

  } catch (error) {
    console.error('Failed to register', error);
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
  }
}
