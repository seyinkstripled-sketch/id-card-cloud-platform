import { NextResponse } from 'next/server';
import { clearSessionCookie, getSession, logAudit } from '@/lib/auth';

export async function POST() {
  const session = await getSession();
  if (session) {
    await logAudit('USER_LOGOUT', `User ${session.email} logged out`);
  }
  await clearSessionCookie();
  return NextResponse.json({ status: 'ok', message: 'Logged out successfully' });
}
