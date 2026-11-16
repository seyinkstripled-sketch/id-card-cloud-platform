import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, logAudit } from '@/lib/auth';
import { staffSchema } from '@/lib/validation';
import { seedInitialData } from '@/lib/seed-data';

export async function GET(req: NextRequest) {
  try {
    await seedInitialData();
    const session = await requireAuth();

    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';
    const department = url.searchParams.get('department') || '';
    const status = url.searchParams.get('status') || '';
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { staffId: { contains: search } },
        { fullName: { contains: search } },
        { designation: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (department && department !== 'ALL') {
      where.department = department;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    const [staff, total] = await Promise.all([
      prisma.staffMember.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.staffMember.count({ where }),
    ]);

    return NextResponse.json({
      status: 'ok',
      staff,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    console.error('Fetch staff error:', error);
    return NextResponse.json({ error: 'Failed to fetch staff directory' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();

    // Check operator/admin permission
    if (session.role === 'VIEWER') {
      return NextResponse.json({ error: 'Permission denied: Viewers cannot create staff' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = staffSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid staff data' },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check if staffId already exists
    const existing = await prisma.staffMember.findUnique({
      where: { staffId: data.staffId },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Staff ID "${data.staffId}" is already registered in the system` },
        { status: 409 }
      );
    }

    const newStaff = await prisma.staffMember.create({
      data: {
        staffId: data.staffId,
        fullName: data.fullName,
        designation: data.designation,
        department: data.department,
        email: data.email || null,
        phone: data.phone || null,
        bloodGroup: data.bloodGroup || null,
        issueDate: data.issueDate ? new Date(data.issueDate) : new Date(),
        expiryDate: new Date(data.expiryDate),
        status: data.status,
        photoUrl: data.photoUrl || null,
        signatureUrl: data.signatureUrl || null,
        notes: data.notes || null,
      },
    });

    await logAudit(
      'STAFF_CREATED',
      `Staff ${newStaff.fullName} (${newStaff.staffId}) created by ${session.name}`,
      newStaff.id
    );

    return NextResponse.json({
      status: 'ok',
      message: 'Staff member created successfully',
      staff: newStaff,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    console.error('Create staff error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
