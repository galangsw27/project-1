import React from 'react';
import Index from '@/app/(dashboard)/qrcode/index';
import { checkSession, checkQr } from '@/utils/api'; // Adjust the path based on your file structure
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/option';

// Define the type for the QR data
type QRData = {
  activeImg: string;
  waitImg: string;
  nama?: string;
  role: string;
  device: number;
  isConnected: boolean;
};

// Server Component function
export default async function Page() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.authToken;

  // Fetch session data
  const getSession: any = await checkSession(token);
  // console.log(getSession);
  const sessionNames = getSession ? getSession.data.map((session: { session_name: string }) => session.session_name) : [];
  const sessionId = getSession ? getSession.data.map((session: { id: number }) => session.id) : [];
  const countSession = sessionNames.length;

  // Fetch QR data
  const qrData = await checkQr(token, sessionNames[0], countSession); // Assuming you are checking the first session

  // Ensure qrData has required properties
  const defaultQrData: QRData = {
    activeImg: '/assets/img/active.png',
    waitImg: '/assets/img/wait.png',
    nama: session?.user.email ?? '', // Provide a default value for nama
    role: session?.user.role ?? 'Unknown', // Provide a default value for role
    device: 0,
    isConnected: false
  };

  return (
    <Index 
      qrData={qrData ?? defaultQrData} 
      sessionName={sessionNames} 
      sessionId={sessionId} 
    />
  );
}
