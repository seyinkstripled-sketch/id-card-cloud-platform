import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, logAudit } from '@/lib/auth';
import { resetPasswordSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }

    const { email, newPassword } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't leak user existence in public response, but return ok message
      return NextResponse.json({
        status: 'ok',
        message: 'If an account exists for this email, password has been updated.',
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await logAudit('PASSWORD_RESET', `Password reset executed for ${user.email}`);

    return NextResponse.json({
      status: 'ok',
      message: 'Password has been successfully updated. You may now login.',
    });
  } catch (error: any) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
