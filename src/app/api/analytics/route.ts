import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { seedInitialData } from '@/lib/seed-data';

export async function GET() {
  try {
    await seedInitialData();
    await requireAuth();

    const now = new Date();

    const [
      totalStaff,
      activeCards,
      suspendedCards,
      allStaff,
      totalUsers,
      recentLogs,
    ] = await Promise.all([
      prisma.staffMember.count(),
      prisma.staffMember.count({
        where: {
          status: 'ACTIVE',
          expiryDate: { gte: now },
        },
      }),
      prisma.staffMember.count({
        where: { status: 'SUSPENDED' },
      }),
      prisma.staffMember.findMany({
        select: { department: true, expiryDate: true, status: true },
      }),
      prisma.user.count(),
      prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: {
          user: { select: { name: true, email: true } },
          staff: { select: { staffId: true, fullName: true } },
        },
      }),
    ]);

    // Count expired cards
    const expiredCards = allStaff.filter(
      (s) => s.status === 'EXPIRED' || new Date(s.expiryDate) < now
    ).length;

    // Aggregate by department
    const deptMap: Record<string, number> = {};
    for (const s of allStaff) {
      deptMap[s.department] = (deptMap[s.department] || 0) + 1;
    }
    const departmentStats = Object.entries(deptMap).map(([department, count]) => ({
      department,
      count,
    }));

    return NextResponse.json({
      status: 'ok',
      analytics: {
        totalStaff,
        activeCards,
        expiredCards,
        suspendedCards,
        totalUsers,
        recentLogs,
        departmentStats,
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Analytics error' }, { status: 500 });
  }
}
