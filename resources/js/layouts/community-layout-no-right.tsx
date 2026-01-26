import React, { useState } from 'react'
import TopNavigation from '@/components/top-navigation'
import LeftSidebarOnly from '@/components/left-sidebar-only'
import { Advertisement } from '../types/advertisement'

export default function CommunityLayoutNoRight({
  ads,
  children,
}: {
  children: React.ReactNode
  ads?: Advertisement[]
}) {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [visiblePostsCount, setVisiblePostsCount] = useState<number | undefined>(undefined) 

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavigation />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
        <LeftSidebarOnly visiblePostsCount={visiblePostsCount} ads={ads} />

          {/* Center Feed (2/3) */}
          <section className="col-span-12 md:col-span-9">
            {/* Inject callback into children if it's PostFeed */}
            {children}
          </section>
        </div>
      </main>
    </div>
  )
}
