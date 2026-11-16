import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { seedInitialData } from '@/lib/seed-data';

export async function GET() {
  await seedInitialData();
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  return NextResponse.json({
    authenticated: true,
    user,
  });
}
