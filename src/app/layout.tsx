import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/Toast';

export const metadata: Metadata = {
  title: 'ID Studio Cloud | Federal Teaching Hospital, Ido-Ekiti',
  description:
    'Professional Cloud-Based ID Card Management, Issuance & Verification Platform for Federal Teaching Hospital, Ido-Ekiti.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-50 antialiased">
      <body className="min-h-full flex flex-col font-sans text-slate-800 bg-slate-50">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
