import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies, headers } from 'next/headers';
import { prisma } from './prisma';
import { UserSession, Role } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-id-card-cloud-platform-32bytes';
const COOKIE_NAME = 'id_studio_session';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: UserSession): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSession;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<UserSession | null> {
  // 1. Check Authorization header
  try {
    const headerStore = await headers();
    const authHeader = headerStore.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const user = verifyToken(token);
      if (user) return user;
    }
  } catch {
    // ignore
  }

  // 2. Check Cookie
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (token) {
      return verifyToken(token);
    }
  } catch {
    // ignore
  }

  return null;
}

export async function setSessionCookie(session: UserSession): Promise<string> {
  const token = signToken(session);
  try {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: false, // Allows seamless operation on localhost HTTP and production HTTPS
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });
  } catch (err) {
    console.warn('Cookie set warning:', err);
  }
  return token;
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function logAudit(action: string, details: string, staffId?: string, ip?: string): Promise<void> {
  try {
    const session = await getSession();
    await prisma.auditLog.create({
      data: {
        action,
        details,
        userId: session?.id || null,
        staffId: staffId || null,
        ipAddress: ip || '127.0.0.1',
      },
    });
  } catch (err) {
    console.error('Audit log creation error:', err);
  }
}

export async function requireAuth(): Promise<UserSession> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function requireRole(allowedRoles: Role[]): Promise<UserSession> {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.role)) {
    throw new Error('Forbidden: Insufficient permissions');
  }
  return session;
}
