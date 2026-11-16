import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // Only Admin & Operators can view audit logs
    await requireRole(['ADMIN', 'OPERATOR']);

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
        include: {
          user: { select: { name: true, email: true, role: true } },
          staff: { select: { staffId: true, fullName: true } },
        },
      }),
      prisma.auditLog.count(),
    ]);

    return NextResponse.json({
      status: 'ok',
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    if (error.message?.includes('Forbidden') || error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to retrieve audit logs' }, { status: 500 });
  }
}
