import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, setSessionCookie, logAudit } from '@/lib/auth';
import { registerSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid registration details' },
        { status: 400 }
      );
    }

    const { name, email, password, role } = parsed.data;

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email address already exists' },
        { status: 409 }
      );
    }

    // Hash password securely
    const hashedPassword = await hashPassword(password);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || 'OPERATOR',
      },
    });

    const sessionPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'ADMIN' | 'OPERATOR' | 'VIEWER',
    };

    await setSessionCookie(sessionPayload);
    await logAudit('USER_REGISTERED', `New account created: ${user.email} (${user.role})`);

    return NextResponse.json({
      status: 'ok',
      message: 'Account registered successfully',
      user: sessionPayload,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected server error occurred' },
      { status: 500 }
    );
  }
}
