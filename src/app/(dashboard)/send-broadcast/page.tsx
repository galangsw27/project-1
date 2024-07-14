import React from 'react'
import Index from '@/app/(dashboard)/send-broadcast/index'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/option'
import { checkSession } from '../qrcode/page'



export default async function Page() {
  
  const getAllSession = await checkSession()
  const sessionNames = getAllSession.data.map((session: { session_name: string }) => session.session_name);


  return (
    <Index nameSession={sessionNames} />
  )
}

