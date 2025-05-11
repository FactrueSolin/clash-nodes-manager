import { ReactNode } from 'react';
import Link from 'next/link';
import LogoutButton from '@/app/commont/LogoutButton';
export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link href="/dashboard" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                控制台
              </Link>
              <Link href="/dashboard/proxy" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                节点管理
              </Link>
              <Link href="/dashboard/proxyurl" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                订阅管理
              </Link>
            </div>
            <div className="flex items-center">
              <LogoutButton />
            </div>
          </div>
        </nav>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}