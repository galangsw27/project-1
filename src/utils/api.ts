// utils/api.ts
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const checkSession = async (token: string | undefined) => {
  try {
    const response = await fetch(`${baseURL}/sessions?key=mysupersecretkey`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('No Data:', error);
    return null;
  }
};

export const checkQr = async (token: string | undefined, nameSession: string | undefined, countSession: number) => {
  try {
    const response = await fetch(`${baseURL}/session-status?session=${nameSession}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok ${response.statusText}`);
    }

    const data: any = await response.json();
    const isConnected = data?.status === true;

    return {
      activeImg: '/assets/img/active.png',
      waitImg: '/assets/img/wait.png',
      nama: '',
      number: '',
      isConnected,
      device: countSession,
    };
  } catch (error) {
    console.error('Error checking QR:', error);
    return null;
  }
};


export const blastStat = async (token: string | undefined, nameSession: any ) => {
  
  try {
    const response = await fetch(`${baseURL}/message-blast-statistics?session=${nameSession}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
    return data
  } catch (error: any) {
    console.error('No data blast on DB:');
  }
}


export const resendtStat = async (token: string | undefined, nameSession: any ) => {
  
  try {
    const response = await fetch(`${baseURL}/message-resend-statistics?session=${nameSession}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      
      throw new Error(`Error fetching data : ${response.statusText}`);
    
    }

    const data = await response.json();
    return data
  } catch (error: any) {
    console.error('No data resend on DB:');
  }
}
