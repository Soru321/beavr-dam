import { ReactNode } from 'react';

import { SideNavbar } from '@/components/admin/navigation/side-navbar';
import { TopNavbar } from '@/components/admin/navigation/top-navbar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SideNavbar />

      <div style={{ width: "calc(100% - 320px)" }} className="min-h-full grow">
        <TopNavbar />
        <main className="mx-auto min-h-full max-w-screen-2xl p-4 !py-32 md:p-10 2xl:p-20">
          {children}
        </main>
      </div>
    </div>
  );
}
