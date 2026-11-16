'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, LogOut, User, Menu, Search, CreditCard } from 'lucide-react';
import { UserSession } from '@/types';

interface NavbarProps {
  user?: UserSession | null;
  onToggleSidebar?: () => void;
}

export default function Navbar({ user, onToggleSidebar }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 text-slate-600 rounded-lg lg:hidden hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-800 flex items-center justify-center text-white font-bold shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg block leading-tight">
                ID Studio <span className="text-emerald-700">Cloud</span>
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:block leading-tight font-medium">
                Federal Teaching Hospital, Ido-Ekiti
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/verify/P6014"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-full border border-emerald-200 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-700" />
            <span>Public Verify Portal</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900 leading-tight">{user.name}</span>
                <span className="text-[10px] uppercase font-semibold text-emerald-700 tracking-wider">
                  {user.role}
                </span>
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-semibold text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
