import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, setSessionCookie, logAudit } from '@/lib/auth';
import { loginSchema } from '@/lib/validation';
import { seedInitialData } from '@/lib/seed-data';

export async function POST(req: NextRequest) {
  try {
    // Ensure initial database seed runs if empty
    await seedInitialData();

    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password credentials' },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid email or password credentials' },
        { status: 401 }
      );
    }

    const sessionPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'ADMIN' | 'OPERATOR' | 'VIEWER',
    };

    const token = await setSessionCookie(sessionPayload);
    await logAudit('USER_LOGIN', `User ${user.email} logged in successfully`, undefined, req.headers.get('x-forwarded-for') || '127.0.0.1');

    return NextResponse.json({
      status: 'ok',
      message: 'Logged in successfully',
      user: sessionPayload,
      token,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected server error occurred' },
      { status: 500 }
    );
  }
}
