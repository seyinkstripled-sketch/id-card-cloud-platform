import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { seedInitialData } from '@/lib/seed-data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await seedInitialData();
    const { code } = await params;

    // Search by staffId or qrVerificationCode
    const staff = await prisma.staffMember.findFirst({
      where: {
        OR: [
          { staffId: code.toUpperCase() },
          { qrVerificationCode: code },
        ],
      },
      select: {
        id: true,
        staffId: true,
        fullName: true,
        designation: true,
        department: true,
        bloodGroup: true,
        issueDate: true,
        expiryDate: true,
        status: true,
        photoUrl: true,
        createdAt: true,
      },
    });

    if (!staff) {
      return NextResponse.json(
        {
          verified: false,
          error: 'Invalid or unrecognized credential. This card record does not exist in the official hospital registry.',
        },
        { status: 404 }
      );
    }

    const now = new Date();
    const isExpired = new Date(staff.expiryDate) < now;
    const finalStatus = isExpired ? 'EXPIRED' : staff.status;

    // Log the verification attempt
    try {
      await prisma.auditLog.create({
        data: {
          action: 'CARD_VERIFIED',
          details: `Public QR verification for ${staff.fullName} (${staff.staffId}) - Result: ${finalStatus}`,
          ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
          staffId: staff.id,
        },
      });
    } catch (e) {
      console.error('Verify audit log error:', e);
    }

    return NextResponse.json({
      verified: true,
      institution: 'Federal Teaching Hospital, Ido-Ekiti',
      staff: {
        ...staff,
        status: finalStatus,
      },
      verificationTimestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json({ verified: false, error: 'Verification service error' }, { status: 500 });
  }
}
