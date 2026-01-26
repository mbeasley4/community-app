import Fit30DayCounter from "./fit30-day-counter";
import ProfileSidebar from "./profile-sidebar";
import AdminMenu from "./admin-menu"
import { Advertisement } from "@/types/advertisement"

type Props = {
  visiblePostsCount?: number
  ads?: Advertisement[]
}

export default function LeftSidebarOnly({ visiblePostsCount, ads = [] }: Props) {
    return (
        <>
            {/* Left Sidebar (1/4) */}
            <aside className="col-span-12 md:col-span-3">
                <div className="rounded-xl border bg-white mb-2 p-4">
                    <Fit30DayCounter startDate="2026-01-05" />
                </div>
                <div className="rounded-xl border bg-white mb-2 p-4">
                    <ProfileSidebar visiblePostsCount={visiblePostsCount} />
                </div>
                {ads.map(ad => (
                    <a key={ad.id} href={ad.link_url ?? '#'} target="_blank">
                    <img
                        src={ad.image_url}
                        alt={ad.title ?? 'advertisement'}
                        className="w-auto my-3 rounded-md"
                    />
                    </a>
                ))}
                {/* Admin-only menu */}
                <AdminMenu />
                
            </aside>
        </>
    );
}