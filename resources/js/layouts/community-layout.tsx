import React, { useState } from 'react'
import TopNavigation from '@/components/top-navigation';
import RightSidebar from '@/components/right-sidebar';
import LeftSidebar from '@/components/left-sidebar';
import { Advertisement } from '../types/advertisement';

export default function CommunityLayout({
  ads,
  children,
}: {
  children: React.ReactNode
  ads: Advertisement[]
}) {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [visiblePostsCount, setVisiblePostsCount] = useState<number | undefined>(undefined) 

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavigation />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
        <LeftSidebar visiblePostsCount={visiblePostsCount} /> 

          {/* Center Feed (1/2) */}
          <section className="col-span-12 md:col-span-6">
            {children}
          </section>

          {/* Right Sidebar (1/4) */}
          <aside className="col-span-12 md:col-span-3">
            {/* Ads sidebar */}
            <RightSidebar ads={ads} />
          </aside>
        </div>
      </main>
    </div>
  )
}
