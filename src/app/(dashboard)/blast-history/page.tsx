import React from 'react'
import Index, { Session } from '@/app/(dashboard)/blast-history/index'
import { blastStat, checkSession } from '@/utils/api'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/option'

interface PageProps {
  sessions: Session[]
}

export default async function Page() {
  const session: any = await getServerSession(authOptions);
  const token = session?.user?.authToken;

  const getAllSession: any = await checkSession(token);
  const sessionNames = getAllSession ? getAllSession.data.map((session: any) => session.session_name) : [];

  let sessions: Session[] = [];
  
  try {
    const response: any = await blastStat(token, sessionNames);
    const responseData = await response;
    
    // Validate responseData format
    if (responseData && responseData.data && Array.isArray(responseData.data)) {
      sessions = responseData.data.map((session: any) => ({
        sessionId: session.session_id,
        session_name: session.session_id, // Adjust if session_name is available
        success_count: session.success_count,
        failure_count: session.failure_count,
        skipped_count: session.skipped_count
      }));
    } else {
      console.error('Invalid response format:', responseData);
    }
  } catch (error) {
    console.error('Error fetching blast statistics:', error);
  }
  return (
    <Index sessions={sessions} />
  )
}
