// app/page.tsx
import React from 'react';
import Index from '@/app/(dashboard)/qrcode/index';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/option';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;


export const createSession = async (nameSession: string | undefined) => {
  try {
    const response = await fetch(`${baseURL}/start-session?session='+ nameSession +'&scan=true`);
    if (!response.ok) {
      throw new Error(`Network response was not ok ${response.statusText}`);
    }
    
    const html = await response.text();
    const dom = new JSDOM(html);
    const scriptElement = dom.window.document.querySelector("script");
    if (scriptElement) {
      const scriptContent = scriptElement.textContent;
      const base64Pattern = /data:image\/png;base64,[^')]+/;
      const match = base64Pattern.exec(scriptContent || '');
  
      if (match) {
          const qrImage = match[0];
          // Do something with qrImage
          return qrImage
      } else {
          console.log("No base64 image found in the script content");
          // Handle the case where no base64 image is found
      }
  } else {
      console.log("No script element found");
      // Handle the case where no script element is found
  }
  } catch (error) {
    console.error('Failed to fetch QR code data:', error);
    return null;
  }
};

export const checkSession = async () => {
  try {
    const response = await fetch(`${baseURL}/sessions?key=mysupersecretkey`);
    const data = await response.json(); // Ambil data dari respons sebagai JSON
    console.log(data)
    return data;
  } catch (error) {
    console.error('No Data:', error);
    return null;
  }
};

async function checkQr(nameSession: string | undefined | '', countSession: number) {
  try {
    const nameSession = null
    const response = await fetch(`${baseURL}/session-status?session=` + nameSession );
    if (!response.ok) {
      throw new Error(`Network response was not ok ${response.statusText}`);
    }   

    const data = await response.json(); // Ambil data dari respons sebagai JSON
    if(data){
    const data: { status?: boolean } = {}; // Assuming `data` is an object that might or might not have `status`
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
  }
  } catch (error) {
    
    return null;
  }
}



export default async function Page() {
  const session = await getServerSession(authOptions);
  const nameSession = session?.user.email;

  const getSession: any = await checkSession();
  const sessionNames = getSession ? getSession.data.map((session: { session_name: string }) => session.session_name) : [];
  const countSession = sessionNames.length;

  let qrData = await checkQr(sessionNames, countSession);

  if (qrData === null || qrData === undefined) {
    qrData = {
        activeImg: '/assets/img/active.png',
        waitImg: '/assets/img/wait.png',
        nama: 'John Doe',
        number: '+6271927192',
        device: 0,
        isConnected: false
    };
}
  return (
    <Index qrData={qrData} sessionName={sessionNames} />
  );
}
