// app/page.tsx
import React from 'react';
import Index from '@/app/(dashboard)/qrcode/index';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/option';

export const createSession = async (nameSession: string | undefined) => {
  try {
    const response = await fetch('http://localhost:5001/start-session?session='+ nameSession +'&scan=true');
    if (!response.ok) {
      throw new Error(`Network response was not ok ${response.statusText}`);
    }
    
    const html = await response.text();
    const dom = new JSDOM(html);
    const scriptContent = dom.window.document.querySelector("script").textContent;
    const base64Pattern = /data:image\/png;base64,[^')]+/;
    const match = base64Pattern.exec(scriptContent);
    const qrImage = match[0]

    if (match) {
      return qrImage;
    } else {
      console.log("No image source found");
    }
  } catch (error) {
    console.error('Failed to fetch QR code data:', error);
    return null;
  }
};

export const checkSession = async () => {
  try {
    const response = await fetch('http://localhost:5001/sessions?key=mysupersecretkey');
    const data = await response.json(); // Ambil data dari respons sebagai JSON
    return data;
  } catch (error) {
    console.error('No Data:', error);
    return null;
  }
};

async function checkQr(nameSession: string | undefined, countSession: number) {
  try {
    const response = await fetch('http://localhost:5001/session-status?session=' + nameSession );
    if (!response.ok) {
      throw new Error(`Network response was not ok ${response.statusText}`);
    }   

    const data = await response.json(); // Ambil data dari respons sebagai JSON
    const isConnected = data.status === true;

    // Simulasi data yang diambil dari API atau sumber data lainnya
    return {
      activeImg: '/assets/img/active.png',
      waitImg: '/assets/img/wait.png',
      nama: 'John Doe',
      number: '+6271927192',
      isConnected,
      device: countSession,
    };
  } catch (error) {
    console.error('Failed to fetch QR code data:', error);
    return null;
  }
}

export default async function Page() {
  const session = await getServerSession(authOptions);
  const nameSession = session?.user.email;

  const getSession = await checkSession();
  const countSession = getSession.data.length;
  const sessionNames = getSession.data.map((session: { session_name: string }) => session.session_name);

  const qrData = await checkQr(sessionNames, countSession);
  console.log(qrData);

  return (
    <Index qrData={qrData} sessionName={sessionNames} />
  );
}
