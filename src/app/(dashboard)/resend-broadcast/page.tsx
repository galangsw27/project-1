import React from 'react'
import Index from '@/app/(dashboard)/resend-broadcast/index'
import { checkSession } from '@/utils/api'; 
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/option';


export default async function Page() {
  
  
  const session = await getServerSession(authOptions);
  const token = session?.user?.authToken;
  const getAllSession: any = await checkSession(token)
  const sessionNames: string = getAllSession.data.map((session: { session_name: string }) => session.session_name);


  return (
    <Index nameSession={sessionNames} />
  )
}
