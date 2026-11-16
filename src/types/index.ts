export type Role = 'ADMIN' | 'OPERATOR' | 'VIEWER';
export type CardStatus = 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'REVOKED';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface StaffRecord {
  id: string;
  staffId: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  designation: string;
  department: string;
  bloodGroup?: string | null;
  issueDate: string | Date;
  expiryDate: string | Date;
  status: CardStatus;
  photoUrl?: string | null;
  signatureUrl?: string | null;
  qrVerificationCode: string;
  notes?: string | null;
  barcodeData?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AuditLogRecord {
  id: string;
  action: string;
  details: string;
  ipAddress?: string | null;
  userId?: string | null;
  staffId?: string | null;
  createdAt: string | Date;
  user?: {
    name: string;
    email: string;
  } | null;
  staff?: {
    staffId: string;
    fullName: string;
  } | null;
}

export interface DashboardAnalytics {
  totalStaff: number;
  activeCards: number;
  expiredCards: number;
  suspendedCards: number;
  totalUsers: number;
  recentLogs: AuditLogRecord[];
  departmentStats: { department: string; count: number }[];
}
