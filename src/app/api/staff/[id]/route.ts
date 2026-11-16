import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, logAudit } from '@/lib/auth';
import { staffSchema } from '@/lib/validation';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    const staff = await prisma.staffMember.findFirst({
      where: {
        OR: [{ id }, { staffId: id }, { qrVerificationCode: id }],
      },
      include: {
        auditLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    return NextResponse.json({ status: 'ok', staff });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    if (session.role === 'VIEWER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = staffSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid update data' },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check staff exists
    const existing = await prisma.staffMember.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    const updated = await prisma.staffMember.update({
      where: { id },
      data: {
        staffId: data.staffId,
        fullName: data.fullName,
        designation: data.designation,
        department: data.department,
        email: data.email || null,
        phone: data.phone || null,
        bloodGroup: data.bloodGroup || null,
        expiryDate: new Date(data.expiryDate),
        status: data.status,
        photoUrl: data.photoUrl || existing.photoUrl,
        signatureUrl: data.signatureUrl || existing.signatureUrl,
        notes: data.notes || null,
      },
    });

    await logAudit(
      'STAFF_UPDATED',
      `Staff record ${updated.staffId} (${updated.fullName}) updated by ${session.name}`,
      updated.id
    );

    return NextResponse.json({
      status: 'ok',
      message: 'Staff updated successfully',
      staff: updated,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    if (session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Permission denied: Only administrators can delete records' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const existing = await prisma.staffMember.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    await prisma.staffMember.delete({
      where: { id },
    });

    await logAudit(
      'STAFF_DELETED',
      `Staff record ${existing.staffId} (${existing.fullName}) deleted by Admin ${session.name}`
    );

    return NextResponse.json({
      status: 'ok',
      message: `Staff record ${existing.staffId} deleted successfully`,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
