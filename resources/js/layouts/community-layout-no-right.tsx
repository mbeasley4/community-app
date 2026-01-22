import React from 'react'
import TopNavigation from '@/components/top-navigation';
import LeftSidebar from '@/components/left-sidebar';

export default function CommunityLayoutNoRight({
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

          {/* Center Feed (2/3) */}
          <section className="col-span-12 md:col-span-9">
            {children}
          </section>
        </div>
      </main>
    </div>
  )
}
