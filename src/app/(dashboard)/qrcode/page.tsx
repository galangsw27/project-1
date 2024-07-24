// app/page.tsx
import React from 'react';
import Index from '@/app/(dashboard)/qrcode/index';
import { checkSession, checkQr } from '@/utils/api'; // Adjust the path based on your file structure
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/option';

// Server Component function
export default async function Page() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.authToken;

  // Ambil session
  const getSession: any = await checkSession(token);
  console.log(getSession);
  const sessionNames = getSession ? getSession.data.map((session: { session_name: string }) => session.session_name) : [];
  const countSession = sessionNames.length;

  // Ambil data QR
  const qrData = await checkQr(token, sessionNames[0], countSession); // Assuming you are checking the first session

  return (
    <Index qrData={qrData ?? {
      activeImg: '/assets/img/active.png',
      waitImg: '/assets/img/wait.png',
      nama: '',
      number: '',
      device: 0,
      isConnected: false
    }} sessionName={sessionNames} />
  );
}
