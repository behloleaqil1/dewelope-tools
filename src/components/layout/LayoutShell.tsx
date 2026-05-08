'use client';

import { useState } from 'react';
import Header from './Header';
import NavigationSidebar from './NavigationSidebar';
import Footer from './Footer';

interface LayoutShellProps {
  children: React.ReactNode;
}

export default function LayoutShell({ children }: LayoutShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfc] font-sans">
      <Header
        onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        isSidebarOpen={sidebarOpen}
      />
      <div className="flex flex-1">
        <NavigationSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-4 md:p-8 max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
