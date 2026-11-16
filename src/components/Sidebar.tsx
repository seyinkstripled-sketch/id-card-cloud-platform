'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Palette,
  ShieldCheck,
  FileClock,
  Sparkles,
  X,
  CreditCard,
} from 'lucide-react';
import { UserSession } from '@/types';

interface SidebarProps {
  user?: UserSession | null;
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: 'Staff Registry',
    href: '/staff',
    icon: Users,
    badge: null,
  },
  {
    name: 'Issue New Card',
    href: '/staff/new',
    icon: UserPlus,
    badge: 'New',
  },
  {
    name: 'Card Studio',
    href: '/studio',
    icon: Palette,
    badge: 'CR80',
  },
  {
    name: 'Public Verification',
    href: '/verify/P6014',
    icon: ShieldCheck,
    badge: 'Live',
  },
  {
    name: 'Audit Trail',
    href: '/audit-logs',
    icon: FileClock,
    badge: null,
    adminOnly: true,
  },
];

export default function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:z-auto`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-950">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>ID Studio</span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Cloud
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">FTH Ido-Ekiti System</div>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Operations
          </div>
          {navItems.map((item) => {
            if (item.adminOnly && user && user.role !== 'ADMIN') {
              return null;
            }

            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* System Information Card */}
        <div className="p-3 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CR80 Master Spec</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Standard 53.98 × 85.60 mm ISO/IEC 7810 format. 300 DPI vector output ready for direct card thermal printing.
            </p>
          </div>

          {user && (
            <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
              <div className="truncate">
                <span className="block font-medium text-slate-200 truncate">{user.name}</span>
                <span className="text-[10px] uppercase font-bold text-emerald-400">{user.role}</span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
