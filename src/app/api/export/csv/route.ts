import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, logAudit } from '@/lib/auth';

export async function GET() {
  try {
    const session = await requireAuth();

    const staffList = await prisma.staffMember.findMany({
      orderBy: { staffId: 'asc' },
    });

    // Generate CSV
    const headers = [
      'Staff ID',
      'Full Name',
      'Designation',
      'Department',
      'Email',
      'Phone',
      'Blood Group',
      'Issue Date',
      'Expiry Date',
      'Status',
      'Verification Code',
    ];

    const rows = staffList.map((s) => [
      `"${s.staffId}"`,
      `"${s.fullName.replace(/"/g, '""')}"`,
      `"${s.designation.replace(/"/g, '""')}"`,
      `"${s.department.replace(/"/g, '""')}"`,
      `"${s.email || ''}"`,
      `"${s.phone || ''}"`,
      `"${s.bloodGroup || ''}"`,
      `"${new Date(s.issueDate).toISOString().split('T')[0]}"`,
      `"${new Date(s.expiryDate).toISOString().split('T')[0]}"`,
      `"${s.status}"`,
      `"${s.qrVerificationCode}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    await logAudit('DATA_EXPORT_CSV', `Staff directory exported to CSV by ${session.name}`);

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="FTH_Staff_Directory_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
