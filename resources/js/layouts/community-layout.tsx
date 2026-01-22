import React from 'react'
import TopNavigation from '@/components/top-navigation';
import RightSidebar from '@/components/right-sidebar';
import LeftSidebar from '@/components/left-sidebar';

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavigation />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
        <LeftSidebar />

          {/* Center Feed (1/2) */}
          <section className="col-span-12 md:col-span-6">
            {children}
          </section>

          {/* Right Sidebar (1/4) */}
          <aside className="col-span-12 md:col-span-3">
              <div className="rounded-xl border bg-white px-3">
                <RightSidebar/>
              </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
